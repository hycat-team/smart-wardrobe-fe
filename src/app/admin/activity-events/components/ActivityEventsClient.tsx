'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useActivityEvents } from '@/features/admin/queries/activity.queries';
import type { ActivityEventQuery } from '@/features/admin/types/activity';
import { parsePeriodFromParams } from '@/features/admin/utils/period';
import { ActivityEventsToolbar } from './ActivityEventsToolbar';
import { ActivityEventsTable } from './ActivityEventsTable';

export function ActivityEventsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL search params
  const userIdParam = searchParams.get('userId') || undefined;
  const activityTypeParam = searchParams.get('activityType') || undefined;
  const rawPreset = searchParams.get('preset') || undefined;
  const rawFromDate = searchParams.get('fromDate') || undefined;
  const rawToDate = searchParams.get('toDate') || undefined;
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 20;

  // Chuẩn hóa kỳ theo URL hoặc mặc định Tháng này
  const period = parsePeriodFromParams({
    preset: rawPreset,
    fromDate: rawFromDate,
    toDate: rawToDate,
  });

  const queryParams: ActivityEventQuery = {
    userId: userIdParam,
    activityType: activityTypeParam,
    fromDate: period.fromDate,
    toDate: period.toDate,
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

  const updateParams = (
    updates: Record<string, string | number | null | undefined>
  ) => {
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

  const handleReset = () => {
    updateParams({
      userId: null,
      activityType: null,
      preset: null,
      fromDate: null,
      toDate: null,
      page: 1,
    });
  };

  // Error message extraction from backend response
  const listErr = listError as {
    response?: { data?: { message?: string } };
    message?: string;
  } | null;
  const errorMessage =
    listErr?.response?.data?.message ||
    listErr?.message ||
    null;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-24 text-foreground animate-in fade-in duration-500">
      <ActivityEventsToolbar
        userId={userIdParam}
        activityType={activityTypeParam}
        preset={period.preset}
        fromDate={period.fromDate}
        toDate={period.toDate}
        limit={limitParam}
        onFilterChange={updateParams}
        onReset={handleReset}
        onRefresh={() => void refetchList()}
        isRefreshing={isListFetching}
        errorMessage={errorMessage}
      />

      <ActivityEventsTable
        data={listData}
        isLoading={isListLoading}
        isFetching={isListFetching}
        page={pageParam}
        limit={limitParam}
        onPageChange={(page) => updateParams({ page })}
        onUserClick={(userId) => updateParams({ userId, page: 1 })}
      />
    </div>
  );
}
