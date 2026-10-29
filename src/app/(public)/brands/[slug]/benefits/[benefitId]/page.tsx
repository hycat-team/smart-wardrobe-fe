import BenefitDetailClient from './components/BenefitDetailClient';
import { Metadata } from 'next';

type Props = { params: Promise<{ slug: string; benefitId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Chi tiết ưu đãi | Closy`,
    alternates: { canonical: `/brands/${slug}/benefits` },
  };
}

export default async function BenefitDetailPage({ params }: Props) {
  const { slug, benefitId } = await params;

  return <BenefitDetailClient brandId={slug} benefitId={benefitId} />;
}
