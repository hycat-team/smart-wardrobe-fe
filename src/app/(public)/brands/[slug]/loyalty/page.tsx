import BrandLoyaltyClient from './components/BrandLoyaltyClient';
import { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Chương trình thành viên | Closy`,
    alternates: { canonical: `/brands/${slug}/loyalty` },
  };
}

export default async function BrandLoyaltyPage({ params }: Props) {
  const { slug } = await params;

  return <BrandLoyaltyClient brandId={slug} />;
}
