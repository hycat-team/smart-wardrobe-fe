import { Metadata } from 'next';
import { mockProducts } from '@/lib/mock-data/b2b';
import ProductDetailClient from './components/ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Smart Wardrobe',
    };
  }

  return {
    title: `${product.name} | Smart Wardrobe`,
    description: product.description,
    openGraph: {
      images: [product.imageUrls[0]],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find(p => p.id === id);

  if (!product && !id.startsWith("prod_custom_")) {
    notFound();
  }

  return <ProductDetailClient productId={id} />;
}
