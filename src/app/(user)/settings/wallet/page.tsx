"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/features/billing/api/billing.api";
import { WalletBalanceWidget } from "@/features/billing/components/WalletBalanceWidget";
import { TransactionHistory } from "@/features/billing/components/TransactionHistory";
import { AlertCircle, Loader2 } from "lucide-react";
export default function WalletPage() {
  const [page, setPage] = React.useState(1);
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => billingApi.getWalletBalance(),
    retry: 0,
  });
  const { data: statementsResult, isLoading: isLoadingStatements } = useQuery({
    queryKey: ["wallet", "statements", page],
    queryFn: () => billingApi.getWalletStatements({ page, limit: 10 }),
    retry: 0,
  });
  if (isLoadingBalance || isLoadingStatements) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        {" "}
        <Loader2 className="animate-spin text-purple-500" size={48} />{" "}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      {" "}
      <div className="max-w-5xl mx-auto space-y-12">
        {" "}
        <header className="mb-12">
          {" "}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {" "}
            Ví Nội Bộ{" "}
          </h1>{" "}
          <p className="text-zinc-400 text-lg">
            {" "}
            Sử dụng ví để mua các gói hội viên một cách nhanh chóng, không lo gián đoạn.{" "}
          </p>{" "}
        </header>{" "}
        {balanceError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            {" "}
            <AlertCircle size={20} /> <p>Không thể kết nối máy chủ để lấy thông tin ví.</p>{" "}
          </div>
        )}{" "}
        {!balanceError && balanceData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {" "}
            {/* Cột trái: Thẻ số dư ví */}{" "}
            <div className="lg:col-span-1 sticky top-6">
              {" "}
              <WalletBalanceWidget balanceData={balanceData} />{" "}
            </div>{" "}
            {/* Cột phải: Lịch sử giao dịch */}{" "}
            <div className="lg:col-span-2">
              {" "}
              <TransactionHistory
                statements={statementsResult?.items || []}
                page={page}
                totalPages={statementsResult?.metadata?.totalPages || 1}
                onPageChange={setPage}
              />{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
