'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReportStatus } from '../../types/reporting';

const statusConfig: Record<string, { label: string; className: string }> = {
  [ReportStatus.DRAFT]: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800',
  },
  [ReportStatus.PRELIMINARY]: {
    label: 'Preliminary',
    className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  },
  [ReportStatus.FINAL]: {
    label: 'Final',
    className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800',
  },
  [ReportStatus.AMENDED]: {
    label: 'Amended',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
  [ReportStatus.CORRECTED]: {
    label: 'Corrected',
    className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
  },
  [ReportStatus.CANCELLED]: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  },
};

interface ResultStatusBadgeProps {
  status: string;
  className?: string;
}

export function ResultStatusBadge({ status, className }: ResultStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
