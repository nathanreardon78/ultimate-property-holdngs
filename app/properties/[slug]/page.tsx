import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/properties';
import PropertyDetailClient from './PropertyDetailClient';

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return notFound();
  return <PropertyDetailClient property={property} />;
}
