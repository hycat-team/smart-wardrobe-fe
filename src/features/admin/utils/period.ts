import type {
  NavigationDirection,
  NavigationResult,
  PeriodLabelInfo,
  PeriodPreset,
  PeriodRange,
} from '../types/period';

/**
 * Sinh chuỗi YYYY-MM-DD theo múi giờ Việt Nam (Asia/Ho_Chi_Minh).
 */
export const vnDate = (d: Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);

/**
 * Lấy ngày hôm nay theo giờ Việt Nam.
 */
export const todayVN = (now = new Date()): string => vnDate(now);

/**
 * Phân tích chuỗi YYYY-MM-DD thành số nguyên { year, month, day }.
 */
export const parseVNDateParts = (
  dateStr: string
): { year: number; month: number; day: number } => {
  const parts = dateStr.split('-').map((v) => Number.parseInt(v, 10));
  return {
    year: parts[0] || 2026,
    month: parts[1] || 1,
    day: parts[2] || 1,
  };
};

/**
 * Tạo đối tượng Date tại mốc 12:00 trưa an toàn để tránh lệch múi giờ hay đổi giờ.
 */
export const createDateVN = (
  year: number,
  month: number,
  day: number
): Date => new Date(year, month - 1, day, 12, 0, 0);

/**
 * Lấy ngày 01 của tháng hiện tại theo giờ Việt Nam.
 */
export const startOfMonthVN = (now = new Date()): string =>
  todayVN(now).slice(0, 8) + '01';

/**
 * Lấy ngày Thứ Hai của tuần hiện tại theo giờ Việt Nam (tuần Thứ 2 -> CN).
 */
export const startOfWeekVN = (now = new Date()): string => {
  const todayStr = todayVN(now);
  const { year, month, day } = parseVNDateParts(todayStr);
  const d = createDateVN(year, month, day);
  const dayOfWeek = d.getDay(); // 0: CN, 1: T2, ..., 6: T7
  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const mondayDate = new Date(year, month - 1, day - (isoDay - 1), 12, 0, 0);
  return vnDate(mondayDate);
};

/**
 * Lấy ngày 01/01 của năm hiện tại theo giờ Việt Nam.
 */
export const startOfYearVN = (now = new Date()): string =>
  todayVN(now).slice(0, 4) + '-01-01';

/**
 * Lùi N ngày từ mốc tham chiếu theo giờ Việt Nam.
 */
export const daysAgoVN = (n: number, now = new Date()): string => {
  const { year, month, day } = parseVNDateParts(todayVN(now));
  const d = new Date(year, month - 1, day - n, 12, 0, 0);
  return vnDate(d);
};

/**
 * Tính số tuần ISO (ISO-8601 week number).
 */
