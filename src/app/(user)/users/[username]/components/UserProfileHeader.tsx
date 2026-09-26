'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicProfileRes } from '@/features/community/types';
import { FollowButton } from '@/features/community/components/FollowButton';
import { UserFollowsModal } from '@/features/community/components/UserFollowsModal';
import { getCommunityUserAvatar, getCommunityUserDisplayName, formatGenderLabel } from '@/features/community/utils/community.utils';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { Button } from '@/components/ui/button';
import { Settings, ShieldCheck } from 'lucide-react';

interface UserProfileHeaderProps {
  profile: PublicProfileRes;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ profile }) => {
  const { data: myProfile } = useProfile();
  const [followsModalOpen, setFollowsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'followers' | 'following'>('followers');

  const userData = profile.user;
  const isMe = profile.isMe || Boolean(
    myProfile && userData && (myProfile.id === userData.userId || myProfile.username === userData.username)
  );

  const displayName = getCommunityUserDisplayName(userData);
  const avatarUrl = getCommunityUserAvatar(userData);
  const genderLabel = formatGenderLabel(userData?.gender);
  const username = userData?.username || '';

  const handleOpenFollows = (tab: 'followers' | 'following') => {
    setModalTab(tab);
    setFollowsModalOpen(true);
  };

  return (
    <div className="w-full bg-background border-b border-border py-8 lg:py-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          {/* Avatar Section */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-muted shadow-lg shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col items-center sm:items-start gap-4 min-w-0 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {displayName}
                </h1>
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              </div>

              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                {isMe ? (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs font-semibold h-8 px-4 border-border">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa hồ sơ</span>
                    </Button>
                  </Link>
                ) : (
                  <FollowButton
                    username={username}
                    isFollowing={profile.isFollowing}
                    userId={userData?.userId}
                    size="sm"
                    className="h-8 px-5 text-xs"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
              <span>@{username}</span>
              {genderLabel && (
                <>
                  <span>•</span>
                  <span>{genderLabel}</span>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-10 pt-2 border-t sm:border-t-0 border-border w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-foreground">
                  {profile.stats.postCount.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">bài viết</span>
              </div>

              <button
                onClick={() => handleOpenFollows('followers')}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-opacity"
              >
                <span className="font-extrabold text-base sm:text-lg text-foreground">
                  {profile.stats.followerCount.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">người theo dõi</span>
              </button>

              <button
                onClick={() => handleOpenFollows('following')}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-opacity"
              >
                <span className="font-extrabold text-base sm:text-lg text-foreground">
                  {profile.stats.followingCount.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">đang theo dõi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Follows Modal */}
      {username && (
        <UserFollowsModal
          isOpen={followsModalOpen}
          onClose={() => setFollowsModalOpen(false)}
          username={username}
          initialTab={modalTab}
        />
      )}
    </div>
  );
};
