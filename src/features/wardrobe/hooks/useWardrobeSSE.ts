import { useEffect, useRef } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wardrobeApi } from "../api/wardrobe.api";
import { WARDROBE_QUERY_KEYS } from "../queries/wardrobe.queries";
import { WardrobeItemRes, WardrobeItemStatus, WardrobeTaskSSEPayload } from "../types";
import { getAnalysisErrorMessage } from "../utils/analysis-status";

/**
 * How long SSE-driven invalidations are coalesced for NON-terminal events.
 *
 * Every incoming event used to invalidate the lists, the category distribution
 * and the stats — and `handleItemUpdated` refetched the list again on top. A batch
 * of uploads therefore produced dozens of identical `/me/wardrobe-items` calls per
 * second, and the card under the cursor flipped between its cached and server
 * states: that is what made the analysis badge flicker.
 *
 * A terminal event never waits for this window: see refreshNow.
 */
const REFRESH_DEBOUNCE_MS = 400;

/**
 * Grace period before a stream with no mounted listener is aborted.
 *
 * Effects re-run whenever the list refetches, so aborting on the first empty
 * listener set would tear down and recreate the connection several times per
 * second. A short grace period survives those re-renders while still closing the
 * connection shortly after the user leaves the page.
 */
const STREAM_IDLE_GRACE_MS = 5_000;

/** Upper bound on the module-level bookkeeping maps. */
const MAX_TRACKED_TASKS = 50;

/**
 * A refresh that does not depend on an event arriving. If the stream is silently
 * dead, the badge would otherwise sit on "processing" forever.
 */
const FALLBACK_REFRESH_MS = 15_000;

/**
 * Backoff for reopening a stream that ended while its task was still being
 * analyzed (network drop, proxy restart, server write deadline). Without this a
 * single dropped connection leaves the card on the loading overlay until the page
 * is reloaded.
 */
const RECONNECT_DELAYS_MS = [2_000, 5_000, 10_000] as const;

const TERMINAL_ITEM_STATUSES = new Set<number>([
  WardrobeItemStatus.InWardrobe,
  WardrobeItemStatus.Failed,
  WardrobeItemStatus.NeedsReview,
]);

const fallbackRefreshTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** taskId -> number of mounted listeners that still consider it processing. */
const processingTaskRefs = new Map<string, number>();

type StreamHandlers = {
  onMessage: (payload: WardrobeTaskSSEPayload) => void;
  onDone: () => void;
  onError: (error: Error) => void;
};

type TaskStream = {
  controller: AbortController;
  handlers: Set<StreamHandlers>;
  /** Query client captured at creation, used by the duplicate-event guard. */
  queryClient: QueryClient;
  started: boolean;
  /** True when the current connection delivered a terminal frame. */
  sawTerminal: boolean;
  reconnectAttempts: number;
  reconnectTimer?: ReturnType<typeof setTimeout>;
  idleTimer?: ReturnType<typeof setTimeout>;
};

/**
 * One SSE connection per taskId, shared by every component that listens.
 *
 * The hook used to own its connection privately, so the list page and the item
 * detail page each opened one — and a re-render could open more. Production
 * showed six concurrent streams for a single taskId, each replaying the same
 * events. A module-level registry makes the connection a property of the task,
 * not of whichever component happens to be mounted.
 */
const taskStreams = new Map<string, TaskStream>();

/**
 * Last event id already applied per taskId, kept across reconnects on purpose:
 * the server replays its buffer after a reconnect, and those frames must not be
 * applied twice.
 */
const lastAppliedEventIds = new Map<string, number>();

/** Terminal notifications already shown, so a replay cannot toast twice. */
const notifiedTerminalKeys = new Set<string>();

/** Debounced invalidation, keyed by the query client so tests stay isolated. */
const refreshTimers = new WeakMap<QueryClient, ReturnType<typeof setTimeout>>();

