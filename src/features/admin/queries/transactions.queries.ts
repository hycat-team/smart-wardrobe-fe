import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type {
  DepositTransaction,
  ResolveActionRequest,
  ResolvePaidRequest,
  TransactionList,
  TransactionQuery,
} from '../types/transactions';

const TRANSACTIONS_QUERY_OPTIONS = {
  staleTime: 30_000,
  refetchOnWindowFocus: 'always' as const,
};

export const transactionQueryKeys = {
  all: ['admin-transactions'] as const,
  list: (params?: TransactionQuery) =>
    [...transactionQueryKeys.all, 'list', params] as const,
  detail: (id?: string) =>
    [...transactionQueryKeys.all, 'detail', id] as const,
};

export const useTransactions = (
  params?: TransactionQuery,
  options?: {
    enabled?: boolean;
    initialData?: TransactionList | null;
  },
) =>
  useQuery({
    queryKey: transactionQueryKeys.list(params),
    queryFn: () => transactionsApi.getTransactions(params),
    enabled: options?.enabled ?? true,
    initialData: options?.initialData ?? undefined,
    placeholderData: keepPreviousData,
    ...TRANSACTIONS_QUERY_OPTIONS,
  });

export const useTransaction = (
  id?: string,
  options?: {
    enabled?: boolean;
    initialData?: DepositTransaction | null;
  },
) =>
  useQuery({
    queryKey: transactionQueryKeys.detail(id),
    queryFn: () => (id ? transactionsApi.getTransaction(id) : Promise.resolve(null)),
    enabled: Boolean(id) && (options?.enabled ?? true),
    initialData: options?.initialData ?? undefined,
    ...TRANSACTIONS_QUERY_OPTIONS,
  });

export const useResolvePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: number;
      data: ResolvePaidRequest;
    }) => transactionsApi.resolvePaid(orderCode, data),
    onSuccess: (_, { orderCode }) => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};

export const useResolveCancelled = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: number;
      data: ResolveActionRequest;
    }) => transactionsApi.resolveCancelled(orderCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};

export const useResolveCreationFailed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: number;
      data: ResolveActionRequest;
    }) => transactionsApi.resolveCreationFailed(orderCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};

export const useRetryInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: number;
      data: ResolveActionRequest;
    }) => transactionsApi.retryInvestigation(orderCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};
