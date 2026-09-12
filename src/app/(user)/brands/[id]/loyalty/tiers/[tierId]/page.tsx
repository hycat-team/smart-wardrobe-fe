import TierDetailsClient from './components/TierDetailsClient';

export default async function TierDetailsPage({ params }: { params: Promise<{ id: string; tierId: string }> }) {
  const { id, tierId } = await params;
  return <TierDetailsClient brandId={id} tierId={tierId} />;
}
