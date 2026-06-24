import { Metadata } from 'next';
import { mockBrands } from '@/lib/mock-data/b2b';
import BrandProfileClient from './components/BrandProfileClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const brand = mockBrands.find(b => b.id === id);
  
  if (!brand) {
    return {
      title: 'Brand Not Found | Smart Wardrobe',
    };
  }

  return {
    title: `${brand.name} | Smart Wardrobe`,
    description: brand.description,
    openGraph: {
      images: [brand.coverUrl],
    }
  };
}

export default async function BrandProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = mockBrands.find(b => b.id === id);

  if (!brand) {
    notFound();
  }

  return <BrandProfileClient brandId={id} />;
}
