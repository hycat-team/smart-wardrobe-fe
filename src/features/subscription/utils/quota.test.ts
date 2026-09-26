import { formatQuotaItem, isUnlimitedQuota } from './quota';

describe('quota utilities', () => {
  describe('isUnlimitedQuota', () => {
    it('returns true for 0, undefined, or null', () => {
      expect(isUnlimitedQuota(0)).toBe(true);
      expect(isUnlimitedQuota(undefined)).toBe(true);
      expect(isUnlimitedQuota(null)).toBe(true);
    });

    it('returns false for positive limits', () => {
      expect(isUnlimitedQuota(100)).toBe(false);
      expect(isUnlimitedQuota(1)).toBe(false);
    });
  });

  describe('formatQuotaItem', () => {
    it('formats normal finite quota correctly', () => {
      const res = formatQuotaItem(128, 500, 'MÓN');
      expect(res.current).toBe(128);
      expect(res.max).toBe(500);
      expect(res.isUnlimited).toBe(false);
      expect(res.text).toBe('128 / 500 MÓN');
      expect(res.percentage).toBeCloseTo(25.6);
    });

    it('handles unlimited quota (max = 0) with infinity symbol and 0% progress', () => {
      const res = formatQuotaItem(42, 0, 'BỘ');
      expect(res.current).toBe(42);
      expect(res.max).toBe(0);
      expect(res.isUnlimited).toBe(true);
      expect(res.text).toBe('42 / ∞ BỘ');
      expect(res.percentage).toBe(0);
    });

    it('handles zero current items properly without converting 0 to falsy', () => {
      const res = formatQuotaItem(0, 100, 'MÓN');
      expect(res.current).toBe(0);
      expect(res.max).toBe(100);
      expect(res.isUnlimited).toBe(false);
      expect(res.text).toBe('0 / 100 MÓN');
      expect(res.percentage).toBe(0);
    });

    it('handles nullish current value by defaulting to 0', () => {
      const res = formatQuotaItem(null, 50);
      expect(res.current).toBe(0);
      expect(res.max).toBe(50);
      expect(res.text).toBe('0 / 50');
      expect(res.percentage).toBe(0);
    });

    it('clamps percentage to 100% when current exceeds max', () => {
      const res = formatQuotaItem(600, 500, 'MÓN');
      expect(res.percentage).toBe(100);
      expect(res.text).toBe('600 / 500 MÓN');
    });
  });
});
