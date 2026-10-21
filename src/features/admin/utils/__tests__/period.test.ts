import {
  formatPeriodLabel,
  getDefaultPeriod,
  getPeriodDateRange,
  isAtCurrentPeriod,
  navigatePeriod,
  parsePeriodFromParams,
  todayVN,
  vnDate,
} from '../period';

describe('Admin Period Utilities', () => {
  // Cố định thời điểm tham chiếu: Thứ Ba, 20/10/2026
  const refDate = new Date('2026-10-20T10:00:00+07:00');

  describe('vnDate & todayVN', () => {
    it('formats date in Asia/Ho_Chi_Minh timezone as YYYY-MM-DD', () => {
      expect(vnDate(refDate)).toBe('2026-10-20');
      expect(todayVN(refDate)).toBe('2026-10-20');
    });
  });

  describe('getDefaultPeriod', () => {
    it('defaults to "Tháng này" (this_month) from 01 to today', () => {
      const def = getDefaultPeriod(refDate);
      expect(def.preset).toBe('this_month');
      expect(def.fromDate).toBe('2026-10-01');
      expect(def.toDate).toBe('2026-10-20');
    });
  });

  describe('getPeriodDateRange for presets', () => {
    it('calculates "today" preset correctly', () => {
      const range = getPeriodDateRange('today', refDate);
      expect(range.fromDate).toBe('2026-10-20');
      expect(range.toDate).toBe('2026-10-20');
    });

    it('calculates "this_week" starting on Monday (Thứ Hai) to today', () => {
      // 20/10/2026 là Thứ Ba -> Thứ Hai cùng tuần là 19/10/2026
      const range = getPeriodDateRange('this_week', refDate);
      expect(range.fromDate).toBe('2026-10-19');
      expect(range.toDate).toBe('2026-10-20');
    });

    it('calculates "this_month" from day 01 to today', () => {
      const range = getPeriodDateRange('this_month', refDate);
      expect(range.fromDate).toBe('2026-10-01');
      expect(range.toDate).toBe('2026-10-20');
    });

    it('calculates "this_year" from 01/01 to today', () => {
      const range = getPeriodDateRange('this_year', refDate);
      expect(range.fromDate).toBe('2026-01-01');
      expect(range.toDate).toBe('2026-10-20');
    });
  });

  describe('navigatePeriod - Stepping ◀ (Prev) into full past units', () => {
    it('steps back 1 day for "today"', () => {
      const res = navigatePeriod(
        'prev',
        { preset: 'today', fromDate: '2026-10-20', toDate: '2026-10-20' },
        refDate
      );
      expect(res.fromDate).toBe('2026-10-19');
      expect(res.toDate).toBe('2026-10-19');
      expect(res.isAtCurrent).toBe(false);
    });

    it('steps back 1 full week (Mon-Sun) for "this_week"', () => {
      const res = navigatePeriod(
        'prev',
        { preset: 'this_week', fromDate: '2026-10-19', toDate: '2026-10-20' },
        refDate
      );
      // Tuần trước là 12/10 (Thứ Hai) đến 18/10 (Chủ Nhật)
      expect(res.fromDate).toBe('2026-10-12');
      expect(res.toDate).toBe('2026-10-18');
      expect(res.isAtCurrent).toBe(false);
    });

    it('steps back 1 full month (01 to last day) for "this_month"', () => {
      const res = navigatePeriod(
        'prev',
        { preset: 'this_month', fromDate: '2026-10-01', toDate: '2026-10-20' },
        refDate
      );
      // Tháng trước là tháng 9 (30 ngày: 01/09 -> 30/09)
      expect(res.fromDate).toBe('2026-09-01');
      expect(res.toDate).toBe('2026-09-30');
      expect(res.isAtCurrent).toBe(false);
    });

    it('steps back 1 full year (01/01 to 31/12) for "this_year"', () => {
      const res = navigatePeriod(
        'prev',
        { preset: 'this_year', fromDate: '2026-01-01', toDate: '2026-10-20' },
        refDate
      );
      expect(res.fromDate).toBe('2025-01-01');
      expect(res.toDate).toBe('2025-12-31');
      expect(res.isAtCurrent).toBe(false);
    });

    it('steps back exact duration for "custom" range', () => {
      // 5 ngày: 05/10 đến 09/10 (5 ngày)
      const res = navigatePeriod(
        'prev',
        { preset: 'custom', fromDate: '2026-10-05', toDate: '2026-10-09' },
        refDate
      );
      expect(res.fromDate).toBe('2026-09-30');
      expect(res.toDate).toBe('2026-10-04');
      expect(res.isAtCurrent).toBe(false);
    });
  });

  describe('navigatePeriod - Stepping ▶ (Next) and Clamping to Today', () => {
    it('steps forward 1 day and clamps to today', () => {
      const res = navigatePeriod(
        'next',
        { preset: 'today', fromDate: '2026-10-19', toDate: '2026-10-19' },
        refDate
      );
      expect(res.fromDate).toBe('2026-10-20');
      expect(res.toDate).toBe('2026-10-20');
      expect(res.isAtCurrent).toBe(true);
    });

    it('steps forward to current week and clamps toDate to today', () => {
      const res = navigatePeriod(
        'next',
        { preset: 'this_week', fromDate: '2026-10-12', toDate: '2026-10-18' },
        refDate
      );
      expect(res.fromDate).toBe('2026-10-19');
      expect(res.toDate).toBe('2026-10-20'); // Kẹp không lấy sang tương lai
      expect(res.isAtCurrent).toBe(true);
    });

    it('steps forward to current month and clamps toDate to today', () => {
      const res = navigatePeriod(
        'next',
        { preset: 'this_month', fromDate: '2026-09-01', toDate: '2026-09-30' },
        refDate
      );
      expect(res.fromDate).toBe('2026-10-01');
      expect(res.toDate).toBe('2026-10-20'); // Kẹp không lấy sang 31/10
      expect(res.isAtCurrent).toBe(true);
    });

    it('steps forward to current year and clamps toDate to today', () => {
      const res = navigatePeriod(
        'next',
        { preset: 'this_year', fromDate: '2025-01-01', toDate: '2025-12-31' },
        refDate
      );
      expect(res.fromDate).toBe('2026-01-01');
      expect(res.toDate).toBe('2026-10-20'); // Kẹp không lấy sang 31/12
      expect(res.isAtCurrent).toBe(true);
    });

    it('steps forward for custom range and clamps toDate <= today', () => {
      // 5 ngày: 15/10 đến 19/10 -> dịch 5 ngày sẽ là 20/10 đến 24/10 -> kẹp toDate = 20/10
      const res = navigatePeriod(
        'next',
        { preset: 'custom', fromDate: '2026-10-15', toDate: '2026-10-19' },
        refDate
      );
      expect(res.toDate).toBe('2026-10-20');
      expect(res.isAtCurrent).toBe(true);
    });
  });

  describe('isAtCurrentPeriod', () => {
    it('returns true when toDate is today', () => {
      expect(isAtCurrentPeriod('this_month', '2026-10-20', refDate)).toBe(true);
      expect(isAtCurrentPeriod('today', '2026-10-20', refDate)).toBe(true);
      expect(isAtCurrentPeriod('custom', '2026-10-20', refDate)).toBe(true);
    });

    it('returns false when toDate is in the past', () => {
      expect(isAtCurrentPeriod('this_month', '2026-09-30', refDate)).toBe(false);
      expect(isAtCurrentPeriod('this_week', '2026-10-18', refDate)).toBe(false);
      expect(isAtCurrentPeriod('custom', '2026-10-15', refDate)).toBe(false);
    });
  });

  describe('formatPeriodLabel', () => {
    it('formats month label accurately from submitted dates', () => {
      const label = formatPeriodLabel('this_month', '2026-10-01', '2026-10-20', refDate);
      expect(label).toBe('Tháng 10/2026 · 01/10 – 20/10/2026');
    });

    it('formats past month label accurately', () => {
      const label = formatPeriodLabel('this_month', '2026-09-01', '2026-09-30', refDate);
      expect(label).toBe('Tháng 09/2026 · 01/09 – 30/09/2026');
    });

    it('formats week label accurately', () => {
      const label = formatPeriodLabel('this_week', '2026-10-19', '2026-10-20', refDate);
      expect(label).toContain('Tuần');
      expect(label).toContain('19/10 – 20/10/2026');
    });

    it('formats year label accurately', () => {
      const label = formatPeriodLabel('this_year', '2026-01-01', '2026-10-20', refDate);
      expect(label).toBe('Năm 2026 · 01/01 – 20/10/2026');
    });

    it('formats today label accurately', () => {
      const label = formatPeriodLabel('today', '2026-10-20', '2026-10-20', refDate);
      expect(label).toBe('Hôm nay · 20/10/2026');
    });

    it('formats custom range label accurately', () => {
      const label = formatPeriodLabel('custom', '2026-10-05', '2026-10-15', refDate);
      expect(label).toBe('Tuỳ chọn · 05/10 – 15/10/2026');
    });
  });

  describe('parsePeriodFromParams', () => {
    it('defaults to "this_month" when params are empty', () => {
      const res = parsePeriodFromParams({}, refDate);
      expect(res.preset).toBe('this_month');
      expect(res.fromDate).toBe('2026-10-01');
      expect(res.toDate).toBe('2026-10-20');
    });

    it('parses valid preset and dates', () => {
      const res = parsePeriodFromParams(
        { preset: 'this_week', fromDate: '2026-10-19', toDate: '2026-10-20' },
        refDate
      );
      expect(res.preset).toBe('this_week');
      expect(res.fromDate).toBe('2026-10-19');
      expect(res.toDate).toBe('2026-10-20');
    });

    it('infers preset when preset param is missing but dates are provided', () => {
      const res = parsePeriodFromParams(
        { fromDate: '2026-10-01', toDate: '2026-10-20' },
        refDate
      );
      expect(res.preset).toBe('this_month');
    });

    it('falls back to custom if dates do not match standard preset', () => {
      const res = parsePeriodFromParams(
        { fromDate: '2026-10-05', toDate: '2026-10-15' },
        refDate
      );
      expect(res.preset).toBe('custom');
      expect(res.fromDate).toBe('2026-10-05');
      expect(res.toDate).toBe('2026-10-15');
    });
  });
});
