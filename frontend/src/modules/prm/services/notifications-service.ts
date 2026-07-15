import { PRM_BASE_URL, prmClient } from '@/lib/api/client';
import type {
  ListNotificationsParams,
  ListNotificationsResponse,
  NotificationItem,
  SimulateNotificationInput,
  UnreadCountResponse,
} from '../types/notification';

class NotificationsService {
  async list(params: ListNotificationsParams = {}): Promise<ListNotificationsResponse> {
    const response = await prmClient.get('/v1/notifications', { params });
    return response.data;
  }

  async unreadCount(): Promise<UnreadCountResponse> {
    const response = await prmClient.get('/v1/notifications/unread-count');
    return response.data;
  }

  async markRead(id: string): Promise<NotificationItem> {
    const response = await prmClient.post(`/v1/notifications/${id}/read`);
    return response.data;
  }

  /** DEV-only: emit a sample notification onto the stream. */
  async simulate(payload: SimulateNotificationInput = {}): Promise<NotificationItem> {
    const response = await prmClient.post('/v1/notifications/simulate', payload);
    return response.data;
  }

  /**
   * SSE endpoint URL. EventSource cannot set an Authorization header, so the
   * JWT is passed as the `access_token` query parameter (validated server-side
   * by SseAuthGuard).
   */
  streamUrl(accessToken: string): string {
    return `${PRM_BASE_URL}/v1/notifications/stream?access_token=${encodeURIComponent(accessToken)}`;
  }
}

export const notificationsService = new NotificationsService();
