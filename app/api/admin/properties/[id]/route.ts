import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFileFromS3 } from '@/lib/storage';

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }){
  const { id } = await context.params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      units: {
        include: { images: true },
      },
    },
  });

  if (!property){
    return NextResponse.json({ message: 'Property not found.' }, { status: 404 });
  }

  await prisma.property.delete({ where: { id } });

  const keysToRemove: string[] = [];
  if (property.heroImageKey){
    keysToRemove.push(property.heroImageKey);
  }
  for (const image of property.images){
    if (image.storageKey) keysToRemove.push(image.storageKey);
  }
  for (const unit of property.units){
    if (unit.coverImageKey) keysToRemove.push(unit.coverImageKey);
    for (const unitImage of unit.images){
      if (unitImage.storageKey) keysToRemove.push(unitImage.storageKey);
    }
  }

  for (const key of keysToRemove){
    try {
      await deleteFileFromS3(key);
    } catch {
      // Silently ignore clean-up errors to avoid failing the request
    }
  }

  return new NextResponse(null, { status: 204 });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }){
  const { id } = await context.params;
  const body = await request.json().catch(()=> null);
  if (!body){
    return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  const scalarFields = ['name', 'address', 'city', 'state', 'zip', 'status', 'type', 'description', 'bedroomsSummary', 'bathsSummary', 'sqftApprox'];
  for (const field of scalarFields){
    if (field in body){
      const value = body[field];
      data[field] = typeof value === 'string' ? value.trim() : value;
    }
  }

  if ('rentFrom' in body){
    const value = body.rentFrom;
    data.rentFrom = value === null || value === '' ? null : Number(value);
    if (data.rentFrom !== null && Number.isNaN(data.rentFrom)){
      return NextResponse.json({ message: 'rentFrom must be a number.' }, { status: 400 });
    }
  }

  if ('rentTo' in body){
    const value = body.rentTo;
    data.rentTo = value === null || value === '' ? null : Number(value);
    if (data.rentTo !== null && Number.isNaN(data.rentTo)){
      return NextResponse.json({ message: 'rentTo must be a number.' }, { status: 400 });
    }
  }

  if ('latitude' in body){
    const value = body.latitude;
    data.latitude = value === null || value === '' ? null : Number(value);
    if (data.latitude !== null && Number.isNaN(data.latitude)){
      return NextResponse.json({ message: 'latitude must be numeric.' }, { status: 400 });
    }
  }

  if ('longitude' in body){
    const value = body.longitude;
    data.longitude = value === null || value === '' ? null : Number(value);
    if (data.longitude !== null && Number.isNaN(data.longitude)){
      return NextResponse.json({ message: 'longitude must be numeric.' }, { status: 400 });
    }
  }

  if ('amenities' in body){
    if (!Array.isArray(body.amenities)){
      return NextResponse.json({ message: 'amenities must be an array.' }, { status: 400 });
    }
    data.amenities = body.amenities.map((item: string)=> String(item).trim()).filter(Boolean);
  }

  if ('hasUnits' in body){
    data.hasUnits = Boolean(body.hasUnits);
  }

  const property = await prisma.property.update({
    where: { id },
    data,
    include: {
      images: true,
      units: { include: { images: true } },
    },
  }).catch(()=>{
    return null;
  });

  if (!property){
    return NextResponse.json({ message: 'Property not found.' }, { status: 404 });
  }

  return NextResponse.json({ property });
}
