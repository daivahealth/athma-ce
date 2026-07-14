'use client';

import * as React from 'react';
import {
  Bell,
  Info,
  Zap,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useSimulateNotification,
  useNotificationStream,
} from '@/modules/prm/hooks/use-notifications';
import type {
  NotificationItem,
  NotificationSeverity,
} from '@/modules/prm/types/notification';

const isDev = process.env.NODE_ENV !== 'production';

const SEVERITY_STYLES: Record<
  NotificationSeverity,
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  info: { icon: Info, color: 'text-sky-500', label: 'Info' },
  action: { icon: Zap, color: 'text-primary', label: 'Action' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', label: 'Warning' },
  error: { icon: AlertCircle, color: 'text-destructive', label: 'Error' },
};

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = then - Date.now();
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
  return rtf.format(Math.round(diffMs / day), 'day');
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}) {
  const style = SEVERITY_STYLES[notification.severity] ?? SEVERITY_STYLES.info;
  const Icon = style.icon;

  return (
    <button
      type="button"
      onClick={() => !notification.read && onMarkRead(notification.id)}
      className={cn(
        'flex w-full gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent',
        !notification.read && 'bg-accent/40',
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', style.color)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium leading-none">{notification.title}</p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
          )}
        </div>
        {notification.body && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{notification.body}</p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground/80">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </button>
  );
}

export function NotificationCenter() {
  const toast = useToast();
  const [open, setOpen] = React.useState(false);

  const { data: unreadData } = useUnreadCount();
  const { data: listData, isLoading } = useNotifications({ limit: 20 });
  const markRead = useMarkNotificationRead();
  const simulate = useSimulateNotification();

  // Live updates: toast on incoming notification; caches refresh in the hook.
  useNotificationStream((n) => {
    toast({
      title: n.title,
      description: n.body,
      variant: n.severity === 'error' ? 'destructive' : 'default',
    });
  });

  const unreadCount = unreadData?.unread_count ?? 0;
  const notifications = listData?.data ?? [];

  const handleMarkAllRead = () => {
    notifications.filter((n) => !n.read).forEach((n) => markRead.mutate(n.id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 py-0 text-[10px] leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={handleMarkAllRead}
              disabled={markRead.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-1">
            {isLoading && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
            )}
            {!isLoading && notifications.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                You&apos;re all caught up.
              </p>
            )}
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onMarkRead={markRead.mutate} />
            ))}
          </div>
        </ScrollArea>

        {isDev && (
          <div className="border-t px-3 py-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
              onClick={() => simulate.mutate()}
              disabled={simulate.isPending}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Simulate event
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
