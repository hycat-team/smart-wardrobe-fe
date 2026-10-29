import { redirect } from 'next/navigation';

type LegacyBrandWorkspaceProps = {
  params: Promise<{ brandId: string; rest?: string[] }>;
};

export default async function LegacyBrandWorkspaceRedirect({ params }: LegacyBrandWorkspaceProps) {
  const { brandId, rest } = await params;
  const suffix = rest?.length ? `/${rest.join('/')}` : '';
  redirect(`/brand-portal/${brandId}${suffix}`);
}
