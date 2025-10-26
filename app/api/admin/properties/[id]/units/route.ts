import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type UnitPayload = {
  label?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  sqft?: string | number;
  rent?: string | number | null;
  available?: boolean;
  isHidden?: boolean;
};

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }){
  const { id } = await context.params;
  let payload: UnitPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object'){
    return NextResponse.json({ message: 'Unit details are required.' }, { status: 400 });
  }

  const required: Array<keyof UnitPayload> = ['label', 'bedrooms', 'bathrooms', 'sqft'];
  const missing = required.filter((field)=> payload[field] === undefined || payload[field] === null || payload[field] === '');
  if (missing.length){
    return NextResponse.json({ message: `Missing fields: ${missing.join(', ')}` }, { status: 400 });
  }

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property){
    return NextResponse.json({ message: 'Property not found.' }, { status: 404 });
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

  const available = payload.available === undefined ? true : Boolean(payload.available);
  const isHidden = Boolean(payload.isHidden);

  const unit = await prisma.unit.create({
    data: {
      propertyId: id,
      label: payload.label,
      bedrooms,
      bathrooms,
      sqft,
      rent,
      available,
      isHidden,
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
