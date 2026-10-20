import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  ActivityEventList,
  ActivityEventQuery,
} from '../types/activity';

const unwrap = <T>(response: { data: APIResponse<T> }): T | null =>
  response.data.data ?? null;

export const activityApi = {
  getActivityEvents: async (params?: ActivityEventQuery): Promise<ActivityEventList | null> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.userId) queryParams.userId = params.userId;
    if (params?.activityType) queryParams.activityType = params.activityType;
    if (params?.fromDate) queryParams.fromDate = params.fromDate;
    if (params?.toDate) queryParams.toDate = params.toDate;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await api.get<APIResponse<ActivityEventList>>(
      '/admin/activity-events',
      { params: queryParams },
    );
    return unwrap(response);
  },
};
