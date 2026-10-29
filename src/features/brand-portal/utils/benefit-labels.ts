export function isVoucherBenefitType(type?: string | null): boolean {
  return (type || '').toLowerCase() !== 'feature_access';
}

export function benefitTypeLabel(type?: string | null): string {
  return isVoucherBenefitType(type) ? 'Voucher' : 'Quyền lợi';
}

export function unlockTypeLabel(type?: string | null): string {
  switch ((type || '').toLowerCase()) {
    case 'point_redemption':
      return 'Đổi bằng điểm';
    case 'tier_privilege':
      return 'Theo hạng thành viên';
    case 'manual_grant':
      return 'Tặng thủ công';
    default:
      return type || '';
  }
}

export function featureAccessUnlockTypes(): string[] {
  return ['tier_privilege', 'manual_grant'];
}
