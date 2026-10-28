import TierDetailsClient from './components/TierDetailsClient';

export default async function TierDetailsPage({ params }: { params: Promise<{ slug: string; tierId: string }> }) {
  const { slug, tierId } = await params;
  return <TierDetailsClient brandId={slug} tierId={tierId} />;
}
