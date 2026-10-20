import api from '@/lib/axios';
import type { APIResponse } from '@/types/api';
import type {
  DepositTransaction,
  ResolveActionRequest,
  ResolvePaidRequest,
  TransactionList,
  TransactionQuery,
} from '../types/transactions';

const unwrap = <T>(response: { data: APIResponse<T> }): T | null =>
  response.data.data ?? null;

export const transactionsApi = {
  getTransactions: async (params?: TransactionQuery): Promise<TransactionList | null> => {
    // Only send parameters that have values
    const queryParams: Record<string, string | number> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.fromDate) queryParams.fromDate = params.fromDate;
    if (params?.toDate) queryParams.toDate = params.toDate;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await api.get<APIResponse<TransactionList>>(
      '/admin/subscriptions/transactions',
      { params: queryParams },
    );
    return unwrap(response);
  },

  getTransaction: async (id: string): Promise<DepositTransaction | null> => {
    const response = await api.get<APIResponse<DepositTransaction>>(
      `/admin/subscriptions/transactions/${id}`,
    );
    return unwrap(response);
  },

  resolvePaid: async (
    orderCode: number,
    data: ResolvePaidRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<APIResponse<null>>(
      `/admin/subscriptions/transactions/${orderCode}/resolve-paid`,
      data,
    );
    return { message: response.data.message || 'Xác nhận giao dịch đã thanh toán thành công' };
  },

  resolveCancelled: async (
    orderCode: number,
    data: ResolveActionRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<APIResponse<null>>(
      `/admin/subscriptions/transactions/${orderCode}/resolve-cancelled`,
      data,
    );
    return { message: response.data.message || 'Xác nhận giao dịch đã huỷ thành công' };
  },

  resolveCreationFailed: async (
    orderCode: number,
    data: ResolveActionRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<APIResponse<null>>(
      `/admin/subscriptions/transactions/${orderCode}/resolve-creation-failed`,
      data,
    );
    return { message: response.data.message || 'Đánh dấu tạo link thất bại thành công' };
  },

  retryInvestigation: async (
    orderCode: number,
    data: ResolveActionRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<APIResponse<null>>(
      `/admin/subscriptions/transactions/${orderCode}/retry-investigation`,
      data,
    );
    return { message: response.data.message || 'Đã gửi lại yêu cầu đối soát giao dịch' };
  },
};