function rememberBounded<V>(map: Map<string, V>, key: string, value: V) {
  map.delete(key);
  map.set(key, value);
  while (map.size > MAX_TRACKED_TASKS) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

function retainProcessingTask(taskId: string) {
  processingTaskRefs.set(taskId, (processingTaskRefs.get(taskId) ?? 0) + 1);
}

function releaseProcessingTask(taskId: string) {
  const remaining = (processingTaskRefs.get(taskId) ?? 1) - 1;
  if (remaining <= 0) {
    processingTaskRefs.delete(taskId);
  } else {
    processingTaskRefs.set(taskId, remaining);
  }
}

function isTaskProcessing(taskId: string): boolean {
  return processingTaskRefs.has(taskId);
}

/** Status of an item currently in the cache, if it is there at all. */
function readCachedItemStatus(
  queryClient: QueryClient,
  itemId?: string,
  taskId?: string,
): number | undefined {
  const lists = queryClient.getQueriesData<{ items?: any[] }>({
    queryKey: WARDROBE_QUERY_KEYS.lists(),
  });

  for (const [, data] of lists) {
    const items = data?.items;
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const matchesItem = itemId
        ? String(item.id).toLowerCase() === itemId.toLowerCase()
        : taskId
          ? String(item.taskId ?? item.task_id ?? "").toLowerCase() === taskId.toLowerCase()
          : false;
      if (matchesItem) return Number(item.status);
    }
  }

  return undefined;
}

function isTerminalPayload(payload: WardrobeTaskSSEPayload): boolean {
  return payload.status === "completed" || payload.status === "failed" || payload.status === "needs_review";
}

/**
 * True when the frame must not be applied.
 *
 * A replay of an event at or below the last applied id is dropped ONLY when the
 * cached item has already reached a terminal state. If the cache still says
 * "processing", that replayed frame is exactly the one that unsticks the card —
 * dropping it left the item on the loading overlay forever.
 */
function isDuplicateEvent(
  queryClient: QueryClient,
  taskId: string,
  payload: WardrobeTaskSSEPayload,
): boolean {
  const eventId = typeof payload.eventId === "number" ? payload.eventId : undefined;
  if (eventId === undefined) return false;

  const lastApplied = lastAppliedEventIds.get(taskId);
  rememberBounded(lastAppliedEventIds, taskId, Math.max(lastApplied ?? 0, eventId));

  if (lastApplied === undefined || eventId > lastApplied) return false;

  const cachedStatus = readCachedItemStatus(queryClient, payload.itemId, taskId);
  return cachedStatus !== undefined && TERMINAL_ITEM_STATUSES.has(cachedStatus);
}

function hasNotifiedTerminal(key: string): boolean {
  if (notifiedTerminalKeys.has(key)) return true;
  notifiedTerminalKeys.add(key);
  if (notifiedTerminalKeys.size > MAX_TRACKED_TASKS * 4) {
    const oldest = notifiedTerminalKeys.values().next().value;
    if (oldest !== undefined) notifiedTerminalKeys.delete(oldest);
  }
  return false;
}

/** Applies the three invalidations that represent "the server has new data". */
function invalidateWardrobeQueries(queryClient: QueryClient, onRefresh?: () => void) {
  queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
  queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.categoryDistribution() });
  queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.stats() });
  onRefresh?.();
}

/**
 * Refetches immediately, cancelling any pending debounce.
 *
 * A terminal event means the database already holds the final status, so waiting
 * 400ms only leaves a window where a backgrounded/throttled tab keeps showing
 * "processing". The optimistic cache update covers the milliseconds before the
 * response arrives.
 */
function refreshNow(queryClient: QueryClient, onRefresh?: () => void) {
  const pending = refreshTimers.get(queryClient);
  if (pending) {
    clearTimeout(pending);
    refreshTimers.delete(queryClient);
  }
  invalidateWardrobeQueries(queryClient, onRefresh);
}

function scheduleRefresh(queryClient: QueryClient, onRefresh?: () => void) {
  const pending = refreshTimers.get(queryClient);
  if (pending) clearTimeout(pending);

  const timer = setTimeout(() => {
    refreshTimers.delete(queryClient);
    invalidateWardrobeQueries(queryClient, onRefresh);
  }, REFRESH_DEBOUNCE_MS);

  refreshTimers.set(queryClient, timer);
}

