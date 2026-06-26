import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "../api/wallet.api";
import { WalletTopUpReq } from "../types";

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
  statements: () => [...walletKeys.all, "statements"] as const,
};

export const useWalletBalance = () => {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: walletApi.getWalletBalance,
  });
};

export const useWalletStatements = () => {
  return useQuery({
    queryKey: walletKeys.statements(),
    queryFn: walletApi.getWalletStatements,
  });
};

export const useTopUpWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WalletTopUpReq) => walletApi.createTopUpRequest(data),
    onSuccess: () => {
      // Invalidate to refresh data later
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() });
      queryClient.invalidateQueries({ queryKey: walletKeys.statements() });
    },
  });
};
