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
  const fromDateParam = searchParams.get('fromDate') || undefined;
  const toDateParam = searchParams.get('toDate') || undefined;
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 20;

  const queryParams: TransactionQuery = {
    status: statusParam,
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

  // Mutations
  const resolvePaidMutation = useResolvePaid();
  const resolveCancelledMutation = useResolveCancelled();
  const resolveCreationFailedMutation = useResolveCreationFailed();
  const retryInvestigationMutation = useRetryInvestigation();

  const isActionPending =
    resolvePaidMutation.isPending ||
    resolveCancelledMutation.isPending ||
    resolveCreationFailedMutation.isPending ||
    retryInvestigationMutation.isPending;

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

  const handleActionSubmit = async (data: {
    reason: string;
    reference?: string;
    paymentLinkId?: string;
  }) => {
    const { actionType, orderCode } = dialogState;
    if (!actionType || !orderCode) return;

    try {
      let resMessage = '';
      if (actionType === 'resolve-paid') {
        const res = await resolvePaidMutation.mutateAsync({
          orderCode,
          data: {
            reason: data.reason,
            reference: data.reference || '',
            paymentLinkId: data.paymentLinkId || '',
          },
        });
        resMessage = res.message;
      } else if (actionType === 'resolve-cancelled') {
        const res = await resolveCancelledMutation.mutateAsync({
          orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      } else if (actionType === 'resolve-creation-failed') {
        const res = await resolveCreationFailedMutation.mutateAsync({
          orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      } else if (actionType === 'retry-investigation') {
        const res = await retryInvestigationMutation.mutateAsync({
          orderCode,
          data: { reason: data.reason },
        });
        resMessage = res.message;
      }

      toast.success(resMessage || 'Thao tác đối soát thành công');
      setDialogState({ isOpen: false, actionType: null, orderCode: 0 });

      // Refetch detail and list
      await Promise.allSettled([refetchDetail(), refetchList()]);

      // Retry refetch after 1s just in case async DB update in background
      setTimeout(() => {
        void Promise.allSettled([refetchDetail(), refetchList()]);
      }, 1000);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể thực hiện thao tác đối soát thủ công.';
      toast.error(errorMsg);
    }
  };

  // Error extraction from list
  const errorMessage =
    (listError as any)?.response?.data?.message ||
    (listError as any)?.message ||
    null;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-24 text-foreground animate-in fade-in duration-500">
      <TransactionsToolbar
        status={statusParam}
        fromDate={fromDateParam}
        toDate={toDateParam}
        limit={limitParam}
        onFilterChange={({ status, fromDate, toDate, limit }) =>
          updateParams({
            status: status !== undefined ? status : statusParam,
            fromDate: fromDate !== undefined ? fromDate : fromDateParam,
            toDate: toDate !== undefined ? toDate : toDateParam,
            limit: limit !== undefined ? limit : limitParam,
            page: 1, // Reset to page 1 on filter change
          })
        }
        onReset={() =>
          updateParams({
            status: null,
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

      <TransactionsTable
        data={listData}
        isLoading={isListLoading}
        isFetching={isListFetching}
        onViewDetail={(id) => setSelectedTxId(id)}
        onPageChange={(page) => updateParams({ page })}
        onClearFilters={() =>
          updateParams({
            status: null,
            fromDate: null,
            toDate: null,
            page: 1,
          })
        }
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
