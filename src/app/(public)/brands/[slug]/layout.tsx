import { notFound } from 'next/navigation';
import { fetchPublicBrand } from '@/features/brands/api/server-brand';

export default async function BrandStorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await fetchPublicBrand(slug);

  if (!brand) {
    notFound();
  }

  return <div className="flex flex-1 flex-col">{children}</div>;
}
