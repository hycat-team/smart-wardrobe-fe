import { redirect } from 'next/navigation';

export default async function CommunityPostRedirectPage({
  params,
}: {
  params: Promise<{ postPublicId: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/posts/${resolvedParams.postPublicId}`);
}
