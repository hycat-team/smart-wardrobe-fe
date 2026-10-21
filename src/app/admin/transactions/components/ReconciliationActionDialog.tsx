'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type ReconciliationActionType =
  | 'resolve-paid'
  | 'resolve-cancelled'
  | 'resolve-creation-failed'
  | 'retry-investigation';

interface DialogConfig {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'default' | 'destructive';
}

const ACTION_CONFIGS: Record<ReconciliationActionType, DialogConfig> = {
  'resolve-paid': {
    title: 'Xác nhận giao dịch đã thanh toán',
    description:
      'Giao dịch sẽ được chuyển sang trạng thái "Thành công". Vui lòng cung cấp đầy đủ mã tham chiếu ngân hàng và mã link PayOS để đối chiếu.',
    confirmLabel: 'Xác nhận thanh toán',
    variant: 'default',
  },
  'resolve-cancelled': {
    title: 'Xác nhận hủy giao dịch',
    description:
      'Giao dịch sẽ được đánh dấu "Đã hủy". Hành động này không áp dụng cho giao dịch đã thành công.',
    confirmLabel: 'Hủy giao dịch',
    variant: 'destructive',
  },
  'resolve-creation-failed': {
    title: 'Đánh dấu tạo link thất bại',
    description:
      'Chỉ áp dụng khi giao dịch đang ở trạng thái Đang tạo link, Cần đối soát hoặc Cần điều tra.',
    confirmLabel: 'Đánh dấu thất bại',
    variant: 'destructive',
  },
  'retry-investigation': {
    title: 'Gửi lại yêu cầu đối soát',
    description:
      'Đưa giao dịch về trạng thái "Cần đối soát" để worker hệ thống tự động kiểm tra lại với PayOS.',
    confirmLabel: 'Gửi đối soát lại',
    variant: 'default',
  },
};

export function ReconciliationActionDialog({
  actionType,
  orderCode,
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: {
  actionType: ReconciliationActionType | null;
  orderCode: number;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: {
    reason: string;
    reference?: string;
    paymentLinkId?: string;
  }) => void;
}) {
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [paymentLinkId, setPaymentLinkId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!actionType) return null;
  const config = ACTION_CONFIGS[actionType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!reason.trim()) {
      setValidationError('Vui lòng nhập lý do thực hiện thao tác này.');
      return;
    }

    if (actionType === 'resolve-paid') {
      if (!reference.trim()) {
        setValidationError('Vui lòng nhập mã tham chiếu giao dịch đối tác.');
        return;
      }
      if (!paymentLinkId.trim()) {
        setValidationError('Vui lòng nhập mã liên kết thanh toán (Payment Link ID).');
        return;
      }
      onSubmit({
        reason: reason.trim(),
        reference: reference.trim(),
        paymentLinkId: paymentLinkId.trim(),
      });
    } else {
      onSubmit({ reason: reason.trim() });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      setReason('');
      setReference('');
      setPaymentLinkId('');
      setValidationError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1.5">
              Đơn hàng: <span className="font-mono font-semibold text-foreground">#{orderCode}</span>. {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {validationError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {validationError}
              </div>
            )}

            {actionType === 'resolve-paid' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="reference" className="text-xs">
                    Mã tham chiếu đối tác (Reference) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reference"
                    placeholder="Ví dụ: REF-20261016-001 hoặc mã giao dịch ngân hàng"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    disabled={isPending}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paymentLinkId" className="text-xs">
                    Mã link PayOS (Payment Link ID) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="paymentLinkId"
                    placeholder="Ví dụ: pay_link_abc123"
                    value={paymentLinkId}
                    onChange={(e) => setPaymentLinkId(e.target.value)}
                    disabled={isPending}
                    className="text-xs"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs">
                Lý do xử lý <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Mô tả nguyên nhân và bằng chứng xử lý thủ công..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={config.variant || 'default'}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {config.confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
