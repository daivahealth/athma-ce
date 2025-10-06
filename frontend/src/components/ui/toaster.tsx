'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToasts, useDismissToast } from '@/components/ui/use-toast';

export function Toaster() {
  const toasts = useToasts();
  const dismiss = useDismissToast();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => setTimeout(() => dismiss(toast.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex w-full max-w-md items-start gap-3 rounded-md border border-border bg-background p-4 shadow-lg',
            toast.variant === 'success' && 'border-success/40 bg-success/10 text-success-foreground',
            toast.variant === 'destructive' && 'border-destructive/40 bg-destructive/10 text-destructive-foreground',
          )}
        >
          <div className="flex-1 space-y-1">
            {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
            {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => dismiss(toast.id)}>
            Close
          </Button>
        </div>
      ))}
    </div>
  );
}
