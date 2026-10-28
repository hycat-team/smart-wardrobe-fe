import StaffTierDetailsClient from './components/StaffTierDetailsClient';

export default async function StaffTierDetailsPage({ params }: { params: Promise<{ brandSlug: string; tierId: string }> }) {
  const { brandSlug, tierId } = await params;
  return <StaffTierDetailsClient brandId={brandSlug} tierId={tierId} />;
}
