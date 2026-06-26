import api from "@/lib/axios";
import { APIResponse } from "@/types/api";
import { WalletDTO, WalletStatementDTO, WalletTopUpReq, PaymentLinkDTO } from "../types";

export const walletApi = {
  getWalletBalance: async (): Promise<WalletDTO> => {
    const res = await api.get<APIResponse<WalletDTO>>("/subscriptions/me/wallet");
    return res.data.data || (res.data as any);
  },

  getWalletStatements: async (): Promise<WalletStatementDTO[]> => {
    const res = await api.get<APIResponse<WalletStatementDTO[]>>(
      "/subscriptions/me/wallet/statements"
    );
    return res.data.data || (res.data as any);
  },

  createTopUpRequest: async (data: WalletTopUpReq): Promise<PaymentLinkDTO> => {
    const res = await api.post<APIResponse<PaymentLinkDTO>>("/subscriptions/me/wallet/topup", data);
    return res.data.data || (res.data as any);
  },
};