/** Drops the safety-net refresh for a task that already reported a terminal state. */
function clearFallbackRefresh(taskId: string) {
  const timer = fallbackRefreshTimers.get(taskId);
  if (timer) {
    clearTimeout(timer);
    fallbackRefreshTimers.delete(taskId);
  }
}

function ensureFallbackRefresh(taskId: string, queryClient: QueryClient) {
  if (fallbackRefreshTimers.has(taskId)) return;
  fallbackRefreshTimers.set(
    taskId,
    setTimeout(() => {
      fallbackRefreshTimers.delete(taskId);
      scheduleRefresh(queryClient);
    }, FALLBACK_REFRESH_MS),
  );
}

function clearStreamIdleTimer(stream: TaskStream) {
  if (stream.idleTimer) {
    clearTimeout(stream.idleTimer);
    stream.idleTimer = undefined;
  }
}

function clearReconnectTimer(stream: TaskStream) {
  if (stream.reconnectTimer) {
    clearTimeout(stream.reconnectTimer);
    stream.reconnectTimer = undefined;
  }
}

function forgetStream(taskId: string, stream: TaskStream) {
  clearStreamIdleTimer(stream);
  clearReconnectTimer(stream);
  if (taskStreams.get(taskId) === stream) {
    taskStreams.delete(taskId);
  }
  stream.handlers.clear();
}

/** Registers a stream, aborting the oldest one when the registry is full. */
function trackStream(taskId: string, stream: TaskStream) {
  taskStreams.delete(taskId);
  taskStreams.set(taskId, stream);
  while (taskStreams.size > MAX_TRACKED_TASKS) {
    const oldest = taskStreams.keys().next().value;
    if (oldest === undefined) break;
    const evicted = taskStreams.get(oldest);
    taskStreams.delete(oldest);
    if (evicted && evicted !== stream) {
      clearStreamIdleTimer(evicted);
      clearReconnectTimer(evicted);
      evicted.controller.abort();
      evicted.handlers.clear();
    }
  }
}

/** Opens (or reopens) the underlying subscription for a stream. */
function openTaskStream(taskId: string, stream: TaskStream) {
  stream.started = true;
  stream.sawTerminal = false;
  stream.controller = new AbortController();

  void wardrobeApi.subscribeTaskSSE(
    taskId,
    (payload) => {
      stream.reconnectAttempts = 0;
      if (isTerminalPayload(payload)) stream.sawTerminal = true;
      if (isDuplicateEvent(stream.queryClient, taskId, payload)) return;
      stream.handlers.forEach((listener) => listener.onMessage(payload));
    },
    () => {
      stream.started = false;
      stream.handlers.forEach((listener) => listener.onDone());
      handleStreamEnd(taskId, stream);
    },
    (error: Error) => {
      stream.started = false;
      stream.handlers.forEach((listener) => listener.onError(error));
      handleStreamEnd(taskId, stream);
    },
    stream.controller.signal,
  );
}

/**
 * Decides what happens after a connection closes.
 *
 * A terminal frame means the task is finished: forget the stream. A close while
 * the task is still being analyzed means the delivery was interrupted, so reopen
 * with backoff instead of leaving the UI on the loading overlay.
 */
function handleStreamEnd(taskId: string, stream: TaskStream) {
  stream.started = false;

  const shouldReconnect =
    !stream.sawTerminal &&
    stream.handlers.size > 0 &&
    isTaskProcessing(taskId) &&
    stream.reconnectAttempts < RECONNECT_DELAYS_MS.length;

  if (!shouldReconnect) {
    forgetStream(taskId, stream);
    return;
  }

  const delay = RECONNECT_DELAYS_MS[stream.reconnectAttempts];
  stream.reconnectAttempts += 1;
  clearReconnectTimer(stream);
  stream.reconnectTimer = setTimeout(() => {
    stream.reconnectTimer = undefined;
    if (stream.handlers.size === 0 || !taskStreams.has(taskId)) return;
    openTaskStream(taskId, stream);
  }, delay);
}

/**
 * Registers a listener on the task's shared stream, opening it on first use.
 * Returns a release function; the connection outlives a re-render but not an
 * idle page.
 */
