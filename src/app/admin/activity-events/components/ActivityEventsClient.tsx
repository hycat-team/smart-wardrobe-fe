'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useActivityEvents } from '@/features/admin/queries/activity.queries';
import type { ActivityEventQuery } from '@/features/admin/types/activity';
import { ActivityEventsToolbar } from './ActivityEventsToolbar';
import { ActivityEventsTable } from './ActivityEventsTable';

export function ActivityEventsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL search params
  const userIdParam = searchParams.get('userId') || undefined;
  const activityTypeParam = searchParams.get('activityType') || undefined;
  const fromDateParam = searchParams.get('fromDate') || undefined;
  const toDateParam = searchParams.get('toDate') || undefined;
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 20;

  const queryParams: ActivityEventQuery = {
    userId: userIdParam,
    activityType: activityTypeParam,
    fromDate: fromDateParam,
    toDate: toDateParam,
    page: pageParam,
    limit: limitParam,
  };

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
    error: listError,
  } = useActivityEvents(queryParams);

  const updateParams = (updates: Record<string, string | number | null | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // Error message extraction from backend response
  const errorMessage =
    (listError as any)?.response?.data?.message ||
    (listError as any)?.message ||
    null;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-24 text-foreground animate-in fade-in duration-500">
      <ActivityEventsToolbar
        userId={userIdParam}
        activityType={activityTypeParam}
        fromDate={fromDateParam}
        toDate={toDateParam}
        limit={limitParam}
        onFilterChange={({ userId, activityType, fromDate, toDate, limit }) =>
          updateParams({
            userId: userId !== undefined ? userId : userIdParam,
            activityType: activityType !== undefined ? activityType : activityTypeParam,
            fromDate: fromDate !== undefined ? fromDate : fromDateParam,
            toDate: toDate !== undefined ? toDate : toDateParam,
            limit: limit !== undefined ? limit : limitParam,
            page: 1, // Reset to page 1 on filter change
          })
        }
        onReset={() =>
          updateParams({
            userId: null,
            activityType: null,
            fromDate: null,
            toDate: null,
            page: null,
            limit: null,
          })
        }
        onRefresh={() => void refetchList()}
        isRefreshing={isListFetching}
        errorMessage={errorMessage}
      />

      <ActivityEventsTable
        data={listData}
        isLoading={isListLoading}
        isFetching={isListFetching}
        error={listError}
        onPageChange={(page) => updateParams({ page })}
        onClearFilters={() =>
          updateParams({
            userId: null,
            activityType: null,
            fromDate: null,
            toDate: null,
            page: 1,
          })
        }
        onRetry={() => void refetchList()}
      />
    </div>
  );
}
