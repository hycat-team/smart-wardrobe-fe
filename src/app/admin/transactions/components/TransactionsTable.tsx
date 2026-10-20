'use client';

import { Copy, CreditCard, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DepositTransaction, TransactionList } from '@/features/admin/types/transactions';
import { formatVND, formatVNDateTime } from '@/features/admin/utils/dashboard';
import {
  getTransactionStatusConfig,
  getTransactionTypeLabel,
} from '@/features/admin/utils/transactions';

const visiblePages = (page: number, totalPages: number) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

export function TransactionsTable({
  data,
  isLoading,
  isFetching,
  onViewDetail,
  onPageChange,
  onClearFilters,
}: {
  data?: TransactionList | null;
  isLoading: boolean;
  isFetching: boolean;
  onViewDetail: (id: string) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-2xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const items = data?.items ?? [];
  const metadata = data?.metadata;
  const currentPage = metadata?.page ?? 1;
  const totalPages = metadata?.totalPages ?? 1;

  if (items.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
        <CreditCard className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Không có giao dịch nào khớp bộ lọc
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          Hãy thử mở rộng khoảng thời gian hoặc thay đổi trạng thái cần tìm.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-4 text-xs"
        >
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-opacity ${
          isFetching ? 'opacity-70' : ''
        }`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Mã đơn PayOS</TableHead>
              <TableHead>Loại giao dịch</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Thời gian tạo</TableHead>
              <TableHead className="pr-6 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((tx) => {
              const statusConfig = getTransactionStatusConfig(tx.status);
              return (
                <TableRow key={tx.id} className="transition-colors hover:bg-muted/40">
                  <TableCell className="pl-6 font-mono text-xs font-semibold text-foreground">
                    #{tx.orderCode}
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-medium">
                      {getTransactionTypeLabel(tx.transactionType)}
                    </span>
                  </TableCell>

                  <TableCell className="font-semibold tabular-nums text-foreground">
                    {formatVND(tx.amount)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={statusConfig.variant}
                      className={`text-[11px] font-semibold ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="max-w-40 text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" title={tx.userId}>
                        {tx.userId.slice(0, 8)}...{tx.userId.slice(-4)}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tx.userId, 'User ID')}
                        className="text-muted-foreground hover:text-foreground"
                        title="Sao chép User ID"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatVNDateTime(tx.createdAt)}
                  </TableCell>

                  <TableCell className="pr-6 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(tx.id)}
                      className="h-8 gap-1.5 px-2.5 text-xs font-medium hover:bg-muted"
                    >
                      <Eye className="size-3.5" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 px-2">
          <p className="text-xs text-muted-foreground">
            Tổng cộng: <span className="font-semibold text-foreground">{metadata.totalItems}</span> giao dịch
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  scrollToTop={false}
                  text="Trước"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {visiblePages(currentPage, totalPages).map((p, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <PaginationItem key={p} className="contents">
                    {prev && p - prev > 1 && <PaginationEllipsis />}
                    <PaginationLink
                      href="#"
                      scrollToTop={false}
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  scrollToTop={false}
                  text="Sau"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
