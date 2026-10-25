import { benefitTypeLabel, isVoucherBenefitType, unlockTypeLabel } from './benefit-labels';

describe('benefit labels', () => {
  it('labels feature access as a benefit and every other type as voucher', () => {
    expect(benefitTypeLabel('feature_access')).toBe('Quyền lợi');
    expect(benefitTypeLabel('voucher')).toBe('Voucher');
    expect(benefitTypeLabel('discount')).toBe('Voucher');
    expect(benefitTypeLabel('gift')).toBe('Voucher');
    expect(benefitTypeLabel('free_shipping')).toBe('Voucher');
    expect(benefitTypeLabel('early_access')).toBe('Voucher');
    expect(benefitTypeLabel(undefined)).toBe('Voucher');
  });

  it('classifies feature access separately from voucher types', () => {
    expect(isVoucherBenefitType('feature_access')).toBe(false);
    expect(isVoucherBenefitType('voucher')).toBe(true);
  });

  it('labels unlock types consistently', () => {
    expect(unlockTypeLabel('point_redemption')).toBe('Đổi bằng điểm');
    expect(unlockTypeLabel('tier_privilege')).toBe('Theo hạng thành viên');
    expect(unlockTypeLabel('manual_grant')).toBe('Tặng thủ công');
  });
});
