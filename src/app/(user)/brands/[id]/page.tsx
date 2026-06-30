import BrandProfileClient from './components/BrandProfileClient';
import { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Brand Profile | Smart Wardrobe` };
}

export default async function BrandProfilePage({ params }: Props) {
  const { id } = await params;
  
  return <BrandProfileClient brandId={id} />;
}
