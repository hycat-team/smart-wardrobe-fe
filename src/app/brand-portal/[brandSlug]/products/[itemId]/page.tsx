import BrandProductEditClient from './components/BrandProductEditClient';

export default async function BrandProductDetailPage({
  params,
}: {
  params: Promise<{ brandSlug: string; itemId: string }>;
}) {
  const { brandSlug, itemId } = await params;
  return <BrandProductEditClient brandId={brandSlug} itemId={itemId} />;
}
