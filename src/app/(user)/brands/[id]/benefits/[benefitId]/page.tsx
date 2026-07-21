import BenefitDetailClient from './components/BenefitDetailClient';
import { Metadata } from 'next';

type Props = { params: Promise<{ id: string, benefitId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Chi tiết Ưu đãi | Smart Wardrobe` };
}

export default async function BenefitDetailPage({ params }: Props) {
  const { id, benefitId } = await params;
  
  return <BenefitDetailClient brandId={id} benefitId={benefitId} />;
}
