import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWardrobeSSE } from './useWardrobeSSE';
import { wardrobeApi } from '../api/wardrobe.api';
import { WARDROBE_QUERY_KEYS } from '../queries/wardrobe.queries';
import { WardrobeItemRes, WardrobeItemStatus } from '../types';
import { toast } from 'sonner';

jest.mock('../api/wardrobe.api', () => ({
  wardrobeApi: {
    subscribeTaskSSE: jest.fn(),
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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

describe('useWardrobeSSE hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lắng nghe SSE khi có item đang Processing với taskId', () => {
    const { wrapper } = createHarness();
    const items: WardrobeItemRes[] = [
      {
        id: 'item-1',
        status: WardrobeItemStatus.Processing,
        taskId: 'task-123',
        createdAt: '2026-08-25T00:00:00Z',
      },
      {
        id: 'item-2',
        status: WardrobeItemStatus.InWardrobe,
        createdAt: '2026-08-25T00:00:00Z',
      },
    ];

    renderHook(() => useWardrobeSSE(items), { wrapper });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);
    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledWith(
      'task-123',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(AbortSignal),
    );
  });

  it('invalidate queries khi SSE báo hoàn thành và tự động toast khi item hoàn tất', async () => {
    let capturedOnDone: () => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage, onDone, onError, signal) => {
        capturedOnDone = onDone;
      }
    );

    const { queryClient, wrapper } = createHarness();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const items: WardrobeItemRes[] = [
      {
        id: 'item-1',
        status: WardrobeItemStatus.Processing,
        taskId: 'task-123',
        createdAt: '2026-08-25T00:00:00Z',
      },
    ];

    const { rerender } = renderHook(({ currentItems }) => useWardrobeSSE(currentItems), {
      wrapper,
      initialProps: { currentItems: items },
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalled();

    await act(async () => {
      await capturedOnDone();
    });


    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.stats(),
    });

    // Rerender with completed item status
    const completedItems: WardrobeItemRes[] = [
      {
        id: 'item-1',
        status: WardrobeItemStatus.InWardrobe,
        createdAt: '2026-08-25T00:00:00Z',
      },
    ];
    rerender({ currentItems: completedItems });

    expect(toast.success).toHaveBeenCalledWith(
      'Trang phục đã được AI phân tích hoàn tất!',
    );
  });


  it('không tạo nhiều kết nối trùng lặp cho cùng một taskId', () => {
    const { wrapper } = createHarness();
    const items: WardrobeItemRes[] = [
      {
        id: 'item-1',
        status: WardrobeItemStatus.Processing,
        taskId: 'task-123',
        createdAt: '2026-08-25T00:00:00Z',
      },
    ];

    const { rerender } = renderHook(({ currentItems }) => useWardrobeSSE(currentItems), {
      wrapper,
      initialProps: { currentItems: items },
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);

    // Rerender with same items
    rerender({ currentItems: [...items] });
    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);
  });
});
