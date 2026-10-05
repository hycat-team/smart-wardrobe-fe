import { EligibilityReasonCode, EligibilityStatus } from '../types/campaign-admin.types';

export const ELIGIBILITY_REASON_MAP: Record<string, string> = {
  '': 'Đang trong quá trình xử lý hoặc đã hoàn tất',
  campaign_not_configured: 'Chưa có chiến dịch nào đang chạy',
  campaign_not_started: 'Chiến dịch chưa bắt đầu',
  campaign_sleeping: 'Chiến dịch đã kết thúc hoặc đã bị đóng',
  created_by_admin: 'Tài khoản do quản trị viên tạo nên không áp dụng chiến dịch',
  already_claimed: 'Tài khoản đã được tặng gói rồi',
  already_on_plan: 'Bạn đang có gói này rồi và còn hạn',
  plan_not_settled: 'Gói cũ vừa hạ cấp chưa xử lý xong, vui lòng thử lại sau ít phút',
  outside_window: 'Tài khoản tạo ngoài thời gian diễn ra chiến dịch',
  quota_main: 'Chiến dịch đã hết suất chính',
  quota_compensation: 'Chiến dịch đã hết suất dự phòng (đạt trần tối đa)',
  quota_anomaly: 'Hệ thống đang kiểm tra tính toàn vẹn dữ liệu, thử lại sau',
  plan_unavailable: 'Gói cước tặng đang được cấu hình lại',
};

export const DEFAULT_UNKNOWN_REASON = 'Không đủ điều kiện nhận ưu đãi từ chiến dịch này';

export function formatEligibilityReason(reason?: EligibilityReasonCode | string): string {
  if (reason === undefined || reason === null) return '';
  return ELIGIBILITY_REASON_MAP[reason] || (reason ? `Lý do: ${reason}` : DEFAULT_UNKNOWN_REASON);
}

export interface EligibilityStatusConfig {
  label: string;
  badgeClassName: string;
  customerMessage: (expiresAt?: string) => string;
}

export const ELIGIBILITY_STATUS_CONFIG: Record<EligibilityStatus, EligibilityStatusConfig> = {
  granted: {
    label: 'Đã cấp gói',
    badgeClassName: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium',
    customerMessage: (expiresAt) =>
      expiresAt
        ? `Tài khoản đã được tặng gói, hết hạn ngày ${new Date(expiresAt).toLocaleDateString('vi-VN')}.`
        : 'Tài khoản đã được tặng gói thành công.',
  },
  eligible_pending: {
    label: 'Đang xử lý',
    badgeClassName: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium animate-pulse',
    customerMessage: () => 'Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút.',
  },
  eligible_but_exhausted: {
    label: 'Hết suất',
    badgeClassName: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20 font-medium',
    customerMessage: () => 'Tài khoản đủ điều kiện nhưng chiến dịch đã hết suất.',
  },
  not_eligible: {
    label: 'Không thỏa điều kiện',
    badgeClassName: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 font-medium',
    customerMessage: () => 'Tài khoản không đủ điều kiện tham gia chiến dịch này.',
  },
  already_claimed_other_campaign: {
    label: 'Đã nhận ở chiến dịch khác',
    badgeClassName: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-medium',
    customerMessage: () => 'Bạn đã được tặng gói ở một chiến dịch trước đó.',
  },
  created_by_admin: {
    label: 'Tài khoản do Admin tạo',
    badgeClassName: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-medium',
    customerMessage: () => 'Tài khoản do quản trị viên tạo thủ công nên không thuộc diện tự động tặng gói.',
  },
};

export function getEligibilityStatusConfig(status?: string | null): EligibilityStatusConfig {
  if (!status || !ELIGIBILITY_STATUS_CONFIG[status as EligibilityStatus]) {
    return {
      label: status || 'Chưa xác định',
      badgeClassName: 'bg-muted text-muted-foreground border-border font-medium',
      customerMessage: () => 'Chưa xác định được điều kiện.',
    };
  }
  return ELIGIBILITY_STATUS_CONFIG[status as EligibilityStatus];
}
