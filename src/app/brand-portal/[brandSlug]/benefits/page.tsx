import { redirect } from 'next/navigation';

export default async function BenefitsPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  redirect(`/brand-portal/${brandSlug}/loyalty?tab=benefits`);
}
