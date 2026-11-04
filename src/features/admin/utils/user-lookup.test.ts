import { formatAdminDate, isUuid, shortenUuid } from './user-lookup';

describe('isUuid', () => {
  it('accepts a full UUID in any case and with surrounding spaces', () => {
    expect(isUuid('5B0C9F54-7D61-4F7A-9A4E-9F1F7F4F3A21')).toBe(true);
    expect(isUuid('  5b0c9f54-7d61-4f7a-9a4e-9f1f7f4f3a21  ')).toBe(true);
  });

  it('rejects partial ids, names and emails', () => {
    expect(isUuid('5b0c9f54')).toBe(false);
    expect(isUuid('duck.nguyen@example.com')).toBe(false);
    expect(isUuid('')).toBe(false);
  });
});

describe('shortenUuid', () => {
  it('keeps the head and tail of a long id', () => {
    expect(shortenUuid('5b0c9f54-7d61-4f7a-9a4e-9f1f7f4f3a21')).toBe('5b0c9f54…f3a21');
  });

  it('returns a dash when the id is missing', () => {
    expect(shortenUuid(undefined)).toBe('—');
  });
});

describe('formatAdminDate', () => {
  it('formats an ISO timestamp as a Vietnamese date', () => {
    expect(formatAdminDate('2026-10-27T09:00:00Z')).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('returns a dash for missing or invalid values', () => {
    expect(formatAdminDate(undefined)).toBe('—');
    expect(formatAdminDate('not-a-date')).toBe('—');
  });
});
