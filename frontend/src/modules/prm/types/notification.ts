export type NotificationSeverity = 'info' | 'action' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  user_id?: string;
  audience?: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  body?: string;
  entity_ref?: string;
  read: boolean;
  created_at: string;
}

export interface ListNotificationsParams {
  unread?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListNotificationsResponse {
  data: NotificationItem[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface SimulateNotificationInput {
  type?: string;
  severity?: NotificationSeverity;
  title?: string;
  body?: string;
  entity_ref?: string;
  audience?: string;
}
