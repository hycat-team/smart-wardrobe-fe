import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ItemImage } from './ItemImage';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
    onError,
    className,
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    onError?: () => void;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="item-image" src={src} alt={alt} className={className} onLoad={onLoad} onError={onError} />
  ),
}));

jest.mock('@/lib/cloudinary', () => ({
  applyCloudinaryTrim: (url: string) => url,
}));

/** Mirrors the component's backoff ladder. */
const RETRY_STEPS_MS = [1500, 3000, 6000, 12000];

const IMAGE_URL = 'https://res.cloudinary.com/demo/image/upload/t_bg_remove/v1/item.png';

const renderImage = (props: Partial<React.ComponentProps<typeof ItemImage>> = {}) =>
  render(<ItemImage src={IMAGE_URL} alt="Áo thun" fill {...props} />);

const currentImage = () => screen.getByTestId('item-image');

/** Fails the current <img> and lets the backoff elapse. */
const failAndWait = (delay: number) => {
  fireEvent.error(currentImage());
  act(() => {
    jest.advanceTimersByTime(delay);
  });
};

describe('ItemImage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('hiển thị ảnh khi URL hợp lệ', () => {
    renderImage();
    expect(currentImage()).toBeTruthy();
  });

  it('hiển thị placeholder ngay khi không có URL', () => {
    renderImage({ src: '' });
    expect(screen.getByTestId('item-image-placeholder')).toBeTruthy();
    expect(screen.queryByTestId('item-image')).toBeNull();
  });

  // The CDN answers 423 while the background-removal derivative is still being
  // generated (10-24s in production). A failed <img> never retries on its own,
  // which is why the card used to show alt text until an F5.
  it('thử lại sau backoff và hiển thị ảnh khi CDN sẵn sàng', () => {
    renderImage();

    fireEvent.error(currentImage());

    act(() => {
      jest.advanceTimersByTime(RETRY_STEPS_MS[0]);
    });

    expect(currentImage().getAttribute('src')).toContain('t_bg_remove');
  });

  it('bỏ cuộc sau ~30 giây và hiện placeholder thay vì chữ alt', () => {
    renderImage();

    RETRY_STEPS_MS.forEach(failAndWait);
    // The next failure has no delay left in the budget.
    fireEvent.error(currentImage());

    expect(screen.getByTestId('item-image-placeholder')).toBeTruthy();
    expect(screen.queryByTestId('item-image')).toBeNull();
  });

  // The SSE terminal event changes retryKey: the image must try again right away,
  // so a finished analysis reveals the photo without the user reloading.
  it('thử lại ngay khi retryKey đổi, kể cả sau khi đã hết ngân sách', () => {
    const { rerender } = renderImage({ retryKey: 'processing' });

    RETRY_STEPS_MS.forEach(failAndWait);
    fireEvent.error(currentImage());
    expect(screen.getByTestId('item-image-placeholder')).toBeTruthy();

    rerender(<ItemImage src={IMAGE_URL} alt="Áo thun" fill retryKey="completed" />);

    expect(screen.queryByTestId('item-image-placeholder')).toBeNull();
    expect(currentImage()).toBeTruthy();
  });

  it('dọn timer khi unmount giữa lúc chờ retry', () => {
    const { unmount } = renderImage();
    fireEvent.error(currentImage());

    expect(jest.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });

  // The background-removal derivative does not exist for the first 10-25s after
  // upload. The original does, so the card shows the real photo instead of an
  // empty frame until the derivative is ready.
  it('hiển thị ảnh gốc ngay khi ảnh derived lỗi (không chờ backoff)', () => {
    const original = 'https://res.cloudinary.com/demo/image/upload/v1/item.webp';
    renderImage({ sourceCandidates: [original] });

    fireEvent.error(currentImage());

    expect(currentImage().getAttribute('src')).toBe(original);
    // Instant swap: no timer needed.
    expect(jest.getTimerCount()).toBe(0);
  });

  it('thử lần lượt các ứng viên rồi quay lại ảnh chính + backoff', () => {
    const first = 'https://res.cloudinary.com/demo/image/upload/v1/item.webp';
    const second = 'https://res.cloudinary.com/demo/image/upload/v1/item.jpg';
    renderImage({ sourceCandidates: [first, second] });

    fireEvent.error(currentImage());
    expect(currentImage().getAttribute('src')).toBe(first);

    fireEvent.error(currentImage());
    expect(currentImage().getAttribute('src')).toBe(second);

    // Every original failed: back to the primary, which then uses the backoff.
    fireEvent.error(currentImage());
    expect(currentImage().getAttribute('src')).toContain('t_bg_remove');

    fireEvent.error(currentImage());
    expect(jest.getTimerCount()).toBeGreaterThan(0);
  });

  it('retryKey đổi thì thử lại ảnh derived trước (để swap sang bản xoá nền)', () => {
    const original = 'https://res.cloudinary.com/demo/image/upload/v1/item.webp';
    const { rerender } = renderImage({ sourceCandidates: [original], retryKey: 'processing' });

    fireEvent.error(currentImage());
    expect(currentImage().getAttribute('src')).toBe(original);

    rerender(<ItemImage src={IMAGE_URL} alt="Áo thun" fill sourceCandidates={[original]} retryKey="completed" />);

    expect(currentImage().getAttribute('src')).toContain('t_bg_remove');
  });
});
