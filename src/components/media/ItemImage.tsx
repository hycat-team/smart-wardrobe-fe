'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyCloudinaryTrim } from '@/lib/cloudinary';

/**
 * Backoff between attempts, in milliseconds. Cumulative wait before the last
 * attempt is 1.5 + 3 + 6 + 12 = 22.5s.
 */
const RETRY_DELAYS_MS = [1500, 3000, 6000, 12000] as const;

/**
 * Total budget for retrying one URL.
 *
 * A wardrobe photo points at a Cloudinary background-removal derivative
 * (`t_bg_remove`) that Cloudinary generates lazily: production measured 10-24s
 * between upload and the derived image existing, and the CDN answers 423 Locked
 * until then. A plain <img> never retries, so the card showed the alt text until
 * a full page reload. 30s covers the slowest measured case without hammering the
 * CDN.
 */
const RETRY_BUDGET_MS = 30_000;

export interface ItemImageProps {
  /** Image URL. Empty/undefined renders the placeholder immediately. */
  src?: string | null;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill the nearest positioned ancestor (same contract as next/image). */
  fill?: boolean;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  /** Defaults to true. Set false for URLs that must not be trimmed. */
  trim?: boolean;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Changing this value retries the image from scratch, even after the budget is
   * spent. Callers pass something that changes when the item's analysis reaches a
   * terminal state, so a finished analysis reveals the image without an F5.
   */
  retryKey?: string | number;
  /**
   * URLs to try, in order, BEFORE giving up on the primary one. Wardrobe cards
   * pass the un-transformed originals here: the `t_bg_remove` derivative does not
   * exist for the first 10-25s after upload (the CDN answers 423), while the
   * original is available immediately.
   */
  sourceCandidates?: string[];
  onLoad?: () => void;
}

/**
 * Wardrobe/outfit image with a bounded retry and a neutral placeholder.
 *
 * It exists because the CDN can answer 423 (derived asset still being generated)
 * and a failed <img> never recovers on its own: React keeps the same element, so
 * nothing re-requests the URL until the page is reloaded.
 */
export function ItemImage({ src, trim = true, fill = false, alt, placeholderClassName, retryKey, sourceCandidates, ...rest }: ItemImageProps) {
  const normalizedSrc = trim ? (src ? applyCloudinaryTrim(src) : '') : (src ?? '');
  const candidates = (sourceCandidates ?? []).filter(Boolean);

  if (!normalizedSrc) {
    return (
      <ItemImagePlaceholder
        alt={alt}
        fill={fill}
        placeholderClassName={placeholderClassName}
      />
    );
  }

  // Remounting on a new URL or retryKey is what resets the retry budget: no
  // effect has to synchronise state with props.
  return (
    <ItemImageBody
      key={`${normalizedSrc}|${retryKey ?? ''}`}
      src={normalizedSrc}
      candidateSrcs={candidates}
      alt={alt}
      fill={fill}
      placeholderClassName={placeholderClassName}
      {...rest}
    />
  );
}

function ItemImagePlaceholder({
  alt,
  fill,
  placeholderClassName,
}: {
  alt: string;
  fill: boolean;
  placeholderClassName?: string;
}) {
  return (
    <div
      data-testid="item-image-placeholder"
      aria-label={alt}
      role="img"
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground',
        fill && 'absolute inset-0',
        placeholderClassName,
      )}
    >
      <ImageOff className="size-6 opacity-40" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}

type ItemImageBodyProps = Omit<ItemImageProps, 'src' | 'trim' | 'retryKey' | 'sourceCandidates'> & {
  src: string;
  candidateSrcs: string[];
};

function ItemImageBody({
  src,
  candidateSrcs,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
  priority,
  unoptimized,
  loading,
  draggable,
  crossOrigin,
  onLoad,
  placeholderClassName,
}: ItemImageBodyProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  // 0 = primary (background-removed) URL; 1..n = originals, tried in order.
  const [candidateIndex, setCandidateIndex] = useState(0);
  // Set once every original failed, so a later primary failure goes to the
  // backoff instead of cycling through the candidates again.
  const [originalsExhausted, setOriginalsExhausted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set on the first failure (an event handler, so the clock is read outside
  // render) and kept for the lifetime of this mount, which is the retry budget.
  const startedAtRef = useRef(0);

  const clearPendingRetry = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearPendingRetry, [clearPendingRetry]);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    // The derived image does not exist yet (CDN says 423). The originals do, so
    // show the real photo immediately instead of a blank frame.
    if (!originalsExhausted && candidateIndex < candidateSrcs.length) {
      setCandidateIndex(candidateIndex + 1);
      return;
    }
    if (!originalsExhausted && candidateIndex > 0) {
      // Every original also failed — go back to the primary and let the backoff
      // below handle it.
      setOriginalsExhausted(true);
      setCandidateIndex(0);
      return;
    }

    const now = Date.now();
    if (startedAtRef.current === 0) {
      startedAtRef.current = now;
    }

    const delay = RETRY_DELAYS_MS[attempt];
    const elapsed = now - startedAtRef.current;

    if (delay === undefined || elapsed + delay > RETRY_BUDGET_MS) {
      setFailed(true);
      return;
    }

    clearPendingRetry();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setAttempt((current) => current + 1);
    }, delay);
  }, [attempt, candidateIndex, candidateSrcs.length, clearPendingRetry, originalsExhausted]);

  if (failed) {
    return <ItemImagePlaceholder alt={alt} fill={fill} placeholderClassName={placeholderClassName} />;
  }

  const activeSrc = candidateIndex === 0 ? src : candidateSrcs[candidateIndex - 1] ?? src;

  // Alt text is painted with the element's colour; keeping it transparent means
  // a failed load shows our placeholder, never a stray word inside the card.
  const imageClassName = cn('text-transparent', className);
  // `key` is required, not cosmetic: bumping it remounts the element so the
  // browser issues a new request instead of keeping the failed one.
  const imageKey = `${attempt}:${candidateIndex}`;

  if (fill) {
    return (
      <Image
        key={imageKey}
        src={activeSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={imageClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  if (width && height) {
    return (
      <Image
        key={imageKey}
        src={activeSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={imageClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  // Auto-sized images (outfit canvas) keep the plain <img> behaviour.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={imageKey}
      src={activeSrc}
      alt={alt}
      loading={loading}
      draggable={draggable}
      crossOrigin={crossOrigin}
      className={imageClassName}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
