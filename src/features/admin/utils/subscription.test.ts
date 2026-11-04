import {
  grantFailureMessage,
  planLifecycleLabel,
  resolvePlanLifecycle,
  summarizeGrantResult,
} from './subscription';
import type { AdminGrantBatchRes } from '../types';

const DAY = 24 * 60 * 60 * 1000;

describe('resolvePlanLifecycle', () => {
  it('reports no plan when the account has none', () => {
    expect(resolvePlanLifecycle({ hasPlan: false })).toBe('none');
  });

  it('reports unlimited when the row has no end date', () => {
    expect(resolvePlanLifecycle({ hasPlan: true, expiresAt: null })).toBe('unlimited');
  });

  it('separates a future expiry from a past one', () => {
    const future = new Date(Date.now() + DAY).toISOString();
    const past = new Date(Date.now() - DAY).toISOString();
    expect(resolvePlanLifecycle({ expiresAt: future })).toBe('active');
    expect(resolvePlanLifecycle({ expiresAt: past })).toBe('expired');
  });

  it('treats an unparsable date as unlimited instead of expiring the plan', () => {
    expect(resolvePlanLifecycle({ expiresAt: 'not-a-date' })).toBe('unlimited');
  });
});

describe('planLifecycleLabel', () => {
  it('uses operator-facing Vietnamese labels', () => {
    expect(planLifecycleLabel('active')).toBe('Đang áp dụng');
    expect(planLifecycleLabel('expired')).toBe('Đã hết hạn');
    expect(planLifecycleLabel('unlimited')).toBe('Không thời hạn');
    expect(planLifecycleLabel('none')).toBe('Chưa cấp gói');
  });
});

describe('grantFailureMessage', () => {
  it('maps the stable backend reason codes', () => {
    expect(grantFailureMessage('plan_inactive')).toContain('tắt');
    expect(grantFailureMessage('target_is_admin')).toContain('quản trị');
    expect(grantFailureMessage('duplicate_request')).toContain('trước đó');
  });

  it('falls back to a generic message for an unknown code', () => {
    expect(grantFailureMessage('something_new')).toBe('Cấp gói thất bại.');
    expect(grantFailureMessage(undefined)).toBe('Cấp gói thất bại.');
  });
});

describe('summarizeGrantResult', () => {
  const base: AdminGrantBatchRes = {
    total: 1,
    succeeded: 1,
    skipped: 0,
    failed: 0,
    results: [
      {
        index: 0,
        userIdentifier: 'user-1',
        planSlug: 'premium-monthly',
        status: 'success',
        planName: 'Premium Monthly',
        expiresAt: '2026-12-01T00:00:00Z',
      },
    ],
  };

  it('reports success with the granted plan name', () => {
    const summary = summarizeGrantResult(base);
    expect(summary.ok).toBe(true);
    expect(summary.message).toContain('Premium Monthly');
  });

  it('reports the mapped reason for a skipped item', () => {
    const summary = summarizeGrantResult({
      ...base,
      succeeded: 0,
      skipped: 1,
      results: [{ ...base.results[0], status: 'skipped', reason: 'plan_inactive' }],
    });
    expect(summary.ok).toBe(false);
    expect(summary.message).toContain('tắt');
  });

  it('treats a repeated idempotency key as already applied', () => {
    const summary = summarizeGrantResult({
      ...base,
      succeeded: 0,
      skipped: 1,
      results: [{ ...base.results[0], status: 'skipped', reason: 'duplicate_request' }],
    });
    expect(summary.ok).toBe(true);
    expect(summary.message).toContain('trước đó');
  });

  it('never reports success for an empty result set', () => {
    const summary = summarizeGrantResult({ ...base, results: [] });
    expect(summary.ok).toBe(false);
  });
});
