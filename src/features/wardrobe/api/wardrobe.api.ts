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

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = 'message';

      const isDoneEvent = (evt: string) => {
        const e = evt.toLowerCase().trim();
        return (
          e === 'done' ||
          e === 'complete' ||
          e === 'completed' ||
          e === 'success' ||
          e === 'finish' ||
          e === 'finished' ||
          e === 'task_completed' ||
          e === 'task_success'
        );
      };

      const isErrorEvent = (evt: string) => {
        const e = evt.toLowerCase().trim();
        return e === 'error' || e === 'failed' || e === 'fail' || e === 'task_failed';
      };

      const isDoneValue = (val: any): boolean => {
        if (val === null || val === undefined) return false;
        if (val === 0 || val === '0') return true;
        if (typeof val === 'boolean') return val === true;
        if (typeof val === 'string') {
          const s = val.toLowerCase().trim();
          return (
            s === 'completed' ||
            s === 'done' ||
            s === 'success' ||
            s === 'inwardrobe' ||
            s === 'in_wardrobe' ||
            s === 'finished' ||
            s === 'finish' ||
            s === 'ok'
          );
        }
        if (typeof val === 'object') {
          return (
            isDoneValue(val.status) ||
            isDoneValue(val.taskStatus) ||
            isDoneValue(val.task_status) ||
            isDoneValue(val.state) ||
            isDoneValue(val.data?.status) ||
            isDoneValue(val.data?.taskStatus) ||
            val.isSuccess === true ||
            val.success === true ||
            Boolean(val.fashionItem) ||
            Boolean(val.data?.fashionItem)
          );
        }
        return false;
      };

      const isErrorValue = (val: any): boolean => {
        if (val === null || val === undefined) return false;
        if (val === 4 || val === '4') return true;
        if (typeof val === 'string') {
          const s = val.toLowerCase().trim();
          return s === 'failed' || s === 'error' || s === 'fail';
        }
        if (typeof val === 'object') {
          return (
            isErrorValue(val.status) ||
            isErrorValue(val.taskStatus) ||
            isErrorValue(val.task_status) ||
            isErrorValue(val.state) ||
            isErrorValue(val.data?.status) ||
            Boolean(val.error)
          );
        }
        return false;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log(`[SSE Task ${taskId}] Stream closed by server -> calling onDone`);
          onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '') continue;

          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.replace('event:', '').trim();
          } else if (trimmed.startsWith('data:')) {
            const rawData = trimmed.replace('data:', '').trim();
            let parsedData: any = rawData;
            try {
              parsedData = JSON.parse(rawData);
            } catch {
              parsedData = rawData;
            }

            console.log(`[SSE Task ${taskId}] Event:`, currentEvent, 'Data:', parsedData);

            if (isDoneEvent(currentEvent) || isDoneValue(parsedData)) {
              onMessage(parsedData);
              onDone();
              return;
            } else if (isErrorEvent(currentEvent) || isErrorValue(parsedData)) {
              onError(new Error(typeof parsedData === 'string' ? parsedData : (parsedData?.message || parsedData?.error || 'Phân tích thất bại')));
              return;
            } else {
              onMessage(parsedData);
            }
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

