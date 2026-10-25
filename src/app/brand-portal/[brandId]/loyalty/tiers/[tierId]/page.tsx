import StaffTierDetailsClient from './components/StaffTierDetailsClient';

export default async function StaffTierDetailsPage({ params }: { params: Promise<{ brandId: string; tierId: string }> }) {
  const { brandId, tierId } = await params;
  return <StaffTierDetailsClient brandId={brandId} tierId={tierId} />;
}
