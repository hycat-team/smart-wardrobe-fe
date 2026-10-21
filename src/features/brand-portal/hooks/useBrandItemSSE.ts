import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { brandPortalApi } from "../api/brand-portal.api";
import { BRAND_PORTAL_KEYS } from "../queries/brand-portal.queries";
import { BrandItemRes } from "../types";
import { getAnalysisErrorMessage, getAnalysisReviewMessage } from "@/features/wardrobe/utils/analysis-status";

/**
 * Custom hook to listen to realtime SSE updates for Brand Portal items
 * currently in `Processing` state.
 */
export function useBrandItemSSE(brandId: string, items?: BrandItemRes[], onItemsUpdated?: () => void) {
  const queryClient = useQueryClient();
  const activeControllers = useRef<Map<string, AbortController>>(new Map());
  const fallbackTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

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
        const timer = fallbackTimers.current.get(taskId);
        if (timer) {
          clearTimeout(timer);
          fallbackTimers.current.delete(taskId);
        }
      }
    });

    // Start SSE subscription for each pending task
    processingItems.forEach((item) => {
      const taskId = (item as any).taskId || (item as any).task_id || (item as any).TaskID;
      if (!taskId || activeControllers.current.has(taskId)) return;

      const controller = new AbortController();
      activeControllers.current.set(taskId, controller);

      const clearTimer = () => {
        const timer = fallbackTimers.current.get(taskId);
        if (timer) {
          clearTimeout(timer);
          fallbackTimers.current.delete(taskId);
        }
      };

      // Fallback timer: if SSE stalls or connection drops without terminal event
      if (!fallbackTimers.current.has(taskId)) {
        const timer = setTimeout(() => {
          console.warn(`[Brand SSE Task ${taskId}] Fallback refetch triggered after 15s.`);
          queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.items(brandId) });
          queryClient.refetchQueries({ queryKey: BRAND_PORTAL_KEYS.items(brandId), type: "active" });
        }, 15000);
        fallbackTimers.current.set(taskId, timer);
      }

      const handleTaskEvent = (payload: any) => {
        console.log(`[Brand SSE Task ${taskId}] Event:`, payload);
        const targetItemId = payload.itemId || payload.data?.id;
        const itemStatus = String(payload.status || "").toLowerCase();
        const sseData = payload.data;

        if (itemStatus === "failed") {
          const reasonText = getAnalysisErrorMessage(payload.error);
          toast.error(reasonText || "AI phân tích sản phẩm không thành công.");
        } else if (itemStatus === "needs_review") {
          const reviewText = getAnalysisReviewMessage(payload.error || sseData?.fashionItem?.reviewReason);
          toast.info(reviewText || "Sản phẩm cần chọn danh mục để hoàn tất phân tích.");
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

              const nextStatus =
                itemStatus === "completed"
                  ? "active"
                  : itemStatus === "failed"
                  ? "failed"
                  : itemStatus === "needs_review"
                  ? "needs_review"
                  : it.status;

              const processingErrorReason =
                itemStatus === "failed"
                  ? payload.error || sseData?.fashionItem?.processingErrorReason || it.processingErrorReason
                  : undefined;

              const reviewReason =
                itemStatus === "needs_review"
                  ? (payload.error as any) || sseData?.fashionItem?.reviewReason || "uncertain_category"
                  : undefined;

              return {
                ...it,
                ...(sseData && typeof sseData === "object" ? sseData : {}),
                fashionItem: {
                  ...(it.fashionItem || {}),
                  ...(sseData?.fashionItem || {}),
                  ...(processingErrorReason !== undefined ? { processingErrorReason } : {}),
                  ...(reviewReason !== undefined ? { reviewReason } : {}),
                },
                processingErrorReason: processingErrorReason ?? it.processingErrorReason,
                reviewReason: reviewReason ?? it.reviewReason,
                status: nextStatus,
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
        clearTimer();
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
          clearTimer();
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

      fallbackTimers.current.forEach((timer) => {
        clearTimeout(timer);
      });
      fallbackTimers.current.clear();
    };
  }, []);
}

