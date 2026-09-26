'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/features/profile/queries/profile.queries';
import { useFollowUser } from '../queries/user-social.queries';
import { Loader2, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  username: string;
  isFollowing?: boolean;
  userId?: string;
  isMe?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  username,
  isFollowing = false,
  userId,
  isMe = false,
  className,
  size = 'sm',
}) => {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { mutate: followUser, isPending } = useFollowUser();
  const [isHovered, setIsHovered] = useState(false);

  // Ẩn nếu là chính mình
  if (isMe || (profile && (profile.id === userId || profile.username === username))) {
    return null;
  }

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!profile) {
      toast.error('Vui lòng đăng nhập để theo dõi người dùng.');
      router.push('/login');
      return;
    }

    followUser({
      username,
      isFollowing: !isFollowing,
    });
  };

  return (
    <Button
      type="button"
      onClick={handleToggleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      variant={isFollowing ? 'outline' : 'default'}
      size={size}
      className={cn(
        'font-bold transition-all text-xs tracking-wider rounded-full h-8 px-4',
        isFollowing
          ? 'border-border bg-background text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        className
      )}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
          <span>{isHovered ? 'Bỏ theo dõi' : 'Đang theo dõi'}</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          <span>Theo dõi</span>
        </>
      )}
    </Button>
  );
};
