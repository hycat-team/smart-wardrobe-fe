import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { AIStylistClient } from './AIStylistClient';
import { aiApi } from '@/features/ai-stylist/api/ai.api';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/features/ai-stylist/api/ai.api', () => ({
  aiApi: { getOutfitRecommendation: jest.fn(), submitRecommendationFeedback: jest.fn() },
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

describe('AI stylist recommendation card', () => {
  const recommendation = {
    recommendationId: 'rec-1',
    title: 'Bộ đi làm tối giản',
    explanation: 'Vì bạn thích phong cách tối giản',
    items: [],
  };

  async function generateRecommendation() {
    render(<AIStylistClient />);
    fireEvent.click(screen.getByRole('button', { name: 'Đi làm' }));
    fireEvent.click(screen.getByRole('button', { name: 'TẠO TRANG PHỤC' }));
    await screen.findByText(recommendation.title);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_ENABLE_BRAND_FEATURES;
    (aiApi.getOutfitRecommendation as jest.Mock).mockResolvedValue(recommendation);
    (aiApi.submitRecommendationFeedback as jest.Mock).mockResolvedValue({ accepted: true });
  });

  it('keeps the AI explanation collapsed behind a chevron toggle by default', async () => {
    await generateRecommendation();

    expect(screen.queryByText(/Vì bạn thích phong cách tối giản/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Xem lý do gợi ý' }));
    expect(screen.getByText(/Vì bạn thích phong cách tối giản/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Thu gọn lý do gợi ý' }));
    expect(screen.queryByText(/Vì bạn thích phong cách tối giản/)).toBeNull();
  });

  it('asks for confirmation before sending feedback and then locks the controls', async () => {
    await generateRecommendation();

    fireEvent.click(screen.getByRole('button', { name: 'Thích bộ đồ này' }));

    expect(aiApi.submitRecommendationFeedback).not.toHaveBeenCalled();
    expect(screen.getByText(/Gửi phản hồi/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Gửi' }));

    await waitFor(() => {
      expect(aiApi.submitRecommendationFeedback).toHaveBeenCalledTimes(1);
      expect(aiApi.submitRecommendationFeedback).toHaveBeenCalledWith({
        recommendationId: 'rec-1',
        action: 'like',
      });
    });

    expect(await screen.findByText(/Đã ghi nhận phản hồi/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Thích bộ đồ này' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Không thích bộ đồ này' })).toBeNull();
  });

  it('cancels feedback without calling the API', async () => {
    await generateRecommendation();

    fireEvent.click(screen.getByRole('button', { name: 'Không thích bộ đồ này' }));
    fireEvent.click(screen.getByRole('button', { name: 'Huỷ' }));

    expect(aiApi.submitRecommendationFeedback).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Thích bộ đồ này' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Không thích bộ đồ này' })).toBeTruthy();
  });

  it('restores the feedback controls when sending fails', async () => {
    (aiApi.submitRecommendationFeedback as jest.Mock).mockRejectedValueOnce(new Error('network'));
    await generateRecommendation();

    fireEvent.click(screen.getByRole('button', { name: 'Thích bộ đồ này' }));
    fireEvent.click(screen.getByRole('button', { name: 'Gửi' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(await screen.findByRole('button', { name: 'Thích bộ đồ này' })).toBeTruthy();
    expect(screen.queryByText(/Đã ghi nhận phản hồi/)).toBeNull();
  });
});
