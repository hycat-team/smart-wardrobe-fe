import { Metadata } from 'next';
import { BrandProductsClient } from './components/BrandProductsClient';

export const metadata: Metadata = {
  title: 'Quản lý Sản phẩm | Brand Workspace',
};

export default async function BrandProductsPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  return <BrandProductsClient brandId={brandId} />;
}
