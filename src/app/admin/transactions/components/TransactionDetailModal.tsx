'use client';

import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { DepositTransaction } from '@/features/admin/types/transactions';
import {
  formatVND,
  formatVNDateTime,
} from '@/features/admin/utils/dashboard';
import {
  getTransactionStatusConfig,
  getTransactionTypeLabel,
} from '@/features/admin/utils/transactions';
import type { ReconciliationActionType } from './ReconciliationActionDialog';

export function TransactionDetailModal({
  transaction,
  isLoading,
  isOpen,
  onClose,
  onTriggerAction,
}: {
  transaction?: DepositTransaction | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (actionType: ReconciliationActionType, orderCode: number) => void;
}) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  if (!isOpen) return null;

  const statusConfig = transaction
    ? getTransactionStatusConfig(transaction.status)
    : null;

  const isSuccess = transaction?.status === 'success';
  const canResolvePaid = Boolean(transaction && !isSuccess);
  const canResolveCancelled = Boolean(transaction && !isSuccess);
  const canRetryInvestigation = Boolean(transaction && !isSuccess);
  const canResolveCreationFailed = Boolean(
    transaction &&
      ['creating', 'reconciliation_required', 'investigation_required'].includes(
        transaction.status,
      ),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Chi tiết giao dịch</span>
            {transaction && (
              <span className="font-mono text-sm font-normal text-muted-foreground">
                #{transaction.orderCode}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !transaction ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Không tìm thấy thông tin chi tiết giao dịch.
          </div>
        ) : (
          <div className="space-y-5 py-2 text-xs">
            {/* Header Highlight Card */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Số tiền thanh toán
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {formatVND(transaction.amount)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Loại: <span className="font-medium text-foreground">{getTransactionTypeLabel(transaction.transactionType)}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <Badge
                  variant={statusConfig?.variant || 'outline'}
                  className={`px-3 py-1 text-xs font-semibold ${statusConfig?.className}`}
                >
                  {statusConfig?.label}
                </Badge>
                {transaction.paymentUrl && (
                  <a
                    href={transaction.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    Mở cổng PayOS
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mã giao dịch (UUID)
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="truncate font-mono text-xs">{transaction.id}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transaction.id, 'mã giao dịch')}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    title="Sao chép"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mã người dùng (User ID)
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="truncate font-mono text-xs">{transaction.userId}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transaction.userId, 'User ID')}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    title="Sao chép"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              {transaction.reference && (
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Mã tham chiếu đối tác
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                    {transaction.reference}
                  </p>
                </div>
              )}

              {transaction.paymentLinkId && (
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Payment Link ID
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground">
                    {transaction.paymentLinkId}
                  </p>
                </div>
              )}

              {transaction.targetPlanId && (
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Gói đăng ký mục tiêu
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground truncate">
                    {transaction.targetPlanId}
                  </p>
                </div>
              )}

              {transaction.failureReason && (
                <div className="col-span-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                    Lý do thất bại
                  </p>
                  <p className="mt-1 text-xs text-destructive font-medium">
                    {transaction.failureReason}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Thời gian tạo
                </p>
                <p className="mt-1 text-xs text-foreground">
                  {formatVNDateTime(transaction.createdAt)}
                </p>
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Cập nhật lần cuối
                </p>
                <p className="mt-1 text-xs text-foreground">
                  {formatVNDateTime(transaction.updatedAt)}
                </p>
              </div>

              {transaction.cancelledAt && (
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Thời điểm huỷ
                  </p>
                  <p className="mt-1 text-xs text-foreground">
                    {formatVNDateTime(transaction.cancelledAt)}
                  </p>
                </div>
              )}

              {transaction.nextReconciliationAt && (
                <div className="rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Đối soát tự động kế tiếp
                  </p>
                  <p className="mt-1 text-xs text-foreground">
                    {formatVNDateTime(transaction.nextReconciliationAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Reconciliation Actions Section */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Thao tác đối soát thủ công
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chỉ thực hiện khi có xác nhận sai lệch trạng thái từ ngân hàng hoặc cổng PayOS.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  disabled={!canResolvePaid}
                  onClick={() =>
                    onTriggerAction('resolve-paid', transaction.orderCode)
                  }
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="mr-1.5 size-3.5" />
                  Xác nhận đã thanh toán
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canRetryInvestigation}
                  onClick={() =>
                    onTriggerAction('retry-investigation', transaction.orderCode)
                  }
                  className="h-8 text-xs"
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Gửi lại đối soát
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canResolveCreationFailed}
                  onClick={() =>
                    onTriggerAction('resolve-creation-failed', transaction.orderCode)
                  }
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <AlertTriangle className="mr-1.5 size-3.5" />
                  Tạo link thất bại
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canResolveCancelled}
                  onClick={() =>
                    onTriggerAction('resolve-cancelled', transaction.orderCode)
                  }
                  className="h-8 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Ban className="mr-1.5 size-3.5" />
                  Hủy giao dịch
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
