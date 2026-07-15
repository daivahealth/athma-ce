'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from '@/lib/api/client';
import { notificationsService } from '../services/notifications-service';
import type {
  ListNotificationsParams,
  ListNotificationsResponse,
  NotificationItem,
  SimulateNotificationInput,
  UnreadCountResponse,
} from '../types/notification';

export const NOTIFICATION_KEYS = {
  all: ['prm-notifications'] as const,
  list: (params: ListNotificationsParams) => [...NOTIFICATION_KEYS.all, 'list', params] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
};

export function useNotifications(params: ListNotificationsParams = {}) {
  return useQuery<ListNotificationsResponse>({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => notificationsService.list(params),
  });
}

export function useUnreadCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: () => notificationsService.unreadCount(),
    // Poll as a resilience fallback in case the SSE stream drops.
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<NotificationItem, Error, string>({
    mutationFn: (id) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

export function useSimulateNotification() {
  const queryClient = useQueryClient();
  return useMutation<NotificationItem, Error, SimulateNotificationInput | void>({
    mutationFn: (payload) => notificationsService.simulate(payload ?? {}),
    onSuccess: () => {
      // The SSE stream also pushes it, but invalidate so state is correct even
      // if the stream is unavailable.
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

/**
 * Subscribe to the real-time notification SSE stream. On each pushed
 * notification the react-query caches are refreshed so the badge and list stay
 * live. Automatically reconnects (native EventSource behaviour) and tears down
 * on unmount / token change.
 */
export function useNotificationStream(onNotification?: (n: NotificationItem) => void) {
  const queryClient = useQueryClient();
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  const accessToken = getSession().accessToken;

  useEffect(() => {
    if (typeof window === 'undefined' || !accessToken) {
      return;
    }

    const source = new EventSource(notificationsService.streamUrl(accessToken));

    source.onmessage = (event: MessageEvent) => {
      try {
        const notification = JSON.parse(event.data) as NotificationItem;
        onNotificationRef.current?.(notification);
      } catch {
        // Ignore malformed frames (e.g. keep-alive comments).
      }
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    };

    return () => {
      source.close();
    };
  }, [accessToken, queryClient]);
}
