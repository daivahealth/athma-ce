'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DEFAULT_PAGE_SIZE = 20;

/** Number of pages for `total` rows at `pageSize` per page (never less than 1). */
export function pageCount(total: number, pageSize: number): number {
  if (!pageSize || pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Zero-based offset of the first row on `page` (1-based). */
export function pageOffset(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * pageSize;
}

interface ListPaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageSize: number;
  /** Total rows across all pages, as reported by the server. */
  total: number;
  onPageChange: (page: number) => void;
  /** Plural noun for the count line, e.g. "patients". */
  itemLabel?: string;
  className?: string;
}

/**
 * Footer for server-paginated lists: an honest "Showing 21–40 of 132" count
 * plus Previous / Next controls when there is more than one page. Pair it
 * with page state that resets to 1 whenever a filter or search changes.
 */
export function ListPagination({
  page,
  pageSize,
  total,
  onPageChange,
  itemLabel = 'records',
  className,
}: ListPaginationProps) {
  const totalPages = pageCount(total, pageSize);
  const current = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : pageOffset(current, pageSize) + 1;
  const to = Math.min(total, current * pageSize);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs text-muted-foreground',
        className,
      )}
    >
      <span>
        {total === 0
          ? `0 ${itemLabel}`
          : `Showing ${from}–${to} of ${total} ${itemLabel}`}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={() => onPageChange(current - 1)}
            disabled={current <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="whitespace-nowrap">
            Page {current} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={() => onPageChange(current + 1)}
            disabled={current >= totalPages}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5 sm:ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
