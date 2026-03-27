'use client';

import { cn } from '@/lib/utils';
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

export function ResultStatusWorkflow({ currentStatus, className }: ResultStatusWorkflowProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;

  if (currentStatus === ReportStatus.CANCELLED) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-red-600', className)}>
        Cancelled
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {index > 0 && (
              <div
                className={cn(
                  'h-0.5 w-6 mx-1',
                  isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-200',
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2',
                  isCompleted && 'bg-green-500 border-green-500',
                  isCurrent && 'bg-white border-green-500',
                  !isCompleted && !isCurrent && 'bg-white border-gray-300',
                )}
              />
              <span
                className={cn(
                  'text-xs',
                  isCurrent && 'font-semibold text-green-700',
                  isCompleted && 'text-green-600',
                  !isCompleted && !isCurrent && 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