export const getISOWeekNumber = (d: Date): number => {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  // Thứ 5 trong tuần quyết định năm ISO
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

/**
 * Trả về khoảng ngày chuẩn cho một preset tại thời điểm tham chiếu now.
 */
export const getPeriodDateRange = (
  preset: PeriodPreset,
  now = new Date()
): { fromDate: string; toDate: string } => {
  const today = todayVN(now);
  switch (preset) {
    case 'today':
      return { fromDate: today, toDate: today };
    case 'this_week':
      return { fromDate: startOfWeekVN(now), toDate: today };
    case 'this_month':
      return { fromDate: startOfMonthVN(now), toDate: today };
    case 'this_year':
      return { fromDate: startOfYearVN(now), toDate: today };
    case 'custom':
      return { fromDate: startOfMonthVN(now), toDate: today };
  }
};

/**
 * Lấy kỳ mặc định khi không có tham số query (mặc định là 'this_month').
 */
export const getDefaultPeriod = (now = new Date()): PeriodRange => ({
  preset: 'this_month',
  ...getPeriodDateRange('this_month', now),
});

/**
 * Kiểm tra xem toDate đã chạm mốc hôm nay hay chưa (để vô hiệu hóa nút ▶).
 */
export const isAtCurrentPeriod = (
  _preset: PeriodPreset,
  toDate: string,
  now = new Date()
): boolean => {
  const today = todayVN(now);
  return toDate >= today;
};

/**
 * Tính toán mốc ngày mới khi người dùng bấm mũi tên ◀ (prev) hoặc ▶ (next).
 * Kỳ quá khứ luôn là đơn vị đầy đủ; khi tiến về hiện tại thì kẹp toDate = hôm nay.
 */
export const navigatePeriod = (
  direction: NavigationDirection,
  current: { preset: PeriodPreset; fromDate: string; toDate: string },
  now = new Date()
): NavigationResult => {
  const today = todayVN(now);
  const { preset, fromDate, toDate } = current;

  if (preset === 'today') {
    const { year, month, day } = parseVNDateParts(fromDate);
    const delta = direction === 'prev' ? -1 : 1;
    const targetDate = new Date(year, month - 1, day + delta, 12, 0, 0);
    let targetStr = vnDate(targetDate);
    if (direction === 'next' && targetStr > today) {
      targetStr = today;
    }
    return {
      preset: 'today',
      fromDate: targetStr,
      toDate: targetStr,
      isAtCurrent: targetStr >= today,
    };
  }

  if (preset === 'this_week') {
    const fromParts = parseVNDateParts(fromDate);
    if (direction === 'prev') {
      const prevMon = new Date(fromParts.year, fromParts.month - 1, fromParts.day - 7, 12, 0, 0);
      const prevSun = new Date(fromParts.year, fromParts.month - 1, fromParts.day - 1, 12, 0, 0);
      return {
        preset: 'this_week',
        fromDate: vnDate(prevMon),
        toDate: vnDate(prevSun),
        isAtCurrent: false,
      };
    }
    // direction === 'next'
    const nextMon = new Date(fromParts.year, fromParts.month - 1, fromParts.day + 7, 12, 0, 0);
    const nextSun = new Date(fromParts.year, fromParts.month - 1, fromParts.day + 13, 12, 0, 0);
    const nextMonStr = vnDate(nextMon);
    let nextSunStr = vnDate(nextSun);
    const isAtCurrent = nextSunStr >= today;
    if (isAtCurrent) {
      nextSunStr = today;
    }
    return {
      preset: 'this_week',
      fromDate: nextMonStr,
      toDate: nextSunStr,
      isAtCurrent,
    };
  }

  if (preset === 'this_month') {
    const fromParts = parseVNDateParts(fromDate);
    if (direction === 'prev') {
      // Tháng trước
      const prevMonthRef = new Date(fromParts.year, fromParts.month - 2, 1, 12, 0, 0);
      const pYear = prevMonthRef.getFullYear();
      const pMonth = prevMonthRef.getMonth() + 1;
      const lastDay = new Date(pYear, pMonth, 0, 12, 0, 0).getDate();
      const prevFrom = vnDate(new Date(pYear, pMonth - 1, 1, 12, 0, 0));
      const prevTo = vnDate(new Date(pYear, pMonth - 1, lastDay, 12, 0, 0));
      return {
        preset: 'this_month',
        fromDate: prevFrom,
        toDate: prevTo,
        isAtCurrent: false,
      };
    }
    // direction === 'next'
    const nextMonthRef = new Date(fromParts.year, fromParts.month, 1, 12, 0, 0);
    const nYear = nextMonthRef.getFullYear();
    const nMonth = nextMonthRef.getMonth() + 1;
    const nextFrom = vnDate(new Date(nYear, nMonth - 1, 1, 12, 0, 0));
    const lastDay = new Date(nYear, nMonth, 0, 12, 0, 0).getDate();
    let nextTo = vnDate(new Date(nYear, nMonth - 1, lastDay, 12, 0, 0));
    const isAtCurrent = nextTo >= today;
    if (isAtCurrent) {
      nextTo = today;
    }
    return {
      preset: 'this_month',
      fromDate: nextFrom,
      toDate: nextTo,
      isAtCurrent,
    };
  }

  if (preset === 'this_year') {
    const fromParts = parseVNDateParts(fromDate);
    if (direction === 'prev') {
      const pYear = fromParts.year - 1;
      return {
        preset: 'this_year',
        fromDate: `${pYear}-01-01`,
        toDate: `${pYear}-12-31`,
        isAtCurrent: false,
      };
    }
    // direction === 'next'
    const nYear = fromParts.year + 1;
    const nFrom = `${nYear}-01-01`;
    let nTo = `${nYear}-12-31`;
    const isAtCurrent = nTo >= today;
    if (isAtCurrent) {
      nTo = today;
    }
    return {
      preset: 'this_year',
      fromDate: nFrom,
      toDate: nTo,
      isAtCurrent,
    };
  }

  // preset === 'custom'
  const fromParts = parseVNDateParts(fromDate);
  const toParts = parseVNDateParts(toDate);
  const fromD = createDateVN(fromParts.year, fromParts.month, fromParts.day);
  const toD = createDateVN(toParts.year, toParts.month, toParts.day);
  const diffDays = Math.round((toD.getTime() - fromD.getTime()) / 86400000) + 1;

  if (direction === 'prev') {
    const prevFromD = new Date(fromD.getTime() - diffDays * 86400000);
    const prevToD = new Date(toD.getTime() - diffDays * 86400000);
    return {
      preset: 'custom',
      fromDate: vnDate(prevFromD),
      toDate: vnDate(prevToD),
      isAtCurrent: false,
    };
  }

  // direction === 'next'
  const nextFromD = new Date(fromD.getTime() + diffDays * 86400000);
  const nextToD = new Date(toD.getTime() + diffDays * 86400000);
  let nextToStr = vnDate(nextToD);
  let nextFromStr = vnDate(nextFromD);

  const isAtCurrent = nextToStr >= today;
  if (isAtCurrent) {
    nextToStr = today;
    const { year: ty, month: tm, day: td } = parseVNDateParts(today);
    const clampedToday = createDateVN(ty, tm, td);
    nextFromStr = vnDate(
      new Date(clampedToday.getTime() - (diffDays - 1) * 86400000)
    );
  }

  return {
    preset: 'custom',
    fromDate: nextFromStr,
    toDate: nextToStr,
    isAtCurrent,
  };
};

/**
 * Định dạng nhãn hiển thị kỳ lấy trực tiếp từ các mốc ngày đã gửi.
 */
export const formatPeriodLabelInfo = (
  preset: PeriodPreset,
  fromDate: string,
  toDate: string,
  now = new Date()
): PeriodLabelInfo => {
  const formatDMY = (dStr: string) => {
    const { year, month, day } = parseVNDateParts(dStr);
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  };

  const formatDM = (dStr: string) => {
    const { month, day } = parseVNDateParts(dStr);
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}`;
  };

  const fromParts = parseVNDateParts(fromDate);
  const today = todayVN(now);

  if (preset === 'today') {
    const isToday = toDate === today;
    const unitTitle = isToday ? 'Hôm nay' : formatDMY(toDate);
    const dateRangeText = formatDMY(toDate);
    const formattedText = isToday
      ? `Hôm nay · ${dateRangeText}`
      : dateRangeText;
    return { unitTitle, dateRangeText, formattedText };
  }

  if (preset === 'this_week') {
    const fromD = createDateVN(fromParts.year, fromParts.month, fromParts.day);
    const weekNum = getISOWeekNumber(fromD);
    const unitTitle = `Tuần ${weekNum}/${fromParts.year}`;
    const dateRangeText = `${formatDM(fromDate)} – ${formatDMY(toDate)}`;
    return {
      unitTitle,
      dateRangeText,
      formattedText: `${unitTitle} · ${dateRangeText}`,
    };
  }

  if (preset === 'this_month') {
    const mm = String(fromParts.month).padStart(2, '0');
    const unitTitle = `Tháng ${mm}/${fromParts.year}`;
    const dateRangeText = `${formatDM(fromDate)} – ${formatDMY(toDate)}`;
    return {
      unitTitle,
      dateRangeText,
      formattedText: `${unitTitle} · ${dateRangeText}`,
    };
  }

  if (preset === 'this_year') {
    const unitTitle = `Năm ${fromParts.year}`;
    const dateRangeText = `${formatDM(fromDate)} – ${formatDMY(toDate)}`;
    return {
      unitTitle,
      dateRangeText,
      formattedText: `${unitTitle} · ${dateRangeText}`,
    };
  }

  // preset === 'custom'
  const unitTitle = 'Tuỳ chọn';
  const dateRangeText = `${formatDM(fromDate)} – ${formatDMY(toDate)}`;
  return {
    unitTitle,
    dateRangeText,
    formattedText: `${unitTitle} · ${dateRangeText}`,
  };
};

/**
 * Trả về chuỗi nhãn hiển thị đơn giản cho period navigator.
 */
export const formatPeriodLabel = (
  preset: PeriodPreset,
  fromDate: string,
  toDate: string,
  now = new Date()
): string => {
  return formatPeriodLabelInfo(preset, fromDate, toDate, now).formattedText;
};

/**
 * Phân tích và chuẩn hóa các tham số từ URL query parameters.
 * Mặc định trả về 'this_month' nếu thiếu ngày hoặc tham số rỗng.
 */
export const parsePeriodFromParams = (
  params: {
    preset?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
  },
  now = new Date()
): PeriodRange => {
  const rawPreset = params.preset?.trim();
  const rawFrom = params.fromDate?.trim();
  const rawTo = params.toDate?.trim();

  const validPresets: PeriodPreset[] = [
    'today',
    'this_week',
    'this_month',
    'this_year',
    'custom',
  ];

  // Nếu cả 2 mốc ngày đều thiếu -> Mặc định 'this_month'
  if (!rawFrom && !rawTo) {
    const matchedPreset = validPresets.includes(rawPreset as PeriodPreset)
      ? (rawPreset as PeriodPreset)
      : 'this_month';
    return {
      preset: matchedPreset,
      ...getPeriodDateRange(matchedPreset, now),
    };
  }

  const defaultRange = getPeriodDateRange('this_month', now);
  const fromDate = rawFrom || defaultRange.fromDate;
  const toDate = rawTo || defaultRange.toDate;

  if (validPresets.includes(rawPreset as PeriodPreset)) {
    return {
      preset: rawPreset as PeriodPreset,
      fromDate,
      toDate,
    };
  }

  // Không có preset hoặc preset không hợp lệ -> Suy luận từ khoảng ngày
  const todayRange = getPeriodDateRange('today', now);
  if (fromDate === todayRange.fromDate && toDate === todayRange.toDate) {
    return { preset: 'today', fromDate, toDate };
  }

  const weekRange = getPeriodDateRange('this_week', now);
  if (fromDate === weekRange.fromDate && toDate === weekRange.toDate) {
    return { preset: 'this_week', fromDate, toDate };
  }

  const monthRange = getPeriodDateRange('this_month', now);
  if (fromDate === monthRange.fromDate && toDate === monthRange.toDate) {
    return { preset: 'this_month', fromDate, toDate };
  }

  const yearRange = getPeriodDateRange('this_year', now);
  if (fromDate === yearRange.fromDate && toDate === yearRange.toDate) {
    return { preset: 'this_year', fromDate, toDate };
  }

  return {
    preset: 'custom',
    fromDate,
    toDate,
  };
};
