import BrandProfileClient from './components/BrandProfileClient';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { fetchPublicBrand } from '@/features/brands/api/server-brand';
import { brandPublicPath } from '@/features/brand-portal/utils/routes';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await fetchPublicBrand(slug);

  if (!brand) {
    return { title: 'Không tìm thấy thương hiệu | Closy' };
  }

  const canonicalSlug = brand.slug || slug;
  const title = `${brand.name} | Closy`;
  const description =
    brand.description ||
    `Khám phá bộ sưu tập, ưu đãi thành viên và câu chuyện của ${brand.name} trên Closy.`;
  const image = brand.backgroundUrl || brand.logoUrl;

  return {
    title,
    description,
    alternates: { canonical: brandPublicPath(canonicalSlug) },
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

export default async function BrandProfilePage({ params }: Props) {
  const { slug } = await params;
  const brand = await fetchPublicBrand(slug);

  if (!brand) {
    notFound();
  }

  if (brand.slug && brand.slug !== slug) {
    permanentRedirect(brandPublicPath(brand.slug));
  }

  return <BrandProfileClient brandId={brand.slug || slug} />;
}
