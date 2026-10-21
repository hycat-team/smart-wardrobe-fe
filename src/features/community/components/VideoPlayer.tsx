'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'relative w-full h-full overflow-hidden bg-muted flex items-center justify-center',
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Video className="w-8 h-8 opacity-50 stroke-1" />
          <span className="text-xs font-medium">Video không khả dụng</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-black flex items-center justify-center group',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        playsInline
        muted={isMuted}
        autoPlay={autoPlay}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Play overlay when paused: dim layer is pointer-events-none so clicks
          outside the circle button bubble to a parent <Link> (feed navigation);
          only the circle button itself toggles playback */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity pointer-events-none">
          <button
            type="button"
            onClick={togglePlay}
            className="pointer-events-auto w-14 h-14 rounded-full bg-background/80 text-foreground flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 cursor-pointer"
            aria-label="Phát video"
          >
            <Play className="w-6 h-6 ml-1 fill-current" />
          </button>
        </div>
      )}

      {/* Control bar */}
      <div
        className={cn(
          'absolute bottom-3 right-3 flex items-center gap-2 transition-opacity duration-200 z-10',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
          aria-label={isPlaying ? 'Tạm dừng video' : 'Phát video'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};