import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AIStylistClient } from './AIStylistClient';
import { aiApi } from '@/features/ai-stylist/api/ai.api';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/features/ai-stylist/api/ai.api', () => ({
  aiApi: { getOutfitRecommendation: jest.fn() },
}));
jest.mock('@/features/outfits/queries/outfits.queries', () => ({
  useCreateOutfit: () => ({ mutateAsync: jest.fn() }),
}));
jest.mock('@/features/brands/queries/user-brands.queries', () => ({
  useCreateSampleFeedback: () => ({ mutate: jest.fn() }),
}));
jest.mock('@/features/outfits/components/OutfitCanvasBoard', () => ({
  OutfitCanvasBoard: () => <div data-testid="outfit-canvas-board" />,
}));
jest.mock('@/features/brands/components/BrandItemFeedbackSheet', () => ({
  BrandItemFeedbackSheet: () => null,
}));
jest.mock('@/features/ghost-closet/components/WardrobeImpactPanel', () => ({
  WardrobeImpactPanel: () => null,
}));
jest.mock('@/lib/cloudinary', () => ({ uploadToCloudinary: jest.fn() }));
jest.mock('html-to-image', () => ({ toBlob: jest.fn() }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('AI stylist brand recommendations', () => {
  const originalBrandFlag = process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES;
  const pointerEventDescriptor = Object.getOwnPropertyDescriptor(window, 'PointerEvent');

  beforeAll(() => {
    Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  });

  afterAll(() => {
    if (pointerEventDescriptor) Object.defineProperty(window, 'PointerEvent', pointerEventDescriptor);
    else Reflect.deleteProperty(window, 'PointerEvent');
    if (originalBrandFlag === undefined) delete process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES;
    else process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = originalBrandFlag;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'true';
    (aiApi.getOutfitRecommendation as jest.Mock).mockResolvedValue({
      title: 'Trang phục đi làm',
      items: [],
    });
  });

  it.each([false, true])('sends includeBrandItems=%s according to the switch', async (enabled) => {
    render(<AIStylistClient />);
    const brandSwitch = screen.getByRole('switch', { name: 'Phối đồ với các thương hiệu địa phương' });
    expect(brandSwitch.getAttribute('aria-checked')).toBe('false');
    if (enabled) fireEvent.click(brandSwitch);

    fireEvent.click(screen.getByRole('button', { name: 'Đi làm' }));
    fireEvent.click(screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }));

    await waitFor(() => {
      expect(aiApi.getOutfitRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({ occasion: 'formal', includeBrandItems: enabled }),
      );
    });
    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }) as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it('restores the saved brand recommendation preference after remounting', () => {
    const first = render(<AIStylistClient />);
    fireEvent.click(screen.getByRole('switch', { name: 'Phối đồ với các thương hiệu địa phương' }));
    first.unmount();
    render(<AIStylistClient />);

    expect(screen.getByRole('switch', { name: 'Phối đồ với các thương hiệu địa phương' }).getAttribute('aria-checked')).toBe('true');
  });

  it('clears the previous canvas immediately when generating a new outfit', async () => {
    render(<AIStylistClient />);
    fireEvent.click(screen.getByRole('button', { name: 'Đi làm' }));
    fireEvent.click(screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }));

    expect(await screen.findByTestId('outfit-canvas-board')).toBeTruthy();
    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }) as HTMLButtonElement).disabled).toBe(false);
    });

    let resolveSecond: ((value: unknown) => void) | undefined;
    (aiApi.getOutfitRecommendation as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSecond = resolve;
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }));

    await waitFor(() => expect(screen.queryByTestId('outfit-canvas-board')).toBeNull());
    expect(screen.getByText(/ĐANG TẠO PHONG CÁCH/)).toBeTruthy();

    resolveSecond?.({ title: 'Bộ mới', items: [] });
    expect(await screen.findByTestId('outfit-canvas-board')).toBeTruthy();
  });

  it('hides the brand switch and forces includeBrandItems=false when brand features are disabled', async () => {
    process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES = 'false';
    render(<AIStylistClient />);

    expect(screen.queryByRole('switch', { name: 'Phối đồ với các thương hiệu địa phương' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Đi làm' }));
    fireEvent.click(screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }));

    await waitFor(() => {
      expect(aiApi.getOutfitRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({ includeBrandItems: false }),
      );
    });
  });
});
