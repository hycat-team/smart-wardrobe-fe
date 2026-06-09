'use client';

import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { WalletStatementDTO } from '../types';
import { Empty, EmptyTitle, EmptyDescription, EmptyHeader } from '@/components/ui/empty';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

gsap.registerPlugin(useGSAP);

export function TransactionHistory({ statements }: { statements: WalletStatementDTO[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (statements && statements.length > 0) {
      gsap.from('.tx-row', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      });
    }
  }, { scope: container, dependencies: [statements] });

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getTransactionIcon = (type: number, amount: number) => {
    // Assuming positive amount = topup/receive, negative = purchase/spend
    if (amount >= 0) {
      return <ArrowDownLeft className="size-4 text-emerald-500" />;
    }
    return <ArrowUpRight className="size-4 text-red-500" />;
  };

  return (
    <Card ref={container} className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-xl dark:bg-zinc-900/50">
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-xl">Lịch sử giao dịch</CardTitle>
        <CardDescription>Danh sách các biến động số dư trong ví của bạn</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {(!statements || statements.length === 0) ? (
          <div className="py-12 px-6">
            <Empty>
              <EmptyHeader>
                <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <Wallet className="size-6 text-zinc-500" />
                </div>
                <EmptyTitle>Chưa có giao dịch nào</EmptyTitle>
                <EmptyDescription>Bạn chưa thực hiện giao dịch nạp tiền hoặc mua gói nào.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Thời gian</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="text-right">Số dư sau GD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((tx) => (
                <TableRow key={tx.id} className="tx-row hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-medium text-zinc-600 dark:text-zinc-400">
                    {format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full shrink-0 ${tx.amount >= 0 ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                        {getTransactionIcon(tx.transactionType, tx.amount)}
                      </div>
                      <span className="line-clamp-1">{tx.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${tx.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatVND(tx.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-zinc-500">
                    {formatVND(tx.newBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
