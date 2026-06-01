import React from 'react';
import { Metadata } from 'next';
import { billingApi } from '@/features/billing/api/billing.api';
import { createServerApi } from '@/lib/axios-server';
import { WalletBalanceWidget } from '@/features/billing/components/WalletBalanceWidget';
import { TransactionHistory } from '@/features/billing/components/TransactionHistory';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ví của tôi | Smart Wardrobe',
  description: 'Quản lý số dư và lịch sử giao dịch ví nội bộ',
};

export default async function WalletPage() {
  const serverApi = createServerApi();
  const queryClient = new QueryClient();

  // Fetch wallet data on server
  let balanceData = null;
  let statementsData = [];
  let error = null;

  try {
    const [balanceRes, statementsRes] = await Promise.all([
      billingApi.getWalletBalance(serverApi),
      billingApi.getWalletStatements(serverApi),
    ]);
    balanceData = balanceRes;
    statementsData = statementsRes;

    // Prefetch for client queries
    await queryClient.prefetchQuery({
      queryKey: ['wallet', 'balance'],
      queryFn: () => billingApi.getWalletBalance(serverApi),
    });
  } catch (err) {
    console.error('Lỗi khi tải thông tin ví:', err);
    error = 'Không thể kết nối máy chủ để lấy thông tin ví.';
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Ví Nội Bộ
            </h1>
            <p className="text-zinc-400 text-lg">
              Sử dụng ví để mua các gói hội viên một cách nhanh chóng, không lo gián đoạn.
            </p>
          </header>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {!error && balanceData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Cột trái: Thẻ số dư ví */}
              <div className="lg:col-span-1 sticky top-6">
                <WalletBalanceWidget balanceData={balanceData} />
              </div>

              {/* Cột phải: Lịch sử giao dịch */}
              <div className="lg:col-span-2">
                <TransactionHistory statements={statementsData} />
              </div>
            </div>
          )}

        </div>
      </div>
    </HydrationBoundary>
  );
}
