'use client';

import React, { useState } from 'react';
import { PostMediaRes } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { ImageOff, Images, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PostMediaGalleryProps {
  media: PostMediaRes[];
  title?: string | null;
  className?: string;
  variant?: 'full' | 'compact';
  linkHref?: string;
}

const MediaImage: React.FC<{ src: string; alt: string; contain?: boolean }> = ({
  src,
  alt,
  contain = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
        <ImageOff className="w-8 h-8 mb-2 opacity-50 stroke-1" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 600px"
      onError={() => setHasError(true)}
      className={cn('object-cover', contain && 'object-contain')}
    />
  );
};

const CompactMedia: React.FC<{
  media: PostMediaRes[];
  title?: string | null;
  linkHref?: string;
}> = ({ media, title, linkHref }) => {
  const sorted = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const main = sorted[0];

  const content = (
    <div className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden flex items-center justify-center border-y border-border">
      {main.mediaType === 'video' ? (
        <VideoPlayer src={main.mediaUrl} />
      ) : (
        <MediaImage src={main.mediaUrl} alt={title || 'Ảnh bài viết'} />
      )}

      {/* Count badge for multi-file media posts */}
      {media.length > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-border shadow-sm">
          <Images className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">{media.length}</span>
        </div>
      )}
    </div>
  );

  if (linkHref) {
    return (
      <Link
        href={linkHref}
        className="relative w-full h-full block"
        aria-label="Xem chi tiết bài viết"
      >
        {content}
      </Link>
    );
  }
  return content;
};

export const PostMediaGallery: React.FC<PostMediaGalleryProps> = ({
  media,
  title,
  className,
  variant = 'full',
  linkHref,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  if (variant === 'compact') {
    return <CompactMedia media={media} title={title} linkHref={linkHref} />;
  }

  const sorted = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const main = sorted[0];
  const rest = sorted.slice(1);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);
  const prev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + sorted.length) % sorted.length));
  const next = () => setActiveIndex((i) => (i === null ? null : (i + 1) % sorted.length));

  return (
    <div className={cn('w-full', className)}>
      {/* Main media (first file) */}
      <div className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden flex items-center justify-center border-b border-border">
        {main.mediaType === 'video' ? (
          <VideoPlayer src={main.mediaUrl} className="max-h-full max-w-full" />
        ) : (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="relative block w-full h-full cursor-pointer"
            aria-label="Xem ảnh chính"
          >
            <MediaImage src={main.mediaUrl} alt={title || 'Ảnh bài viết'} />
          </button>
        )}
      </div>

      {/* Thumbnails grid for the rest */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1">
          {rest.map((item, index) => {
            const galleryIndex = index + 1;
            return (
              <button
                key={item.id || `${item.mediaUrl}-${galleryIndex}`}
                type="button"
                onClick={() => openLightbox(galleryIndex)}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
                aria-label={`Xem tệp ${galleryIndex + 1}`}
              >
                {item.mediaType === 'video' ? (
                  <VideoPlayer src={item.mediaUrl} />
                ) : (
                  <MediaImage src={item.mediaUrl} alt={title || 'Ảnh bài viết'} />
                )}
                <span className="absolute bottom-1 right-1 z-10 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                  {galleryIndex + 1}/{sorted.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:opacity-70"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:opacity-70"
            aria-label="Tệp trước"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div
            className="max-h-[85vh] max-w-[90vw] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {sorted[activeIndex].mediaType === 'video' ? (
              <VideoPlayer src={sorted[activeIndex].mediaUrl} className="max-h-[85vh] max-w-[90vw]" />
            ) : (
              <div className="relative h-[70vh] aspect-[4/5] max-w-[90vw]">
                <MediaImage
                  src={sorted[activeIndex].mediaUrl}
                  alt={title || 'Ảnh bài viết'}
                  contain
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:opacity-70"
            aria-label="Tệp sau"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            {activeIndex + 1}/{sorted.length}
          </div>
        </div>
      )}
    </div>
  );
};