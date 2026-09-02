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
export function useWardrobeSSE(items?: WardrobeItemRes[], onTaskUpdate?: () => void) {
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
        if (onTaskUpdate) {
          onTaskUpdate();
        }
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

      const handleTaskEvent = async (payload: WardrobeTaskSSEPayload) => {
        console.log(`[SSE Task ${taskId}] Event received:`, payload);

        const targetItemId = payload.itemId || payload.data?.id || (payload.item as any)?.id;
        const itemStatus = payload.status;
        const sseItemData = payload.data || payload.item;

        if (itemStatus === "failed") {
          toast.error(payload.error || "AI phân tích hình ảnh không thành công.");
        } else if (itemStatus === "needs_review") {
          toast.info("Một số hình ảnh cần bạn chọn lại danh mục.");
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
                },
                status: nextStatus,
              };
            },
          );
        }

        // 3. Trigger immediate active refetch & custom callback
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.lists(),
        });
        queryClient.refetchQueries({
          queryKey: WARDROBE_QUERY_KEYS.lists(),
          type: "active",
        });
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.categoryDistribution(),
        });
        queryClient.invalidateQueries({
          queryKey: WARDROBE_QUERY_KEYS.stats(),
        });

        if (onTaskUpdate) {
          onTaskUpdate();
        }
      };

      const handleTaskDone = async () => {
        console.log(`[SSE Task ${taskId}] Task done. Refetching lists...`);
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

        if (onTaskUpdate) {
          onTaskUpdate();
        }

        // Small delay to ensure consistency
        setTimeout(() => {
          queryClient.refetchQueries({
            queryKey: WARDROBE_QUERY_KEYS.lists(),
            type: "active",
          });
          if (onTaskUpdate) {
            onTaskUpdate();
          }
        }, 800);

        activeControllers.current.delete(taskId);
      };

      wardrobeApi.subscribeTaskSSE(
        taskId,
        (payload: WardrobeTaskSSEPayload) => {
          handleTaskEvent(payload);
        },
        () => {
          handleTaskDone();
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

