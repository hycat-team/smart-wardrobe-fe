'use client';

import { useWalletBalance, useWalletStatements } from '../queries/wallet.queries';
import { WalletBalanceCard } from './WalletBalanceCard';
import { TransactionHistory } from './TransactionHistory';
import { Skeleton } from '@/components/ui/skeleton';

export function WalletPageContent() {
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance();
  const { data: statements, isLoading: isStatementsLoading } = useWalletStatements();

  return (
    <div className="flex flex-col gap-8">
      {isBalanceLoading ? (
        <Skeleton className="h-[250px] w-full rounded-xl" />
      ) : (
        <WalletBalanceCard balanceData={balanceData} />
      )}

      {isStatementsLoading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : (
        <TransactionHistory statements={statements || []} />
      )}
    </div>
  );
}
