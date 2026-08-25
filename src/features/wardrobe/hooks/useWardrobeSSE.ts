import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wardrobeApi } from "../api/wardrobe.api";
import { WARDROBE_QUERY_KEYS } from "../queries/wardrobe.queries";
import { WardrobeItemRes, WardrobeItemStatus, WardrobeTaskSSEPayload } from "../types";

/**
 * Custom hook to automatically listen to realtime SSE updates for any wardrobe items
 * currently in `Processing` state (status === 3).
 *
 * Automatically refetches wardrobe lists and updates the UI when AI analysis completes.
 */
export function useWardrobeSSE(items?: WardrobeItemRes[]) {
  const queryClient = useQueryClient();
  const activeControllers = useRef<Map<string, AbortController>>(new Map());
  const previousProcessingIds = useRef<Set<string>>(new Set());

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
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
        });
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.stats(),
        });
      }
    }

    // Update previous processing IDs
    previousProcessingIds.current = currentProcessingIds;

    const currentTaskIds = new Set(
      currentProcessingItems
        .map((item) => item.taskId || (item as any).task_id || (item as any).TaskID)
        .filter(Boolean) as string[],
    );

    // Abort subscriptions for tasks that are no longer processing
    activeControllers.current.forEach((controller, taskId) => {
      if (!currentTaskIds.has(taskId)) {
        controller.abort();
        activeControllers.current.delete(taskId);
      }
    });

    // Start SSE subscription for new processing tasks
    currentProcessingItems.forEach((item) => {
      const taskId = item.taskId || (item as any).task_id || (item as any).TaskID;
      if (!taskId || activeControllers.current.has(taskId)) return;

      const controller = new AbortController();
      activeControllers.current.set(taskId, controller);

      const handleTaskCompleted = async (payload?: WardrobeTaskSSEPayload) => {
        console.log(`[SSE Task ${taskId}] Task completed callback triggered. Updating UI...`, payload);

        // 1. Optimistically set status to InWardrobe in cache so the card immediately unblurs
        const sseItem = payload?.item || (payload as any)?.data;
        queryClient.setQueriesData(
          { queryKey: WARDROBE_QUERY_KEYS.lists() },
          (oldData: any) => {
            if (!oldData || !oldData.items) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((it: any) => {
                const itTaskId = it.taskId || it.task_id || it.TaskID;
                if (itTaskId === taskId || it.id === item.id) {
                  return {
                    ...it,
                    ...(sseItem && typeof sseItem === "object" ? sseItem : {}),
                    status: WardrobeItemStatus.InWardrobe,
                  };
                }
                return it;
              }),
            };
          },
        );

        // 2. Invalidate and refetch active queries immediately
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.lists(),
        });
        await queryClient.refetchQueries({
          queryKey: WARDROBE_QUERY_KEYS.lists(),
          type: "active",
        });
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
        });
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.stats(),
        });

        // 3. Retry refetches at 500ms, 1200ms, 2500ms to guarantee fresh DB state after transaction commit
        [500, 1200, 2500].forEach((delay) => {
          setTimeout(() => {
            queryClient.refetchQueries({
              queryKey: WARDROBE_QUERY_KEYS.lists(),
              type: "active",
            });
          }, delay);
        });

        activeControllers.current.delete(taskId);
      };

      wardrobeApi.subscribeTaskSSE(
        taskId,
        (payload: WardrobeTaskSSEPayload) => {
          // If message contains item data
          handleTaskCompleted(payload);
        },
        () => {
          // On done / success from SSE
          handleTaskCompleted();
        },
        (error: Error) => {
          console.warn(`[SSE Task ${taskId}] Error:`, error);
          queryClient.refetchQueries({
            queryKey: WARDROBE_QUERY_KEYS.lists(),
            type: "active",
          });
          activeControllers.current.delete(taskId);
        },
        controller.signal,
      );
    });
  }, [items, queryClient]);



  // Cleanup all SSE connections on unmount
  useEffect(() => {
    return () => {
      activeControllers.current.forEach((controller) => {
        controller.abort();
      });
      activeControllers.current.clear();
    };
  }, []);
}

