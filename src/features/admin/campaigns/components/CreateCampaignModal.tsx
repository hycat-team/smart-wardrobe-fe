'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import {
  createCampaignSchema,
  CreateCampaignFormData,
} from '../utils/campaign-validation';
import { useCreateCampaign } from '../queries/campaign-admin.queries';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Chuyển chuỗi datetime-local sang RFC3339 có múi giờ
function toRFC3339String(localDateTimeStr?: string | null): string | null {
  if (!localDateTimeStr) return null;
  const d = new Date(localDateTimeStr);
  if (isNaN(d.getTime())) return null;

  // Lấy múi giờ địa phương định dạng ±HH:MM
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

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const router = useRouter();
  const [conflictError, setConflictError] = useState<string | null>(null);
  const createMutation = useCreateCampaign();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      code: '',
      planSlug: 'premium-monthly',
      quota: 50,
      reserve: 5,
      startsAt: '',
      endsAt: '',
    },
  });

  const onSubmit = async (data: CreateCampaignFormData) => {
    setConflictError(null);

    const startsAtRFC = toRFC3339String(data.startsAt);
    const endsAtRFC = data.endsAt ? toRFC3339String(data.endsAt) : null;

    if (!startsAtRFC) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        code: data.code.trim().toLowerCase(),
        planSlug: data.planSlug.trim(),
        quota: Number(data.quota),
        reserve: Number(data.reserve || 0),
        startsAt: startsAtRFC,
        endsAt: endsAtRFC,
      });

      reset();
      onClose();
      router.push(`/admin/campaigns/${encodeURIComponent(data.code.trim().toLowerCase())}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setConflictError(
          err.response.data?.message || `Đã tồn tại chiến dịch với mã "${data.code}". Vui lòng chọn mã khác.`
        );
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setConflictError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Mở Chiến Dịch Tặng Gói Mới</DialogTitle>
          <DialogDescription className="text-xs">
            Khởi tạo chiến dịch khuyến mãi tặng gói Premium cho tài khoản đăng ký mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {conflictError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <span>{conflictError}</span>
            </div>
          )}

          {/* 1. Mã chiến dịch */}
          <div className="space-y-1.5">
            <Label htmlFor="create-code" className="text-xs font-semibold">
              Mã chiến dịch (Code) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-code"
              placeholder="ví dụ: launch-2026-10 hoặc tet-2027"
              className="text-xs font-mono lowercase"
              {...register('code')}
            />
            <p className="text-[11px] text-muted-foreground">
              3-64 ký tự chữ thường, số và gạch ngang. Bắt đầu bằng chữ hoặc số. Mã là bất biến sau khi tạo.
            </p>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          {/* 2. Gói cước */}
          <div className="space-y-1.5">
            <Label htmlFor="create-plan" className="text-xs font-semibold">
              Mã gói cước tặng (Plan Slug) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="create-plan"
              placeholder="ví dụ: premium-monthly"
              className="text-xs font-mono"
              {...register('planSlug')}
            />
            {errors.planSlug && <p className="text-xs text-destructive">{errors.planSlug.message}</p>}
          </div>

          {/* 3. Hạn mức & Dự phòng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="create-quota" className="text-xs font-semibold">
                Hạn mức chính (Quota) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-quota"
                type="number"
                min={1}
                className="text-xs"
                {...register('quota', { valueAsNumber: true })}
              />
              <p className="text-[11px] text-muted-foreground">Số suất cấp chính thức (&ge; 1)</p>
              {errors.quota && <p className="text-xs text-destructive">{errors.quota.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-reserve" className="text-xs font-semibold">
                Suất dự phòng (Reserve)
              </Label>
              <Input
                id="create-reserve"
                type="number"
                min={0}
                className="text-xs"
                {...register('reserve', { valueAsNumber: true })}
              />
              <p className="text-[11px] text-muted-foreground">Cấp bù sau mốc ưu tiên (&ge; 0)</p>
              {errors.reserve && <p className="text-xs text-destructive">{errors.reserve.message}</p>}
            </div>
          </div>

          {/* 4. Thời gian bắt đầu & kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="create-startsAt" className="text-xs font-semibold">
                Bắt đầu lúc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-startsAt"
                type="datetime-local"
                className="text-xs"
                {...register('startsAt')}
              />
              {errors.startsAt && <p className="text-xs text-destructive">{errors.startsAt.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-endsAt" className="text-xs font-semibold">
                Kết thúc lúc (Tùy chọn)
              </Label>
              <Input
                id="create-endsAt"
                type="datetime-local"
                className="text-xs"
                {...register('endsAt')}
              />
              <p className="text-[11px] text-muted-foreground">Để trống = Không giới hạn ngày kết thúc</p>
              {errors.endsAt && <p className="text-xs text-destructive">{errors.endsAt.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending} className="gap-1.5">
              {createMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Tạo chiến dịch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
