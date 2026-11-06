'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToneBadge } from '@/components/ui/tone-badge';
import { ReportStatus } from '../../types/reporting';

const WORKFLOW_STEPS = [
  { key: ReportStatus.DRAFT, label: 'Draft' },
  { key: ReportStatus.PRELIMINARY, label: 'Preliminary' },
  { key: ReportStatus.FINAL, label: 'Final' },
];

const STATUS_ORDER: Record<string, number> = {
  [ReportStatus.DRAFT]: 0,
  [ReportStatus.PRELIMINARY]: 1,
  [ReportStatus.FINAL]: 2,
  [ReportStatus.AMENDED]: 2,
  [ReportStatus.CORRECTED]: 2,
  [ReportStatus.CANCELLED]: -1,
};

interface ResultStatusWorkflowProps {
  currentStatus: string;
  className?: string;
}

/** Draft → Preliminary → Final as a compact stepper: done steps are filled, the current one is ringed. */
export function ResultStatusWorkflow({ currentStatus, className }: ResultStatusWorkflowProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;

  if (currentStatus === ReportStatus.CANCELLED) {
    return (
      <ToneBadge tone="red" withDot className={className}>
        Cancelled
      </ToneBadge>
    );
  }

  return (
    <ol className={cn('flex items-center', className)} aria-label="Report workflow">
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex || (index === currentIndex && index === WORKFLOW_STEPS.length - 1);
        const isCurrent = index === currentIndex && !isCompleted;

        return (
          <li key={step.key} className="flex items-center" aria-current={isCurrent ? 'step' : undefined}>
            {index > 0 && (
              <span
                className={cn(
                  'mx-2 h-px w-8',
                  index <= currentIndex ? 'bg-emerald-400' : 'border-t border-dashed border-border bg-transparent',
                )}
              />
            )}
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex size-4 items-center justify-center rounded-full border transition-colors',
                  isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                  isCurrent && 'border-emerald-500 bg-background ring-4 ring-emerald-200 dark:ring-emerald-900/60',
                  !isCompleted && !isCurrent && 'border-border bg-background',
                )}
              >
                {isCompleted ? <Check className="size-2.5" strokeWidth={3} /> : null}
              </span>
              <span
                className={cn(
                  'text-xs',
                  isCurrent && 'font-semibold text-emerald-700 dark:text-emerald-300',
                  isCompleted && 'text-foreground',
                  !isCompleted && !isCurrent && 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
