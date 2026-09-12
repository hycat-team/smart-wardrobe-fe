import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { brandPortalApi } from "../api/brand-portal.api";
import { BRAND_PORTAL_KEYS } from "../queries/brand-portal.queries";
import { BrandItemRes } from "../types";

/**
 * Custom hook to listen to realtime SSE updates for Brand Portal items
 * currently in `Processing` state.
 */
export function useBrandItemSSE(brandId: string, items?: BrandItemRes[], onItemsUpdated?: () => void) {
  const queryClient = useQueryClient();
  const activeControllers = useRef<Map<string, AbortController>>(new Map());

  useEffect(() => {
    if (!brandId || !items) return;

    const processingItems = items.filter(
      (item) =>
        item.status === "processing" ||
        (item as any).status === 3 ||
        (item as any).status === "Processing",
    );

    const currentTaskIds = new Set(
      processingItems
        .map((item) => (item as any).taskId || (item as any).task_id || (item as any).TaskID)
        .filter(Boolean) as string[],
    );

    // Abort subscriptions for finished tasks
    activeControllers.current.forEach((controller, taskId) => {
      if (!currentTaskIds.has(taskId)) {
        controller.abort();
        activeControllers.current.delete(taskId);
      }
    });

    // Start SSE subscription for each pending task
    processingItems.forEach((item) => {
      const taskId = (item as any).taskId || (item as any).task_id || (item as any).TaskID;
      if (!taskId || activeControllers.current.has(taskId)) return;

      const controller = new AbortController();
      activeControllers.current.set(taskId, controller);

      const handleTaskEvent = (payload: any) => {
        console.log(`[Brand SSE Task ${taskId}] Event:`, payload);
        const targetItemId = payload.itemId || payload.data?.id;
        const itemStatus = payload.status;
        const sseData = payload.data;

        if (itemStatus === "failed") {
          toast.error(payload.error || "AI phân tích sản phẩm không thành công.");
        } else if (itemStatus === "completed") {
          toast.success("Sản phẩm đã được AI phân tích hoàn tất!");
        }

        // Optimistically update list in cache
        queryClient.setQueriesData(
          { queryKey: BRAND_PORTAL_KEYS.items(brandId), exact: false },
          (oldList: any) => {
            if (!Array.isArray(oldList)) return oldList;
            return oldList.map((it: any) => {
              const isMatch =
                (Boolean(targetItemId) && String(it.id).toLowerCase() === String(targetItemId).toLowerCase()) ||
                (String(it.taskId || it.task_id || "").toLowerCase() === String(taskId).toLowerCase());
              if (!isMatch) return it;
              return {
                ...it,
                ...(sseData && typeof sseData === "object" ? sseData : {}),
                status: itemStatus === "completed" ? "active" : itemStatus === "failed" ? "failed" : it.status,
              };
            });
          },
        );

        if (targetItemId) {
          queryClient.invalidateQueries({
            queryKey: BRAND_PORTAL_KEYS.itemDetail(brandId, targetItemId),
          });
        }

        queryClient.invalidateQueries({
          queryKey: BRAND_PORTAL_KEYS.items(brandId),
        });
        queryClient.refetchQueries({
          queryKey: BRAND_PORTAL_KEYS.items(brandId),
          type: "active",
        });

        if (onItemsUpdated) {
          onItemsUpdated();
        }
      };

      const handleTaskDone = () => {
        queryClient.invalidateQueries({
          queryKey: BRAND_PORTAL_KEYS.items(brandId),
        });
        queryClient.refetchQueries({
          queryKey: BRAND_PORTAL_KEYS.items(brandId),
          type: "active",
        });
        if (onItemsUpdated) {
          onItemsUpdated();
        }
        activeControllers.current.delete(taskId);
      };

      brandPortalApi.subscribeBrandItemTaskSSE(
        brandId,
        taskId,
        handleTaskEvent,
        handleTaskDone,
        (error) => {
          console.warn(`[Brand SSE Task ${taskId}] Error:`, error);
          queryClient.refetchQueries({
            queryKey: BRAND_PORTAL_KEYS.items(brandId),
            type: "active",
          });
          activeControllers.current.delete(taskId);
        },
        controller.signal,
      );
    });
  }, [brandId, items, onItemsUpdated, queryClient]);

  useEffect(() => {
    return () => {
      activeControllers.current.forEach((controller) => {
        controller.abort();
      });
      activeControllers.current.clear();
    };
  }, []);
}
