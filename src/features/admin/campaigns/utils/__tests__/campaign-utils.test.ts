import {
  getCampaignStatusConfig,
  formatCampaignStatusLabel,
  CAMPAIGN_STATUS_CONFIG,
} from '../campaign-status';
import {
  formatEligibilityReason,
  getEligibilityStatusConfig,
  ELIGIBILITY_REASON_MAP,
} from '../eligibility-reason';

describe('Campaign Status Utils', () => {
  it('should return correct config for each of the 6 statuses', () => {
    const statuses = ['closed', 'exhausted', 'expired', 'compensation', 'running', 'not_started'] as const;

    statuses.forEach((status) => {
      const config = getCampaignStatusConfig(status);
      expect(config.label).toBe(CAMPAIGN_STATUS_CONFIG[status].label);
      expect(config.badgeClassName).toBeDefined();
    });
  });

  it('should return fallback config for unknown or null status', () => {
    const configUnknown = getCampaignStatusConfig('random_status');
    expect(configUnknown.label).toBe('Không xác định');

    const configNull = getCampaignStatusConfig(null);
    expect(configNull.label).toBe('Không xác định');
  });

  it('should format status label with closedAt when closed', () => {
    const label = formatCampaignStatusLabel('closed', '2026-10-04T12:00:00+07:00');
    expect(label).toBe('Đã đóng');
  });
});

describe('Eligibility Reason Utils', () => {
  it('should format all 12 reason codes correctly', () => {
    const codes = [
      '',
      'campaign_not_configured',
      'campaign_not_started',
      'campaign_sleeping',
      'created_by_admin',
      'already_claimed',
      'already_on_plan',
      'plan_not_settled',
      'outside_window',
      'quota_main',
      'quota_compensation',
      'quota_anomaly',
      'plan_unavailable',
    ];

    codes.forEach((code) => {
      const msg = formatEligibilityReason(code);
      expect(msg).toBe(ELIGIBILITY_REASON_MAP[code]);
    });
  });

  it('should handle undefined or null reason gracefully', () => {
    expect(formatEligibilityReason(undefined)).toBe('');
    expect(formatEligibilityReason(null as unknown as string)).toBe('');
  });

  it('should return custom message for unknown reason code', () => {
    const unknown = formatEligibilityReason('some_new_code');
    expect(unknown).toContain('Lý do: some_new_code');
  });

  it('should return correct customer message for all 6 eligibility statuses', () => {
    expect(getEligibilityStatusConfig('eligible_pending').label).toBe('Đang xử lý');
    expect(getEligibilityStatusConfig('granted').label).toBe('Đã cấp gói');
    expect(getEligibilityStatusConfig('eligible_but_exhausted').label).toBe('Hết suất');
    expect(getEligibilityStatusConfig('not_eligible').label).toBe('Không thỏa điều kiện');
    expect(getEligibilityStatusConfig('already_claimed_other_campaign').label).toBe('Đã nhận ở chiến dịch khác');
    expect(getEligibilityStatusConfig('created_by_admin').label).toBe('Tài khoản do Admin tạo');
  });
});
