import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWardrobeSSE, resetWardrobeSSEState } from './useWardrobeSSE';
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
    info: jest.fn(),
  },
}));

/** Comfortably above the hook's invalidation debounce. */
const AFTER_DEBOUNCE_MS = 1000;

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

const processingItem = (overrides: Partial<WardrobeItemRes> = {}): WardrobeItemRes => ({
  id: 'item-1',
  status: WardrobeItemStatus.Processing,
  taskId: 'task-123',
  createdAt: '2026-08-25T00:00:00Z',
  ...overrides,
});

describe('useWardrobeSSE hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetWardrobeSSEState();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('lắng nghe SSE khi có item đang Processing với taskId', () => {
    const { wrapper } = createHarness();
    const items: WardrobeItemRes[] = [
      processingItem(),
      { id: 'item-2', status: WardrobeItemStatus.InWardrobe, createdAt: '2026-08-25T00:00:00Z' },
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

  it('invalidate queries khi SSE báo hoàn thành và tự động toast khi item hoàn tất', () => {
    let capturedOnDone: () => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage, onDone) => {
        capturedOnDone = onDone;
      }
    );

    const { queryClient, wrapper } = createHarness();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { rerender } = renderHook(({ currentItems }) => useWardrobeSSE(currentItems), {
      wrapper,
      initialProps: { currentItems: [processingItem()] },
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalled();

    act(() => {
      capturedOnDone();
      jest.advanceTimersByTime(AFTER_DEBOUNCE_MS);
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

    rerender({
      currentItems: [{ id: 'item-1', status: WardrobeItemStatus.InWardrobe, createdAt: '2026-08-25T00:00:00Z' }],
    });

    expect(toast.success).toHaveBeenCalledWith('Trang phục đã được AI phân tích hoàn tất!');
  });

  it('không tạo nhiều kết nối trùng lặp cho cùng một taskId', () => {
    const { wrapper } = createHarness();
    const items: WardrobeItemRes[] = [processingItem()];

    const { rerender } = renderHook(({ currentItems }) => useWardrobeSSE(currentItems), {
      wrapper,
      initialProps: { currentItems: items },
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);

    rerender({ currentItems: [...items] });
    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);
  });

  it('chia sẻ đúng một kết nối khi hai component cùng theo dõi một task', () => {
    const { wrapper } = createHarness();
    const items: WardrobeItemRes[] = [processingItem()];

    renderHook(() => useWardrobeSSE(items), { wrapper });
    renderHook(() => useWardrobeSSE(items), { wrapper });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);
  });

  it('tự động cập nhật cache và gộp refresh khi nhận SSE event completed', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), {
      items: [processingItem()],
    });

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    renderHook(() => useWardrobeSSE([processingItem()]), { wrapper });

    act(() => {
      capturedOnMessage({
        itemId: 'item-1',
        status: 'completed',
        total: 1,
        index: 0,
        eventId: 10,
        data: {
          id: 'item-1',
          status: 0,
          fashionItem: {
            id: 'fi-1',
            color: 'đen',
            colorHex: '#000000',
            style: 'casual',
            category: { id: 'c-1', name: 'Áo thun', slug: 'ao-thun' },
          },
        },
      });
    });

    // The cache is updated immediately; the refetch is coalesced.
    const cachedList: any = queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists());
    expect(cachedList.items[0].status).toBe(WardrobeItemStatus.InWardrobe);
    expect(cachedList.items[0].fashionItem.category.name).toBe('Áo thun');

    act(() => {
      jest.advanceTimersByTime(AFTER_DEBOUNCE_MS);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: WARDROBE_QUERY_KEYS.lists(),
    });
    // One coalesced refresh, not a refetch storm.
    const listInvalidations = invalidateSpy.mock.calls.filter(
      ([arg]: any) => JSON.stringify(arg?.queryKey) === JSON.stringify(WARDROBE_QUERY_KEYS.lists()),
    );
    expect(listInvalidations).toHaveLength(1);
  });

  it('bỏ qua event replay đã áp dụng (cùng eventId) để badge không nháy', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), {
      items: [processingItem({ id: 'item-9', taskId: 'task-replay' })],
    });

    renderHook(() => useWardrobeSSE([processingItem({ id: 'item-9', taskId: 'task-replay' })]), { wrapper });

    const failedEvent = {
      itemId: 'item-9',
      status: 'failed',
      total: 1,
      index: 0,
      error: 'analysis_temporary_error',
      eventId: 42,
    };

    act(() => {
      capturedOnMessage(failedEvent);
      // A reconnect replays the same frame; it must not be re-applied.
      capturedOnMessage(failedEvent);
    });

    expect(toast.error).toHaveBeenCalledTimes(1);

    // An older frame (processing) replayed after the terminal one is also ignored.
    act(() => {
      capturedOnMessage({ itemId: 'item-9', status: 'processing', total: 1, index: 0, eventId: 41 });
    });

    const cachedList: any = queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists());
    expect(cachedList.items[0].status).toBe(WardrobeItemStatus.Failed);
  });

  it('hiển thị toast tiếng Việt chuẩn khi nhận event failed với mã no_fashion_item_detected', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), {
      items: [processingItem({ id: 'item-2', taskId: 'task-456' })],
    });

    renderHook(() => useWardrobeSSE([processingItem({ id: 'item-2', taskId: 'task-456' })]), { wrapper });

    act(() => {
      capturedOnMessage({
        itemId: 'item-2',
        status: 'failed',
        total: 1,
        index: 0,
        error: 'no_fashion_item_detected',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Ảnh không phải trang phục — hãy tải ảnh đúng món đồ');

    const cachedList: any = queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists());
    expect(cachedList.items[0].status).toBe(WardrobeItemStatus.Failed);
    expect(cachedList.items[0].fashionItem.processingErrorReason).toBe('no_fashion_item_detected');
  });

  it('hiển thị toast tiếng Việt chuẩn khi nhận event needs_review với mã uncertain_category', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), {
      items: [processingItem({ id: 'item-3', taskId: 'task-789' })],
    });

    renderHook(() => useWardrobeSSE([processingItem({ id: 'item-3', taskId: 'task-789' })]), { wrapper });

    act(() => {
      capturedOnMessage({
        itemId: 'item-3',
        status: 'needs_review',
        total: 1,
        index: 0,
        error: 'uncertain_category',
      });
    });

    expect(toast.info).toHaveBeenCalledWith('AI chưa chắc danh mục — chọn danh mục rồi gửi phân tích lại');

    const cachedList: any = queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists());
    expect(cachedList.items[0].status).toBe(WardrobeItemStatus.NeedsReview);
    expect(cachedList.items[0].fashionItem.reviewReason).toBe('uncertain_category');
  });

  // A terminal event means the database already holds the final state. Waiting for
  // the 400ms debounce leaves a window where a throttled/background tab keeps
  // showing "AI Đang Xử Lý" even though the analysis is done.
  it('refetch ngay (không chờ debounce) khi nhận event terminal', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), {
      items: [processingItem({ id: 'item-fast', taskId: 'task-fast' })],
    });

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    renderHook(() => useWardrobeSSE([processingItem({ id: 'item-fast', taskId: 'task-fast' })]), { wrapper });

    act(() => {
      capturedOnMessage({ itemId: 'item-fast', status: 'completed', total: 1, index: 0, eventId: 500 });
    });

    // No timer advance: the invalidation already happened.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WARDROBE_QUERY_KEYS.lists() });
  });

  // The dedupe guard must never block an event that upgrades a stale "processing"
  // cache into its terminal state — that is the frame that unsticks the card.
  it('vẫn áp dụng event replay khi cache còn Processing', () => {
    let capturedOnMessage: (payload: any) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage) => {
        capturedOnMessage = onMessage;
      }
    );

    const { queryClient, wrapper } = createHarness();
    const item = processingItem({ id: 'item-stuck', taskId: 'task-stuck' });
    queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), { items: [item] });

    renderHook(() => useWardrobeSSE([item]), { wrapper });

    const failedEvent = {
      itemId: 'item-stuck',
      status: 'failed',
      total: 1,
      index: 0,
      error: 'analysis_temporary_error',
      eventId: 900,
    };

    act(() => {
      capturedOnMessage(failedEvent);
    });
    expect((queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists()) as any).items[0].status).toBe(
      WardrobeItemStatus.Failed,
    );

    // Simulate a stale refetch putting the item back to Processing.
    act(() => {
      queryClient.setQueryData(WARDROBE_QUERY_KEYS.lists(), { items: [item] });
    });

    act(() => {
      capturedOnMessage(failedEvent);
    });

    expect((queryClient.getQueryData(WARDROBE_QUERY_KEYS.lists()) as any).items[0].status).toBe(
      WardrobeItemStatus.Failed,
    );
  });

  it('tự mở lại stream khi kết nối đứt lúc item còn Processing', () => {
    let capturedOnError: (error: Error) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage, onDone, onError) => {
        capturedOnError = onError;
      }
    );

    const { wrapper } = createHarness();
    renderHook(() => useWardrobeSSE([processingItem()]), { wrapper });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);

    act(() => {
      capturedOnError(new Error('network down'));
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(2);
  });

  it('dừng mở lại sau 3 lần thử', () => {
    let capturedOnError: (error: Error) => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage, onDone, onError) => {
        capturedOnError = onError;
      }
    );

    const { wrapper } = createHarness();
    renderHook(() => useWardrobeSSE([processingItem()]), { wrapper });

    [2000, 5000, 10000].forEach((delay) => {
      act(() => {
        capturedOnError(new Error('network down'));
      });
      act(() => {
        jest.advanceTimersByTime(delay);
      });
    });

    // initial + 3 reconnects
    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(4);

    act(() => {
      capturedOnError(new Error('still down'));
    });
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(4);
  });

  it('không mở lại stream khi task đã báo terminal', () => {
    let capturedOnMessage: (payload: any) => void = () => {};
    let capturedOnDone: () => void = () => {};

    jest.mocked(wardrobeApi.subscribeTaskSSE).mockImplementation(
      async (taskId, onMessage, onDone) => {
        capturedOnMessage = onMessage;
        capturedOnDone = onDone;
      }
    );

    const { wrapper } = createHarness();
    renderHook(() => useWardrobeSSE([processingItem({ id: 'item-done', taskId: 'task-done' })]), { wrapper });

    act(() => {
      capturedOnMessage({ itemId: 'item-done', status: 'completed', total: 1, index: 0, eventId: 1 });
      capturedOnDone();
    });
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(wardrobeApi.subscribeTaskSSE).toHaveBeenCalledTimes(1);
  });
});
