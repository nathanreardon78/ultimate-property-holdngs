import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFileToS3 } from '@/lib/storage';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }){
  const { id } = await context.params;
  const formData = await request.formData();
  const rawPayload = formData.get('payload');

  if (typeof rawPayload !== 'string'){
    return NextResponse.json({ message: 'Missing payload.' }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ message: 'Invalid payload JSON.' }, { status: 400 });
  }

  const required = ['label', 'bedrooms', 'bathrooms', 'sqft'];
  const missing = required.filter((field)=> !payload[field] && payload[field] !== 0);
  if (missing.length){
    return NextResponse.json({ message: `Missing fields: ${missing.join(', ')}` }, { status: 400 });
  }

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property){
    return NextResponse.json({ message: 'Property not found.' }, { status: 404 });
  }

  const prefixBase = `properties/${property.slug || id}/units/${Date.now()}`;
  let cover: { url: string; key: string } | null = null;
  if (payload.coverImageField){
    const coverFile = formData.get(payload.coverImageField);
    if (coverFile instanceof File && coverFile.size > 0){
      cover = await uploadFileToS3(coverFile, `${prefixBase}/cover`);
    }
  }

  const galleryUploads: Array<{ url: string; key: string }> = [];
  for (const field of payload.galleryFields ?? []){
    const file = formData.get(field);
    if (file instanceof File && file.size > 0){
      const upload = await uploadFileToS3(file, `${prefixBase}/gallery`);
      galleryUploads.push(upload);
    }
  }

  let rent: number | null = null;
  if (payload.rent !== undefined && payload.rent !== null && payload.rent !== ''){
    const parsed = Number(payload.rent);
    if (Number.isNaN(parsed)){
      return NextResponse.json({ message: 'Rent must be a number.' }, { status: 400 });
    }
    rent = parsed;
  }

  const bedrooms = Number(payload.bedrooms);
  const bathrooms = Number(payload.bathrooms);
  const sqft = Number(payload.sqft);

  if ([bedrooms, bathrooms, sqft].some((value)=> Number.isNaN(value))){
    return NextResponse.json({ message: 'Bedrooms, bathrooms, and square footage must be numbers.' }, { status: 400 });
  }

  const unit = await prisma.unit.create({
    data: {
      propertyId: id,
      label: payload.label,
      bedrooms,
      bathrooms,
      sqft,
      rent,
      available: Boolean(payload.available),
      isHidden: Boolean(payload.isHidden),
      coverImage: cover?.url ?? null,
      coverImageKey: cover?.key ?? null,
      images: {
        create: galleryUploads.map((upload, index)=> ({
          url: upload.url,
          storageKey: upload.key,
          order: index,
        })),
      },
    },
    include: { images: true },
  });

  if (!property.hasUnits){
    await prisma.property.update({
      where: { id },
      data: { hasUnits: true },
    });
  }

  return NextResponse.json({ unit });
}
