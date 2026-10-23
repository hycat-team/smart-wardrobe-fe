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
  OutfitCanvasBoard: () => null,
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
  const pointerEventDescriptor = Object.getOwnPropertyDescriptor(window, 'PointerEvent');

  beforeAll(() => {
    Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  });

  afterAll(() => {
    if (pointerEventDescriptor) Object.defineProperty(window, 'PointerEvent', pointerEventDescriptor);
    else Reflect.deleteProperty(window, 'PointerEvent');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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
});
