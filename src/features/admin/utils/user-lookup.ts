const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns true when the value is a full UUID. The admin user list uses this to
 * decide between the exact `userId` filter and the free-text `q` filter: the API
 * accepts both, but only `userId` can find an account by id.
 */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

/** Shortens a UUID for table cells: `5b0c9f54…f3a21`. */
export function shortenUuid(value?: string): string {
  if (!value) return '—';
  const trimmed = value.trim();
  if (trimmed.length <= 20) return trimmed;
  return `${trimmed.slice(0, 8)}…${trimmed.slice(-5)}`;
}

export function formatAdminDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
