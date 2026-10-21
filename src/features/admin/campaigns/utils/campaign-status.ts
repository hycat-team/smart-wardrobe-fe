import { CampaignStatus } from '../types/campaign-admin.types';

export interface CampaignStatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  badgeClassName: string;
  description: string;
}

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, CampaignStatusConfig> = {
  closed: {
    label: 'Đã đóng',
    variant: 'destructive',
    badgeClassName: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 font-medium',
    description: 'Quản trị viên đã đóng cưỡng bức, ngừng cấp toàn bộ lượt mới.',
  },
  exhausted: {
    label: 'Đã hết suất',
    variant: 'secondary',
    badgeClassName: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20 font-medium',
    description: 'Đã đạt trần cứng (hạn mức chính + suất dự phòng).',
  },
  expired: {
    label: 'Đã kết thúc',
    variant: 'outline',
    badgeClassName: 'bg-muted text-muted-foreground border-border font-medium',
    description: 'Đã qua thời điểm kết thúc quy định.',
  },
  compensation: {
    label: 'Chỉ còn suất dự phòng',
    variant: 'warning',
    badgeClassName: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium',
    description: 'Đã hết hạn mức chính và chốt mốc ưu tiên, chỉ còn cấp từ suất dự phòng.',
  },
  running: {
    label: 'Đang chạy',
    variant: 'success',
    badgeClassName: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium',
    description: 'Chiến dịch đang mở, còn hạn mức chính.',
  },
  not_started: {
    label: 'Sắp mở',
    variant: 'info',
    badgeClassName: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-medium',
    description: 'Chưa tới thời điểm bắt đầu.',
  },
};

export const UNKNOWN_STATUS_CONFIG: CampaignStatusConfig = {
  label: 'Không xác định',
  variant: 'outline',
  badgeClassName: 'bg-zinc-500/10 text-zinc-600 border-zinc-300 font-medium',
  description: 'Trạng thái chưa được định nghĩa trong hệ thống.',
};

export function getCampaignStatusConfig(status?: string | null): CampaignStatusConfig {
  if (!status) return UNKNOWN_STATUS_CONFIG;
  return CAMPAIGN_STATUS_CONFIG[status as CampaignStatus] || UNKNOWN_STATUS_CONFIG;
}

export function formatCampaignStatusLabel(status: CampaignStatus | string, closedAt?: string | null): string {
  const config = getCampaignStatusConfig(status);
  if (status === 'closed' && closedAt) {
    return `${config.label}`;
  }
  return config.label;
}
