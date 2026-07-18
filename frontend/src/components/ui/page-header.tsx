import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Right-aligned action buttons (e.g. "New Patient"). */
  actions?: ReactNode;
  /** Optional content rendered above the title, e.g. a Breadcrumb. */
  breadcrumb?: ReactNode;
  /** Apply the brand gradient to the title text. */
  gradient?: boolean;
  className?: string;
}

/**
 * Canonical page title block. Replaces the ad-hoc h1/CardTitle mixture
 * used across pages so every screen shares one visual "page title" idiom.
 */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumb,
  gradient = false,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="space-y-1.5">
        {breadcrumb}
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <h1
            className={cn(
              'font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl',
              gradient && 'text-gradient',
            )}
          >
            {title}
          </h1>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
