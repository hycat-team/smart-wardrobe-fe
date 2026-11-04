import type { AdminGrantBatchRes } from '../types';

export type PlanLifecycle = 'active' | 'expired' | 'unlimited' | 'none';

interface PlanLifecycleInput {
  hasPlan?: boolean;
  expiresAt?: string | null;
}

/**
 * Derives the state of a subscription row.
 *
 * The effective-plan projection clears `expiresAt` when a paid plan has lapsed
 * and the account fell back to the default plan, so `unlimited` here means "no
 * end date", not "never expires". The raw row from /admin/subscriptions keeps
 * the real date, which is what lets the dialog show `expired`.
 */
export function resolvePlanLifecycle({
  hasPlan = true,
  expiresAt,
}: PlanLifecycleInput): PlanLifecycle {
  if (!hasPlan) return 'none';
  if (!expiresAt) return 'unlimited';
  const end = new Date(expiresAt).getTime();
  if (Number.isNaN(end)) return 'unlimited';
  return end > Date.now() ? 'active' : 'expired';
}

export function planLifecycleLabel(state: PlanLifecycle): string {
  switch (state) {
    case 'active':
      return 'Đang áp dụng';
    case 'expired':
      return 'Đã hết hạn';
    case 'unlimited':
      return 'Không thời hạn';
    default:
      return 'Chưa cấp gói';
  }
}

/**
 * Maps the grant API's stable reason codes to operator-facing Vietnamese text.
 * The codes are part of the backend contract (billing_dto.go), so they are the
 * only thing worth branching on; a raw `message` is never shown in their place.
 */
export function grantFailureMessage(reason?: string): string {
  switch (reason) {
    case 'identifier_blank':
      return 'Thiếu định danh tài khoản.';
    case 'user_not_found':
      return 'Không tìm thấy tài khoản cần cấp gói.';
    case 'identifier_ambiguous':
      return 'Định danh khớp nhiều tài khoản, hãy dùng mã người dùng.';
    case 'identifier_too_long':
      return 'Định danh tài khoản quá dài.';
    case 'plan_not_found':
      return 'Không tìm thấy gói cần cấp.';
    case 'plan_slug_too_long':
      return 'Mã gói quá dài.';
    case 'plan_inactive':
      return 'Gói đang tắt, hãy chọn gói khác.';
    case 'target_is_admin':
      return 'Không thể cấp gói cho tài khoản quản trị.';
    case 'user_soft_deleted':
      return 'Tài khoản đã bị xoá.';
    case 'duplicate_in_request':
      return 'Tài khoản xuất hiện trùng trong yêu cầu.';
    case 'duplicate_request':
      return 'Yêu cầu này đã được xử lý trước đó.';
    case 'concurrent_modification':
      return 'Dữ liệu vừa thay đổi, vui lòng thử lại.';
    case 'batch_timeout':
      return 'Yêu cầu quá thời gian xử lý, vui lòng thử lại.';
    case 'grant_failed':
      return 'Cấp gói thất bại, vui lòng thử lại.';
    default:
      return 'Cấp gói thất bại.';
  }
}

export function summarizeGrantResult(result: AdminGrantBatchRes): {
  ok: boolean;
  message: string;
} {
  const first = result.results?.[0];
  if (first && first.status === 'success') {
    return {
      ok: true,
      message: first.planName
        ? `Đã cấp gói ${first.planName}${first.expiresAt ? ` đến ${new Date(first.expiresAt).toLocaleDateString('vi-VN')}` : ''}.`
        : 'Đã cấp gói thành công.',
    };
  }
  // A repeated idempotency key is reported as `skipped`, but the account was
  // granted by the earlier attempt: for the operator that is a success, not an
  // error to retry.
  if (first && first.reason === 'duplicate_request') {
    return { ok: true, message: 'Yêu cầu này đã được xử lý trước đó.' };
  }
  if (first && first.status === 'skipped') {
    return { ok: false, message: grantFailureMessage(first.reason) };
  }
  return { ok: false, message: grantFailureMessage(first?.reason) };
}
