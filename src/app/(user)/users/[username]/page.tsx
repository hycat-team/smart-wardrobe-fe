import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-fetch';
import { PublicProfileRes } from '@/features/community/types';
import { UserProfileClient } from './components/UserProfileClient';
import { getCommunityUserDisplayName } from '@/features/community/utils/community.utils';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await serverFetch<PublicProfileRes>(`/users/${username}`, {
      cache: 'no-store',
    });

    if (!profile) {
      return {
        title: 'Người dùng không tồn tại - Atelier Community',
      };
    }

    const displayName = getCommunityUserDisplayName(profile.user);
    const uname = profile.user?.username || username;
    const avatar = profile.user?.avatarUrl;

    return {
      title: `${displayName} (@${uname}) | Atelier Community`,
      description: `Khám phá phong cách và các bài đăng thời trang của ${displayName} trên Atelier Community.`,
      openGraph: {
        title: `${displayName} (@${uname}) | Atelier Community`,
        description: `Khám phá phong cách và các bài đăng thời trang của ${displayName} trên Atelier Community.`,
        images: avatar ? [avatar] : undefined,
      },
    };
  } catch {
    return {
      title: `@${username} | Atelier Community`,
    };
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  let profile: PublicProfileRes | null = null;
  try {
    profile = await serverFetch<PublicProfileRes>(`/users/${username}`, {
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin hồ sơ của @${username}:`, error);
  }

  if (!profile) {
    notFound();
  }

  return <UserProfileClient initialProfile={profile} username={username} />;
}
