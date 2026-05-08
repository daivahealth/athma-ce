'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToasts, useDismissToast } from '@/components/ui/use-toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toaster() {
  const toasts = useToasts();
  const dismiss = useDismissToast();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => setTimeout(() => dismiss(toast.id), 5000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 p-4 sm:max-w-[420px] pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'success' ? CheckCircle2 :
            toast.variant === 'destructive' ? AlertCircle :
              Info;

        return (
          <div
            key={toast.id}
            className={cn(
              'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-xl transition-all',
              'animate-in slide-in-from-bottom-5 duration-300 ease-out',
              // Base Glassmorphism & Colors
              'bg-background/95 backdrop-blur-lg border-border',
              // Variants
              toast.variant === 'success' && 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/30',
              toast.variant === 'destructive' && 'border-red-500/20 bg-red-50/90 dark:bg-red-950/30',
              !toast.variant && 'bg-background/80 border-border/50'
            )}
          >
            <div className={cn(
              "mt-0.5 shrink-0 transition-colors",
              toast.variant === 'success' ? "text-emerald-500" :
                toast.variant === 'destructive' ? "text-red-500" :
                  "text-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
              {toast.title && (
                <p className={cn(
                  "text-sm font-semibold leading-none tracking-tight",
                  toast.variant === 'success' ? "text-emerald-700 dark:text-emerald-400" :
                    toast.variant === 'destructive' ? "text-red-700 dark:text-red-400" :
                      "text-foreground"
                )}>
                  {toast.title}
                </p>
              )}
              {toast.description && (
                <p className="text-sm text-muted-foreground/90 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3",
                toast.variant === 'success' ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900" :
                  toast.variant === 'destructive' ? "text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900" :
                    "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => dismiss(toast.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
