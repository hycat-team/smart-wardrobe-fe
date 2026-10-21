'use client';

import React, { useState } from 'react';
import { PublicProfileRes } from '@/features/community/types';
import { usePublicProfile } from '@/features/community/queries/user-social.queries';
import { UserProfileHeader } from './UserProfileHeader';
import { UserPostsGrid } from './UserPostsGrid';
import { Grid } from 'lucide-react';

interface UserProfileClientProps {
  initialProfile: PublicProfileRes;
  username: string;
}

export const UserProfileClient: React.FC<UserProfileClientProps> = ({
  initialProfile,
  username,
}) => {
  const { data: profile } = usePublicProfile(username);
  const currentProfile = profile || initialProfile;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Profile */}
      <UserProfileHeader profile={currentProfile} />

      {/* Tabs navigation */}
      <div className="w-full border-b border-border bg-background/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 flex justify-center sm:justify-start">
          <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-primary text-foreground text-xs font-bold uppercase tracking-wider">
            <Grid className="w-4 h-4" />
            <span>Bài viết</span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <UserPostsGrid username={username} />
    </div>
  );
};
