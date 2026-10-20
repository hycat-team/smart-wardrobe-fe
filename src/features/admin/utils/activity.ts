import type { ActivityEvent } from '../types/activity';

export interface ActivityTypeConfig {
  label: string;
  className: string;
}

export const getActivityTypeConfig = (type?: string | null): ActivityTypeConfig => {
  switch (type) {
    case 'login':
      return {
        label: 'Đăng nhập',
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      };
    case 'refresh':
      return {
        label: 'Làm mới phiên',
        className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
      };
    default:
      return {
        label: type || '—',
        className: 'text-muted-foreground border-border',
      };
  }
};

export const getUserDisplayName = (
  event: Pick<ActivityEvent, 'userEmail' | 'userFirstName' | 'userLastName'>,
): string => {
  const parts = [event.userFirstName, event.userLastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return event.userEmail || '—';
};

export const isValidUUID = (str: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    str.trim(),
  );
};
