'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { CampaignSummaryRes, UpdateCampaignReq } from '../types/campaign-admin.types';
import { editCampaignSchema, EditCampaignFormData } from '../utils/campaign-validation';
import { useUpdateCampaign } from '../queries/campaign-admin.queries';

interface EditCampaignModalProps {
  campaign: CampaignSummaryRes;
  isOpen: boolean;
  onClose: () => void;
}

// Chuyển chuỗi datetime-local sang RFC3339 có múi giờ
function toRFC3339String(localDateTimeStr?: string | null): string | null {
  if (!localDateTimeStr) return null;
  const d = new Date(localDateTimeStr);
  if (isNaN(d.getTime())) return null;

  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (num: number) => String(Math.floor(Math.abs(num))).padStart(2, '0');
  const tzHours = pad(offset / 60);
  const tzMinutes = pad(offset % 60);
  const tzFormatted = `${sign}${tzHours}:${tzMinutes}`;

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzFormatted}`;
}

// Định dạng ISO Date sang giá trị datetime-local của input
function toLocalInputValue(isoString?: string | null): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';

  const pad = (num: number) => String(num).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditCampaignModal({ campaign, isOpen, onClose }: EditCampaignModalProps) {
  const updateMutation = useUpdateCampaign(campaign.code);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCampaignFormData>({
    resolver: zodResolver(editCampaignSchema),
    defaultValues: {
      quota: campaign.quota,
      reserve: campaign.reserve,
      planSlug: campaign.planSlug,
      startsAt: toLocalInputValue(campaign.startsAt),
      endsAt: toLocalInputValue(campaign.endsAt),
    },
  });

  useEffect(() => {
    reset({
      quota: campaign.quota,
      reserve: campaign.reserve,
      planSlug: campaign.planSlug,
      startsAt: toLocalInputValue(campaign.startsAt),
      endsAt: toLocalInputValue(campaign.endsAt),
    });
  }, [campaign, reset]);

  const onSubmit = async (data: EditCampaignFormData) => {
    const payload: UpdateCampaignReq = {
      version: campaign.version,
    };

    // Chỉ gửi các trường thay đổi
    if (!campaign.budgetLocked) {
      if (data.quota !== undefined && Number(data.quota) !== campaign.quota) {
        payload.quota = Number(data.quota);
      }
      if (data.reserve !== undefined && Number(data.reserve) !== campaign.reserve) {
        payload.reserve = Number(data.reserve);
      }
      if (data.planSlug && data.planSlug.trim() !== campaign.planSlug) {
        payload.planSlug = data.planSlug.trim();
      }
    }

    // Thời gian bắt đầu
    if (data.startsAt) {
      const startsRFC = toRFC3339String(data.startsAt);
      if (startsRFC && startsRFC !== campaign.startsAt) {
        payload.startsAt = startsRFC;
      }
    }

    // Thời gian kết thúc (nếu xóa ngày kết thúc -> gửi null)
    if (!data.endsAt || data.endsAt.trim() === '') {
      if (campaign.endsAt !== null) {
        payload.endsAt = null;
      }
    } else {
      const endsRFC = toRFC3339String(data.endsAt);
      if (endsRFC && endsRFC !== campaign.endsAt) {
        payload.endsAt = endsRFC;
      }
    }

    // Nếu không có trường nào thay đổi ngoài version
    const changedKeys = Object.keys(payload).filter((k) => k !== 'version');
    if (changedKeys.length === 0) {
      onClose();
      return;
    }

    try {
      await updateMutation.mutateAsync(payload);
      onClose();
    } catch {
      // Đã được xử lý ở query onError (kể cả HTTP 412)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Chỉnh Sửa Chiến Dịch</DialogTitle>
          <DialogDescription className="text-xs">
            Cập nhật thông tin chiến dịch <span className="font-mono font-bold text-foreground">{campaign.code}</span> (Phiên bản v{campaign.version}).
          </DialogDescription>
        </DialogHeader>

        {campaign.budgetLocked && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Lock className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Chiến dịch đã cấp — hãy đóng và mở mã mới.</span>
              <p className="opacity-90 mt-0.5">
                Các ô hạn mức (quota), lượng dự phòng (reserve) và mã gói (planSlug) đã bị khóa. Bạn vẫn có thể điều chỉnh thời gian diễn ra.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* 1. Mã chiến dịch (Read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Mã chiến dịch (Code)</Label>
            <Input
              value={campaign.code}
              disabled
              className="text-xs font-mono bg-muted/50 cursor-not-allowed"
            />
          </div>

          {/* 2. Gói cước */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-plan" className="text-xs font-semibold">
              Mã gói cước tặng (Plan Slug)
            </Label>
            <Input
              id="edit-plan"
              disabled={campaign.budgetLocked}
              className={`text-xs font-mono ${campaign.budgetLocked ? 'bg-muted/50 cursor-not-allowed' : ''}`}
              {...register('planSlug')}
            />
            {errors.planSlug && <p className="text-xs text-destructive">{errors.planSlug.message}</p>}
          </div>

          {/* 3. Hạn mức & Dự phòng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-quota" className="text-xs font-semibold">
                Hạn mức chính (Quota)
              </Label>
              <Input
                id="edit-quota"
                type="number"
                min={1}
                disabled={campaign.budgetLocked}
                className={`text-xs ${campaign.budgetLocked ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                {...register('quota', { valueAsNumber: true })}
              />
              {errors.quota && <p className="text-xs text-destructive">{errors.quota.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-reserve" className="text-xs font-semibold">
                Suất dự phòng (Reserve)
              </Label>
              <Input
                id="edit-reserve"
                type="number"
                min={0}
                disabled={campaign.budgetLocked}
                className={`text-xs ${campaign.budgetLocked ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                {...register('reserve', { valueAsNumber: true })}
              />
              {errors.reserve && <p className="text-xs text-destructive">{errors.reserve.message}</p>}
            </div>
          </div>

          {/* 4. Thời gian bắt đầu & kết thúc (luôn sửa được) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-startsAt" className="text-xs font-semibold">
                Bắt đầu lúc
              </Label>
              <Input
                id="edit-startsAt"
                type="datetime-local"
                className="text-xs"
                {...register('startsAt')}
              />
              {errors.startsAt && <p className="text-xs text-destructive">{errors.startsAt.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-endsAt" className="text-xs font-semibold">
                Kết thúc lúc
              </Label>
              <Input
                id="edit-endsAt"
                type="datetime-local"
                className="text-xs"
                {...register('endsAt')}
              />
              <p className="text-[11px] text-muted-foreground">Xóa trống = Xóa ngày kết thúc (vô thời hạn)</p>
              {errors.endsAt && <p className="text-xs text-destructive">{errors.endsAt.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={updateMutation.isPending} className="gap-1.5">
              {updateMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
