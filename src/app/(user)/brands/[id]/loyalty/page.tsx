import BrandLoyaltyClient from './components/BrandLoyaltyClient';
import { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Chương trình thành viên | Smart Wardrobe` };
}

export default async function BrandLoyaltyPage({ params }: Props) {
  const { id } = await params;
  
  return <BrandLoyaltyClient brandId={id} />;
}
