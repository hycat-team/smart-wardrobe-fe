import { Metadata } from 'next';
import ProductDetailClient from './components/ProductDetailClient';
import { serverFetch } from '@/lib/server-fetch';
import type { BrandItemRes } from '@/features/brand-portal/types';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await serverFetch<BrandItemRes>(`/brand-items/${id}`, {
    withAuth: false,
    revalidate: 300,
  });

  if (!product) {
    return { title: 'Sản phẩm | Closy' };
  }

  const title = `${product.name || 'Sản phẩm'} | Closy`;
  const description =
    product.description ||
    product.fashionItem?.description ||
    `Khám phá ${product.name || 'sản phẩm'} trên Closy.`;
  const image = product.fashionItem?.imageUrl;

  return {
    title,
    description,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return <ProductDetailClient productId={id} />;
}