function acquireTaskStream(
  queryClient: QueryClient,
  taskId: string,
  handlers: StreamHandlers,
): () => void {
  let stream = taskStreams.get(taskId);
  if (!stream) {
    stream = {
      controller: new AbortController(),
      handlers: new Set(),
      started: false,
      sawTerminal: false,
      reconnectAttempts: 0,
      queryClient,
    };
    taskStreams.set(taskId, stream);
  }

  const target = stream;
  trackStream(taskId, target);
  clearStreamIdleTimer(target);
  target.handlers.add(handlers);

  if (!target.started) {
    clearReconnectTimer(target);
    openTaskStream(taskId, target);
  }

  return () => {
    target.handlers.delete(handlers);
    if (target.handlers.size > 0 || target.idleTimer) return;

    target.idleTimer = setTimeout(() => {
      target.idleTimer = undefined;
      if (target.handlers.size > 0) return;
      target.controller.abort();
      forgetStream(taskId, target);
    }, STREAM_IDLE_GRACE_MS);
  };
}

/**
 * Clears the module-level registry.
 *
 * Exported for tests only: the registry deliberately outlives a component, so a
 * fresh test or a hot reload needs an explicit reset to avoid inheriting another
 * test's connections, applied ids and toast bookkeeping.
 */
export function resetWardrobeSSEState() {
  taskStreams.forEach((stream) => {
    clearStreamIdleTimer(stream);
    clearReconnectTimer(stream);
    stream.controller.abort();
  });
  taskStreams.clear();
  lastAppliedEventIds.clear();
  notifiedTerminalKeys.clear();
  processingTaskRefs.clear();
  fallbackRefreshTimers.forEach((timer) => clearTimeout(timer));
  fallbackRefreshTimers.clear();
}

/**
 * Custom hook to automatically listen to realtime SSE updates for any wardrobe
 * items currently in `Processing` state (status === 3).
 *
 * Automatically refetches wardrobe lists and updates the UI when AI analysis
 * completes.
 */
