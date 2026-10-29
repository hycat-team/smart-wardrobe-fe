'use client';

import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Copy,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  canRunReconciliationAction,
  getActionDisabledReason,
  getPlanKindLabel,
  getTransactionStatusConfig,
  getTransactionTypeLabel,
  getUserDisplayName,
} from '@/features/admin/utils/transactions';
import type { ReconciliationActionType } from './ReconciliationActionDialog';

/**
 * Placeholder cho ô luôn hiển thị nhưng chưa có giá trị ("Chưa có…" in nghiêng,
 * xám mờ). Dùng cho các ô cặp để bố cục không nhảy giữa các giao dịch; không
 * dùng cho "Lý do thất bại" (khung đỏ, nghĩa là có lỗi) hay "Gói mục tiêu" của
 * giao dịch nạp ví (không áp dụng).
 */
function EmptyValue() {
  return <p className="mt-1 text-xs italic text-muted-foreground/60">Chưa có…</p>;
}

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

  // Detail-only enrichment. The list answers both as null, so every block below
  // falls back to the raw id rather than assuming a label exists.
  const buyer = transaction?.user ?? null;
  const buyerName = getUserDisplayName(buyer);
  const targetPlan = transaction?.targetPlan ?? null;
  // A `const` local (not `transaction.targetPlanId`) so the narrowing survives
  // into the copy handler's closure.
  const targetPlanId = transaction?.targetPlanId ?? null;

  // Enable/disable comes from ONE table shared with the util tests, mirroring the
  // backend matrix. The previous rule ("anything but success") lit up actions that
  // are destructive (paying a refunded transaction again) or meaningless
  // (cancelling an already cancelled one).
  const status = transaction?.status;
  const canResolvePaid = canRunReconciliationAction(status, 'resolve-paid');
  const canResolveCancelled = canRunReconciliationAction(status, 'resolve-cancelled');
  const canRetryInvestigation = canRunReconciliationAction(status, 'retry-investigation');
  const canResolveCreationFailed = canRunReconciliationAction(
    status,
    'resolve-creation-failed',
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
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
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

              {/* UUID lives here, not in the grid: as a half-width grid cell it left
                  an empty half-row beside it, and the full string is too long to
                  truncate. `break-all` keeps every character readable and copyable. */}
              <div className="mt-3 flex items-start justify-between gap-2 border-t border-border/60 pt-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Mã giao dịch (UUID)
                  </p>
                  <p className="mt-0.5 break-all font-mono text-[11px] text-foreground">
                    {transaction.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(transaction.id, 'mã giao dịch')}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="Sao chép mã giao dịch"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Buyer: the detail endpoint resolves it; the list answers null. */}
              <div className="col-span-2 rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Người dùng
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage
                      src={buyer?.avatarUrl ?? undefined}
                      alt={buyerName ?? 'Người dùng'}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                      {(buyerName ?? '?').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    {buyer && buyerName ? (
                      <>
                        <p className="truncate text-xs font-semibold text-foreground">
                          {buyerName}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                          {buyer.username && <span className="truncate">@{buyer.username}</span>}
                          {buyer.email && <span className="truncate">{buyer.email}</span>}
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Không tìm thấy tài khoản (có thể đã xoá). Tra theo User ID bên dưới.
                      </p>
                    )}

                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className="truncate font-mono text-[10px] text-muted-foreground"
                        title={transaction.userId}
                      >
                        {transaction.userId}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(transaction.userId, 'User ID')}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        title="Sao chép User ID"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target plan: hidden for a wallet top-up, which names no plan. */}
              {targetPlanId && (
                <div className="col-span-2 rounded-xl border border-border p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Gói đăng ký mục tiêu
                  </p>
                  {targetPlan ? (
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-semibold text-foreground">
                        {targetPlan.name}
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {targetPlan.slug}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {getPlanKindLabel(targetPlan.planKind)}
                      </span>
                      {typeof targetPlan.price === 'number' && (
                        <span className="text-[11px] text-muted-foreground">
                          · {formatVND(targetPlan.price)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Không tìm thấy gói trong danh mục. Tra theo mã bên dưới.
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className="truncate font-mono text-[10px] text-muted-foreground"
                      title={targetPlanId}
                    >
                      {targetPlanId}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(targetPlanId, 'mã gói')}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      title="Sao chép mã gói"
                    >
                      <Copy className="size-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* The four paired cards below ALWAYS render. Missing values answer
                  "Chưa có…" so the layout does not shift between transactions and an
                  operator can tell "not there yet" apart from "not loaded". */}
              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mã tham chiếu đối tác
                </p>
                {transaction.reference ? (
                  <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                    {transaction.reference}
                  </p>
                ) : (
                  <EmptyValue />
                )}
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Payment Link ID
                </p>
                {transaction.paymentLinkId ? (
                  <p className="mt-1 font-mono text-xs text-foreground">
                    {transaction.paymentLinkId}
                  </p>
                ) : (
                  <EmptyValue />
                )}
              </div>

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

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Thời điểm huỷ
                </p>
                {transaction.cancelledAt ? (
                  <p className="mt-1 text-xs text-foreground">
                    {formatVNDateTime(transaction.cancelledAt)}
                  </p>
                ) : (
                  <EmptyValue />
                )}
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Đối soát tự động kế tiếp
                </p>
                {transaction.nextReconciliationAt ? (
                  <p className="mt-1 text-xs text-foreground">
                    {formatVNDateTime(transaction.nextReconciliationAt)}
                  </p>
                ) : (
                  <EmptyValue />
                )}
              </div>
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
                {/* Wrapper có title vì <button disabled> không phát sự kiện hover
                    ở nhiều trình duyệt, nên tooltip gắn trực tiếp lên nút sẽ không hiện. */}
                <span
                  className="inline-flex"
                  title={
                    canResolvePaid
                      ? undefined
                      : getActionDisabledReason(status, 'resolve-paid')
                  }
                >
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
                </span>

                <span
                  className="inline-flex"
                  title={
                    canRetryInvestigation
                      ? undefined
                      : getActionDisabledReason(status, 'retry-investigation')
                  }
                >
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
                </span>

                <span
                  className="inline-flex"
                  title={
                    canResolveCreationFailed
                      ? undefined
                      : getActionDisabledReason(status, 'resolve-creation-failed')
                  }
                >
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
                </span>

                <span
                  className="inline-flex"
                  title={
                    canResolveCancelled
                      ? undefined
                      : getActionDisabledReason(status, 'resolve-cancelled')
                  }
                >
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
                </span>
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
