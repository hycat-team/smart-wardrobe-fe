import { Metadata } from 'next';
import ProductDetailClient from './components/ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Product ${id} | Smart Wardrobe`,
    description: "Product details on Smart Wardrobe",
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}
