import api from "@/lib/axios";
import { AxiosInstance } from "axios";
import { APIResponse, PaginationResult } from "@/types/api";
import { DirectPurchaseReq, PaymentLinkRes, Statement, TopUpReq, WalletBalance } from "../types";

export const billingApi = {
  getWalletBalance: async (axiosInstance: AxiosInstance = api): Promise<WalletBalance> => {
    const res = await axiosInstance.get<APIResponse<WalletBalance>>("/subscriptions/me/wallet");
    return res.data.data!;
  },

  getWalletStatements: async (
    params?: { page?: number; limit?: number },
    axiosInstance: AxiosInstance = api
  ): Promise<PaginationResult<Statement>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<Statement>>>(
      "/subscriptions/me/wallet/statements",
      { params }
    );
    return res.data.data!;
  },

  topupWallet: async (data: TopUpReq): Promise<PaymentLinkRes> => {
    const res = await api.post<APIResponse<PaymentLinkRes>>("/subscriptions/me/wallet/topup", data);
    return res.data.data!;
  },

  purchasePlanDirect: async (data: DirectPurchaseReq): Promise<PaymentLinkRes> => {
    const res = await api.post<APIResponse<PaymentLinkRes>>("/subscriptions/me/purchase", data);
    return res.data.data!;
  },

  purchasePlanWithWallet: async (
    data: DirectPurchaseReq
  ): Promise<{ data: boolean; message?: string }> => {
    const res = await api.post<APIResponse<boolean>>(
      "/subscriptions/me/purchase-with-wallet",
      data
    );
    return { data: res.data.data!, message: res.data.message };
  },
};
