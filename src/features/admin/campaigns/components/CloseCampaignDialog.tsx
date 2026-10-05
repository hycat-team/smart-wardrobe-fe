'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useCloseCampaign } from '../queries/campaign-admin.queries';

interface CloseCampaignDialogProps {
  campaignCode: string;
  version: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CloseCampaignDialog({
  campaignCode,
  version,
  isOpen,
  onClose,
}: CloseCampaignDialogProps) {
  const [reason, setReason] = useState('');
  const closeMutation = useCloseCampaign(campaignCode);

  const handleCloseCampaign = async () => {
    if (!reason.trim()) return;

    try {
      await closeMutation.mutateAsync({
        version,
        reason: reason.trim(),
      });
      setReason('');
      onClose();
    } catch {
      // Đã được xử lý trong onError của mutation
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <div className="size-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-2">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-destructive">
            Đóng Cưỡng Bức Chiến Dịch?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Bạn có chắc chắn muốn đóng chiến dịch <strong className="text-foreground font-mono">{campaignCode}</strong>?{' '}
            <span className="text-red-600 dark:text-red-400 font-semibold block mt-1">
              ⚠️ Đây là thao tác một chiều và KHÔNG THỂ mở lại sau khi đóng. Hệ thống sẽ ngừng cấp gói mới ngay lập tức.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="close-reason" className="text-xs font-semibold">
            Lý do giải trình đóng chiến dịch <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="close-reason"
            rows={3}
            placeholder="Ví dụ: Đã đạt ngân sách thử nghiệm hoặc chương trình khuyến mãi kết thúc sớm theo chỉ đạo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-xs resize-none"
          />
          <p className="text-[11px] text-muted-foreground">
            Lý do này là bắt buộc và sẽ được lưu trữ vĩnh viễn vào nhật ký kiểm toán hệ thống.
          </p>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={closeMutation.isPending}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCloseCampaign}
            disabled={!reason.trim() || closeMutation.isPending}
            className="gap-1.5"
          >
            {closeMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
            Xác nhận đóng chiến dịch
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
