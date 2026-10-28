import { Metadata } from 'next';
import { BrandProductsClient } from './components/BrandProductsClient';

export const metadata: Metadata = {
  title: 'Quản lý Sản phẩm | Brand Workspace',
};

export default async function BrandProductsPage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  return <BrandProductsClient brandId={brandSlug} />;
}
