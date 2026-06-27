'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { PostRes } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Loader2, Sparkles, Image as ImageIcon, Tag as TagIcon, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCreatePost } from '../queries/community.queries';
import { communityApi } from '../api/community.api';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { getUserAvatar } from '@/lib/utils';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface CommunityListProps {
  data: { pages: { items: PostRes[] }[] } | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

export const CommunityList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: CommunityListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // --- CREATE POST STATE & LOGIC ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createPost, isPending } = useCreatePost();
  const user = useAuthStore((state) => state.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng nhập cả tiêu đề và nội dung bài viết.');
      return;
    }

    try {
      setIsUploading(true);
      const mediaList = [];
      
      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const signatureRes = await communityApi.getPostUploadSignature();
        
        const cloudinaryData = await uploadToCloudinary({
          file,
          signatureParams: {
            apiKey: signatureRes.apiKey,
            timestamp: signatureRes.timestamp,
            signature: signatureRes.signature,
            folder: signatureRes.folder,
            publicId: signatureRes.publicId,
          },
        });

        mediaList.push({
          mediaType: "IMAGE",
          mediaUrl: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          sortOrder: i,
        });
      }

      createPost(
        {
          title,
          content,
          postType: 'OUTFIT',
          media: mediaList,
          items: [],
        },
        {
          onSuccess: () => {
            setTitle('');
            setContent('');
            setImages([]);
          },
          onSettled: () => {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      toast.error('Failed to upload image.');
      setIsUploading(false);
    }
  };
  // ----------------------------------

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.community-post-card');
      
      cards.forEach((card) => {
        if (!card.dataset.animated) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none none',
              },
              onComplete: () => {
                card.dataset.animated = 'true';
              },
            }
          );
        }
      });
    },
    { dependencies: [data], scope: containerRef }
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts: PostRes[] = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="w-full flex flex-col gap-8" ref={containerRef}>
      
      {/* Create Post Box */}
      <form onSubmit={handleSubmit} className="w-full border border-border rounded-3xl bg-card p-5 flex flex-col gap-4 shadow-sm text-card-foreground">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 ring-1 ring-border shrink-0">
            <AvatarImage src={getUserAvatar(user)} className="object-cover" />
            <AvatarFallback className="bg-muted text-foreground font-medium text-sm">{user?.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-2">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài viết..." 
              className="w-full bg-transparent border-none outline-none text-lg font-bold pt-1 text-foreground placeholder:text-muted-foreground"
            />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ phong cách hoặc nguồn cảm hứng mới nhất của bạn..." 
              className="w-full bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground resize-none min-h-[40px]"
              rows={Math.max(1, content.split('\n').length)}
            />
          </div>
        </div>

        {/* Image Preview Area */}
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {images.map((file, index) => (
              <div key={index} className="relative w-24 h-24 shrink-0 rounded-xl bg-muted border border-border overflow-hidden">
                <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={URL.createObjectURL(file)} 
                  alt="preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-background/60 hover:bg-background text-foreground rounded-full p-1 transition-colors backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="h-[1px] w-full bg-border my-1" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors outline-none"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">Tải lên</span>
            </button>
            <button type="button" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors outline-none">
              <TagIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">Gắn thẻ</span>
            </button>
          </div>
          <Button 
            type="submit" 
            disabled={!content.trim() || isPending || isUploading}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs px-8 h-10 disabled:opacity-50"
          >
            {isPending || isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng'}
          </Button>
        </div>
      </form>

      {isLoading && !data ? (
        <div className="w-full flex flex-col gap-12 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full bg-card border border-border pb-5 flex flex-col gap-4 shadow-sm rounded-3xl overflow-hidden">
              <Skeleton className="w-full aspect-[4/5] rounded-none bg-muted" />
              <div className="px-6 flex flex-col gap-3">
                <Skeleton className="h-8 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-5/6 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-12 mt-4">
          {allPosts.map((post) => (
            <div key={post.id} className="community-post-card">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div
        ref={loadMoreRef}
        className="w-full h-32 flex items-center justify-center mt-8 border-t border-border"
      >
        {isFetchingNextPage && (
          <div className="flex items-center space-x-3 text-muted-foreground font-bold uppercase tracking-widest text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tải...</span>
          </div>
        )}
        {/* {!hasNextPage && allPosts.length > 0 && (
          <p className="text-xs text-black/40 font-bold uppercase tracking-widest">
            Bạn đã xem hết bài viết.
          </p>
        )}
        {!hasNextPage && allPosts.length === 0 && !isLoading && (
          <div className="text-center py-10 flex flex-col items-center justify-center space-y-4">
            <h3 className="font-bold text-2xl text-black tracking-tight">Chưa có bài viết nào</h3>
            <p className="text-sm text-black/60">
              Hãy trở thành người đầu tiên chia sẻ phong cách với cộng đồng.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};
