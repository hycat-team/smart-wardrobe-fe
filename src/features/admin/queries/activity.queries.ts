import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/activity.api';
import type {
  ActivityEventList,
  ActivityEventQuery,
} from '../types/activity';

const ACTIVITY_QUERY_OPTIONS = {
  staleTime: 30_000,
  refetchOnWindowFocus: 'always' as const,
};

export const activityQueryKeys = {
  all: ['admin-activity-events'] as const,
  list: (params?: ActivityEventQuery) =>
    [...activityQueryKeys.all, 'list', params] as const,
};

export const useActivityEvents = (
  params?: ActivityEventQuery,
  options?: {
    enabled?: boolean;
    initialData?: ActivityEventList | null;
  },
) =>
  useQuery({
    queryKey: activityQueryKeys.list(params),
    queryFn: () => activityApi.getActivityEvents(params),
    enabled: options?.enabled ?? true,
    initialData: options?.initialData ?? undefined,
    placeholderData: keepPreviousData,
    ...ACTIVITY_QUERY_OPTIONS,
  });