export function useWardrobeSSE(items?: WardrobeItemRes[], onTaskUpdate?: () => void) {
  const queryClient = useQueryClient();
  const previousProcessingIds = useRef<Set<string>>(new Set());
  const onTaskUpdateRef = useRef(onTaskUpdate);

  useEffect(() => {
    onTaskUpdateRef.current = onTaskUpdate;
  }, [onTaskUpdate]);

  useEffect(() => {
    if (!items) return;

    const currentProcessingItems = items.filter(
      (item) =>
        item.status === WardrobeItemStatus.Processing ||
        (item as any).status === 3 ||
        (item as any).status === "Processing" ||
        (item as any).status === "processing",
    );

    const currentProcessingIds = new Set(currentProcessingItems.map((item) => item.id));

    // Check if any previously processing item is now finished
    if (previousProcessingIds.current.size > 0) {
      let newlyCompletedCount = 0;
      previousProcessingIds.current.forEach((id) => {
        if (!currentProcessingIds.has(id)) {
          const item = items.find((i) => i.id === id);
          if (item && item.status !== WardrobeItemStatus.Failed && (item as any).status !== 4) {
            newlyCompletedCount++;
          }
        }
      });

      if (newlyCompletedCount > 0) {
        toast.success(
          newlyCompletedCount === 1
            ? "Trang phục đã được AI phân tích hoàn tất!"
            : `${newlyCompletedCount} trang phục đã được AI phân tích hoàn tất!`,
        );
        scheduleRefresh(queryClient, () => onTaskUpdateRef.current?.());
      }
    }

    // Update previous processing IDs
    previousProcessingIds.current = currentProcessingIds;

    const releases: Array<() => void> = [];
    const retainedTaskIds: string[] = [];

    currentProcessingItems.forEach((item) => {
      const taskId = item.taskId || (item as any).task_id || (item as any).TaskID;
      if (!taskId) return;

      const handleTaskEvent = (payload: WardrobeTaskSSEPayload) => {
        const targetItemId = payload.itemId || payload.data?.id || (payload.item as any)?.id;
        const itemStatus = payload.status;
        const sseItemData = payload.data || payload.item;
        const terminal = isTerminalPayload(payload);

        if (terminal) {
          clearFallbackRefresh(taskId);
          const terminalKey = `${targetItemId || taskId}:${itemStatus}`;
          if (!hasNotifiedTerminal(terminalKey)) {
            if (itemStatus === "failed") {
              toast.error(getAnalysisErrorMessage(payload.error));
            } else if (itemStatus === "needs_review") {
              toast.info(getAnalysisErrorMessage(payload.error || "uncertain_category"));
            }
          }
        }

        let nextStatus = WardrobeItemStatus.InWardrobe;
        if (itemStatus === "completed") {
          nextStatus = WardrobeItemStatus.InWardrobe;
        } else if (itemStatus === "failed") {
          nextStatus = WardrobeItemStatus.Failed;
        } else if (itemStatus === "needs_review") {
          nextStatus = WardrobeItemStatus.NeedsReview;
        }

        const incomingCategory = sseItemData?.category || sseItemData?.fashionItem?.category;
        const incomingFashionItem = sseItemData?.fashionItem || (sseItemData?.imageUrl ? sseItemData : null);

        const processingErrorReason =
          itemStatus === "failed"
            ? (payload.error as any) || sseItemData?.fashionItem?.processingErrorReason
            : undefined;
        const reviewReason =
          itemStatus === "needs_review"
            ? (payload.error as any) || sseItemData?.fashionItem?.reviewReason || "uncertain_category"
            : undefined;

        // 1. Optimistically update item in lists cache
        queryClient.setQueriesData(
          { queryKey: WARDROBE_QUERY_KEYS.lists(), exact: false },
          (oldData: any) => {
            if (!oldData || !oldData.items) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((it: any) => {
                const isMatchingItem = targetItemId
                  ? String(it.id).toLowerCase() === String(targetItemId).toLowerCase()
                  : String(it.taskId || it.task_id || it.TaskID || "").toLowerCase() === String(taskId).toLowerCase();

                if (!isMatchingItem) return it;

                return {
                  ...it,
                  ...(sseItemData && typeof sseItemData === "object" ? sseItemData : {}),
                  category: incomingCategory || it.category,
                  fashionItem: {
                    ...(it.fashionItem || {}),
                    ...(incomingFashionItem || {}),
                    ...(processingErrorReason !== undefined ? { processingErrorReason } : {}),
                    ...(reviewReason !== undefined ? { reviewReason } : {}),
                  },
                  status: nextStatus,
                };
              }),
            };
          },
        );

        // 2. Also optimistically update detail cache if open
        if (targetItemId) {
          queryClient.setQueriesData(
            { queryKey: WARDROBE_QUERY_KEYS.detail(targetItemId), exact: false },
            (oldItem: any) => {
              if (!oldItem) return oldItem;
              return {
                ...oldItem,
                ...(sseItemData && typeof sseItemData === "object" ? sseItemData : {}),
                category: incomingCategory || oldItem.category,
                fashionItem: {
                  ...(oldItem.fashionItem || {}),
                  ...(incomingFashionItem || {}),
                  ...(processingErrorReason !== undefined ? { processingErrorReason } : {}),
                  ...(reviewReason !== undefined ? { reviewReason } : {}),
                },
                status: nextStatus,
              };
            },
          );
        }

        // 3. A terminal event reads the final state from the server immediately;
        // a processing event keeps the coalesced refresh.
        if (terminal) {
          refreshNow(queryClient, () => onTaskUpdateRef.current?.());
        } else {
          scheduleRefresh(queryClient);
        }
      };

      retainProcessingTask(taskId);
      retainedTaskIds.push(taskId);

      releases.push(
        acquireTaskStream(queryClient, taskId, {
          onMessage: handleTaskEvent,
          onDone: () => {
            clearFallbackRefresh(taskId);
            refreshNow(queryClient, () => onTaskUpdateRef.current?.());
          },
          onError: (error: Error) => {
            console.warn(`[SSE Task ${taskId}] Error:`, error);
            clearFallbackRefresh(taskId);
            scheduleRefresh(queryClient);
          },
        }),
      );

      ensureFallbackRefresh(taskId, queryClient);
    });

    return () => {
      releases.forEach((release) => release());
      retainedTaskIds.forEach((taskId) => releaseProcessingTask(taskId));
    };
  }, [items, queryClient]);
}
