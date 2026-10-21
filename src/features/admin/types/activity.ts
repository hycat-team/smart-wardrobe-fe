import type { PaginationResult } from '@/types/api';

export type ActivityEventType = 'login' | 'refresh';

export interface ActivityEvent {
  id: string;
  userId: string;
  activityType: ActivityEventType | string;
  occurredAt: string;
  createdAt: string;
  userEmail: string;
  userFirstName?: string | null;
  userLastName?: string | null;
}

export interface ActivityEventQuery {
  userId?: string;
  activityType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export type ActivityEventList = PaginationResult<ActivityEvent>;
