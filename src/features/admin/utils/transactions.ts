import type {
  TransactionStatus,
  TransactionUserBrief,
} from '../types/transactions';

export interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}

export const TRANSACTION_STATUS_MAP: Record<TransactionStatus, StatusConfig> = {
  pending: {
    label: 'Chờ thanh toán',
    variant: 'secondary',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  },
  success: {
    label: 'Thành công',
    variant: 'default',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  },
  failed_legacy: {
    label: 'Thất bại',
    variant: 'destructive',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  creating: {
    label: 'Đang tạo link',
    variant: 'secondary',
    className: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
  },
  reconciliation_required: {
    label: 'Cần đối soát',
    variant: 'secondary',
    className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 font-semibold',
  },
  reconciling: {
    label: 'Đang đối soát',
    variant: 'secondary',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 animate-pulse',
  },
  creation_failed: {
    label: 'Tạo link thất bại',
    variant: 'destructive',
    className: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
  },
  cancelled: {
    label: 'Đã huỷ',
    variant: 'outline',
    className: 'text-muted-foreground border-border bg-muted/40',
  },
  expired: {
    label: 'Hết hạn',
    variant: 'outline',
    className: 'text-muted-foreground border-border/80 bg-muted/20',
  },
  investigation_required: {
    label: 'Cần điều tra',
    variant: 'destructive',
    className: 'bg-destructive/20 text-destructive border-destructive font-semibold',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    variant: 'secondary',
    className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
  },
  unknown: {
    label: 'Không xác định',
    variant: 'outline',
    className: 'text-muted-foreground border-dashed border-border',
  },
};

export const getTransactionStatusConfig = (status?: string | null): StatusConfig => {
  if (!status) return TRANSACTION_STATUS_MAP.unknown;
  return (
    TRANSACTION_STATUS_MAP[status as TransactionStatus] ?? {
      label: status,
      variant: 'outline',
      className: 'text-muted-foreground border-border',
    }
  );
};

export const TRANSACTION_STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'success', label: 'Thành công' },
  { value: 'failed_legacy', label: 'Thất bại' },
  { value: 'creating', label: 'Đang tạo link' },
  { value: 'reconciliation_required', label: 'Cần đối soát' },
  { value: 'reconciling', label: 'Đang đối soát' },
  { value: 'creation_failed', label: 'Tạo link thất bại' },
  { value: 'cancelled', label: 'Đã huỷ' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'investigation_required', label: 'Cần điều tra' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
];

export const getTransactionTypeLabel = (type?: string | null): string => {
  if (type === 'direct_purchase') return 'Mua gói';
  if (type === 'wallet_topup') return 'Nạp ví';
  return type || '—';
};

/**
 * Tên hiển thị của người mua trong chi tiết giao dịch.
 *
 * Thứ tự ưu tiên: họ + tên → username → email → null. Trả `null` (không phải
 * chuỗi rỗng) để chỗ gọi tự quyết định hiển thị UUID dự phòng, thay vì render
 * một dòng trắng trông như lỗi tải dữ liệu.
 */
export const getUserDisplayName = (
  user?: TransactionUserBrief | null,
): string | null => {
  if (!user) return null;
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  if (user.email) return user.email;
  return null;
};

const PLAN_KIND_LABELS: Record<number, string> = {
  0: 'Miễn phí',
  1: 'Có thời hạn',
  2: 'Vĩnh viễn',
};

/**
 * Nhãn loại gói. `planKind` là số nguyên trong API (`plankind.PlanKind`), nên
 * giá trị lạ trả "—" thay vì rơi vào khoảng trắng.
 */
export const getPlanKindLabel = (planKind?: number | null): string => {
  if (planKind === undefined || planKind === null) return '—';
  return PLAN_KIND_LABELS[planKind] ?? '—';
};

export { formatVND } from './dashboard';
