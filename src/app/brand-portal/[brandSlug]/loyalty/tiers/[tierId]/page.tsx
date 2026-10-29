import { redirect } from 'next/navigation';

export default async function StaffTierDetailsPage({
  params,
}: {
  params: Promise<{ brandSlug: string; tierId: string }>;
}) {
  const { brandSlug, tierId } = await params;
  redirect(`/brand-portal/${brandSlug}/loyalty?tab=program&tierId=${tierId}`);
}
