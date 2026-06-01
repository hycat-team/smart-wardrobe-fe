import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse } from '@/types/api';
import { DirectPurchaseReq, PaymentLinkRes, Statement, TopUpReq, WalletBalance } from '../types';

export const billingApi = {
  getWalletBalance: async (axiosInstance: AxiosInstance = api): Promise<WalletBalance> => {
    const res = await axiosInstance.get<APIResponse<WalletBalance>>('/subscriptions/me/wallet');
    return res.data.data!;
  },

  getWalletStatements: async (axiosInstance: AxiosInstance = api): Promise<Statement[]> => {
    const res = await axiosInstance.get<APIResponse<Statement[]>>('/subscriptions/me/wallet/statements');
    return res.data.data!;
  },

  topupWallet: async (data: TopUpReq): Promise<PaymentLinkRes> => {
    const res = await api.post<APIResponse<PaymentLinkRes>>('/subscriptions/me/wallet/topup', data);
    return res.data.data!;
  },

  purchasePlanDirect: async (data: DirectPurchaseReq): Promise<PaymentLinkRes> => {
    const res = await api.post<APIResponse<PaymentLinkRes>>('/subscriptions/me/purchase', data);
    return res.data.data!;
  },

  purchasePlanWithWallet: async (data: DirectPurchaseReq): Promise<boolean> => {
    const res = await api.post<APIResponse<boolean>>('/subscriptions/me/purchase-with-wallet', data);
    return res.data.data!;
  },
};
