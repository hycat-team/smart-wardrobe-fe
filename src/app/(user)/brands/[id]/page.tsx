import BrandProfileClient from './components/BrandProfileClient';
import { mockBrands } from '@/lib/mock-data/b2b';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const brand = mockBrands.find((b) => b.id === id);
  if (!brand) return { title: 'Brand Not Found' };
  return { title: `${brand.name} | Smart Wardrobe` };
}

export default async function BrandProfilePage({ params }: Props) {
  const { id } = await params;
  const brand = mockBrands.find((b) => b.id === id);
  
  if (!brand) {
    notFound();
  }

  return <BrandProfileClient brandId={id} />;
}
