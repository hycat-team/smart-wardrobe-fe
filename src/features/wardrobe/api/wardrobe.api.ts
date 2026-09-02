import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  WardrobeCategoryDistribution,
  WardrobeItemRes,
  WardrobeItemBriefRes,
  UploadSignatureResult,
  BatchUploadWardrobeItemsReq,
  CloneWardrobeItemReq,
  InitClosetFromCatalogReq,
  SearchWardrobeItemRes,
  UpdateWardrobeItemReq,
  CategoryRes,
  WardrobeStatsRes,
  WardrobeTaskSSEPayload,
} from '../types';

export const wardrobeApi = {
  getMyWardrobeItems: async (params?: { page?: number; limit?: number; categorySlug?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<WardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<WardrobeItemRes>>>('/me/wardrobe-items', { params });
    return res.data.data!;
  },

  getWardrobeStats: async (axiosInstance: AxiosInstance = api): Promise<WardrobeStatsRes> => {
    const res = await axiosInstance.get<APIResponse<WardrobeStatsRes>>('/me/wardrobe-items/stats');
    return res.data.data!;
  },

  getWardrobeCategoryDistribution: async (
    axiosInstance: AxiosInstance = api,
  ): Promise<WardrobeCategoryDistribution> => {
    const res = await axiosInstance.get<APIResponse<WardrobeCategoryDistribution>>(
      '/me/dashboard/wardrobe/category-distribution',
    );
    return res.data.data!;
  },
  getSystemCatalogItems: async (params?: { page?: number; limit?: number; categorySlug?: string, q?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<WardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<WardrobeItemRes>>>('/system-catalog/wardrobe-items', { params });
    return res.data.data!;
  },

  getUploadSignature: async (axiosInstance: AxiosInstance = api): Promise<UploadSignatureResult> => {
    const res = await axiosInstance.get<APIResponse<UploadSignatureResult>>('/wardrobe-items/upload-signature');
    return res.data.data!;
  },

  batchUploadWardrobeItems: async (data: BatchUploadWardrobeItemsReq): Promise<WardrobeItemBriefRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemBriefRes[]>>('/wardrobe-items/batch-upload', data);
    const result = res.data.data! as WardrobeItemBriefRes[] & { message?: string };
    if (result) result.message = res.data.message;
    return result;
  },

  subscribeTaskSSE: async (
    taskId: string,
    onMessage: (data: WardrobeTaskSSEPayload) => void,
    onDone: () => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ) => {
    try {
      const response = await fetch(`/api/v1/wardrobe-items/tasks/${taskId}/sse`, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
        },
        credentials: 'include',
        signal,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const errorMessage = errBody.message || errBody.detail || errBody.title || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(`[Status: ${response.status}] ${errorMessage}`);
      }

      let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

      try {
        reader = response.body?.getReader();
        if (!reader) throw new Error('No readable stream available');

        const decoder = new TextDecoder();
        let buffer = '';
        let processedCount = 0;
        let totalItems = 0;

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log(`[SSE Task ${taskId}] Stream closed by server -> calling onDone`);
            onDone();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // RFC 8895: SSE frames are delimited by double newline (\n\n)
          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? '';

          for (const frame of frames) {
            if (!frame.trim()) continue;

            let eventType = 'message';
            const dataLines: string[] = [];

            for (const line of frame.split('\n')) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('event:')) {
                eventType = trimmedLine.slice(6).trim();
              } else if (trimmedLine.startsWith('data:')) {
                dataLines.push(trimmedLine.slice(5).trim());
              }
            }

            if (dataLines.length === 0) continue;

            const rawData = dataLines.join('\n');
            let parsedData: any = rawData;
            try {
              parsedData = JSON.parse(rawData);
            } catch {
              parsedData = rawData;
            }

            // Ignore heartbeat / ping
            if (eventType === 'ping') continue;

            console.log(`[SSE Task ${taskId}] Event:`, eventType, 'Data:', parsedData);

            if (parsedData && typeof parsedData === 'object') {
              if (typeof parsedData.total === 'number') {
                totalItems = parsedData.total;
              }
              processedCount++;

              onMessage(parsedData as WardrobeTaskSSEPayload);

              const statusLower = String(parsedData.status || '').toLowerCase();
              const isTerminalStatus =
                eventType === 'done' ||
                statusLower === 'completed' ||
                statusLower === 'failed' ||
                statusLower === 'needs_review';

              if (
                (totalItems > 0 && processedCount >= totalItems) ||
                (isTerminalStatus && (!totalItems || totalItems <= 1))
              ) {
                console.log(`[SSE Task ${taskId}] All ${totalItems || processedCount} items processed.`);
                onDone();
                return;
              }
            } else {
              onMessage(parsedData);
            }
          }
        }
      } finally {
        if (reader) {
          try {
            await reader.cancel();
            reader.releaseLock();
          } catch {
            // Stream might already be closed
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },




  retryWardrobeItemAnalysis: async (id: string): Promise<WardrobeItemRes & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}/retry-analysis`);
    const result = res.data.data! as WardrobeItemRes & { message?: string };
    if (result) result.message = res.data.message;
    return result;
  },

  initClosetFromCatalog: async (data: InitClosetFromCatalogReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/catalog-init', data);
    const result = res.data.data! as WardrobeItemRes[] & { message?: string };
    if (result) result.message = res.data.message;
    return result;
  },

  getWardrobeItemDetail: async (id: string, axiosInstance: AxiosInstance = api): Promise<WardrobeItemRes> => {
    const res = await axiosInstance.get<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}`);
    return res.data.data!;
  },

  cloneWardrobeItem: async (id: string, data: CloneWardrobeItemReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>(`/wardrobe-items/${id}/clone`, data);
    const result = res.data.data! as WardrobeItemRes[] & { message?: string };
    if (result) result.message = res.data.message;
    return result;
  },

  updateWardrobeItem: async (id: string, data: UpdateWardrobeItemReq): Promise<WardrobeItemRes & { message?: string }> => {
    const res = await api.put<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}/manual-classify`, data);
    const result = res.data.data! as WardrobeItemRes & { message?: string };
    if (result) result.message = res.data.message;
    return result;
  },

  deleteWardrobeItem: async (id: string, axiosInstance: AxiosInstance = api): Promise<{ message?: string }> => {
    const res = await axiosInstance.delete<APIResponse<void>>(`/wardrobe-items/${id}`);
    return { message: res.data.message };
  },

  bulkDeleteWardrobeItems: async (data: { ids: string[] }): Promise<{ message?: string }> => {
    const res = await api.delete<APIResponse<void>>(`/wardrobe-items/bulk`, { data });
    return { message: res.data.message };
  },

  getCategories: async (axiosInstance: AxiosInstance = api): Promise<CategoryRes[]> => {
    const res = await axiosInstance.get<APIResponse<CategoryRes[]>>('/categories');
    return res.data.data!;
  },

  searchWardrobeItems: async (params?: { q?: string; page?: number; limit?: number; categorySlug?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<SearchWardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<SearchWardrobeItemRes>>>('/wardrobe-items/search', {
      params,
    });
    return res.data.data!;
  },
};

