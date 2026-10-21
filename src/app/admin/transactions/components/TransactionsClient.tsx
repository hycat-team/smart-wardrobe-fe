'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  useResolveCancelled,
  useResolveCreationFailed,
  useResolvePaid,
  useRetryInvestigation,
  useTransaction,
  useTransactions,
} from '@/features/admin/queries/transactions.queries';
import type { TransactionQuery } from '@/features/admin/types/transactions';
import { parsePeriodFromParams } from '@/features/admin/utils/period';
import {
  ReconciliationActionDialog,
  type ReconciliationActionType,
} from './ReconciliationActionDialog';
import { TransactionDetailModal } from './TransactionDetailModal';
import { TransactionsTable } from './TransactionsTable';
import { TransactionsToolbar } from './TransactionsToolbar';

export function TransactionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query params
  const statusParam = searchParams.get('status') || undefined;
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

  const queryParams: TransactionQuery = {
    status: statusParam,
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
  } = useTransactions(queryParams);

  // Detail Modal State
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const {
    data: detailData,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useTransaction(selectedTxId || undefined);

  // Reconciliation Action Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    actionType: ReconciliationActionType | null;
    orderCode: number;
  }>({
    isOpen: false,
    actionType: null,
    orderCode: 0,
  });

  // Action Mutations
  const resolvePaidMutation = useResolvePaid();
  const resolveCancelledMutation = useResolveCancelled();
  const resolveCreationFailedMutation = useResolveCreationFailed();
  const retryInvestigationMutation = useRetryInvestigation();

  const isActionPending =
    resolvePaidMutation.isPending ||
    resolveCancelledMutation.isPending ||
    resolveCreationFailedMutation.isPending ||
    retryInvestigationMutation.isPending;

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
      status: null,
      preset: null,
      fromDate: null,
      toDate: null,
      page: 1,
    });
  };

  const handleActionSubmit = async (data: {
    reason: string;
    reference?: string;
    paymentLinkId?: string;
  }) => {
    if (!dialogState.actionType || !dialogState.orderCode) return;

    try {
      let resMessage = 'Thao tác thành công';
      if (dialogState.actionType === 'resolve-paid') {
        const res = await resolvePaidMutation.mutateAsync({
          orderCode: dialogState.orderCode,
          data: {
            reason: data.reason,
            reference: data.reference || '',
            paymentLinkId: data.paymentLinkId || '',
          },
        });
        resMessage = res.message;
      } else if (dialogState.actionType === 'resolve-cancelled') {
        const res = await resolveCancelledMutation.mutateAsync({
          orderCode: dialogState.orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      } else if (dialogState.actionType === 'resolve-creation-failed') {
        const res = await resolveCreationFailedMutation.mutateAsync({
          orderCode: dialogState.orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      } else if (dialogState.actionType === 'retry-investigation') {
        const res = await retryInvestigationMutation.mutateAsync({
          orderCode: dialogState.orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      }

      toast.success(resMessage);
      setDialogState({ isOpen: false, actionType: null, orderCode: 0 });

      // Refresh detail and list
      if (selectedTxId) {
        await refetchDetail();
      }
      await refetchList();
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      } | null;
      const errMsg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        'Có lỗi xảy ra khi xử lý';
      toast.error(errMsg);
    }
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
      <TransactionsToolbar
        status={statusParam}
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

      <TransactionsTable
        data={listData}
        isLoading={isListLoading}
        isFetching={isListFetching}
        onViewDetail={(id) => setSelectedTxId(id)}
        onPageChange={(page) => updateParams({ page })}
        onClearFilters={handleReset}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={detailData}
        isLoading={isDetailLoading}
        isOpen={Boolean(selectedTxId)}
        onClose={() => setSelectedTxId(null)}
        onTriggerAction={(actionType, orderCode) => {
          setDialogState({
            isOpen: true,
            actionType,
            orderCode,
          });
        }}
      />

      {/* Reconciliation Confirmation Dialog */}
      <ReconciliationActionDialog
        isOpen={dialogState.isOpen}
        actionType={dialogState.actionType}
        orderCode={dialogState.orderCode}
        isPending={isActionPending}
        onClose={() =>
          setDialogState({ isOpen: false, actionType: null, orderCode: 0 })
        }
        onSubmit={handleActionSubmit}
      />
    </div>
  );
}
