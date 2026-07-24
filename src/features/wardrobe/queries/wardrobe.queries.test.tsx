import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wardrobeApi } from '../api/wardrobe.api';
import {
  useDeleteWardrobeItem,
  useWardrobeCategoryDistribution,
  WARDROBE_QUERY_KEYS,
} from './wardrobe.queries';

jest.mock('../api/wardrobe.api', () => ({
  wardrobeApi: {
    getWardrobeCategoryDistribution: jest.fn(),
    deleteWardrobeItem: jest.fn(),
  },
}));

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

afterEach(() => jest.clearAllMocks());

describe('Wardrobe dashboard queries', () => {
  it('lưu category distribution dưới query key riêng', async () => {
    const payload = { totalItems: 0, categories: [] };
    jest.mocked(wardrobeApi.getWardrobeCategoryDistribution).mockResolvedValue(payload);
    const { queryClient, wrapper } = createHarness();
    renderHook(() => useWardrobeCategoryDistribution(), { wrapper });

    await queryClient.refetchQueries({
      queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
    });

    expect(
      queryClient.getQueryData(
        WARDROBE_QUERY_KEYS.categoryDistribution(),
      ),
    ).toEqual(payload);
  });

  it('invalidate list và distribution sau khi xóa item', async () => {
    jest.mocked(wardrobeApi.deleteWardrobeItem).mockResolvedValue({});
    const { queryClient, wrapper } = createHarness();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useDeleteWardrobeItem(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync('item-1');
    });

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.lists(),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
    });
  });
});