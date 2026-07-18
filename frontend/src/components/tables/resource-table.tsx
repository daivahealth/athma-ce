'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, Inbox, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ResourceTableProps<TData extends { id: string }> {
  title?: string;
  cta?: ReactNode;
  columns: ColumnDef<TData>[];
  data?: TData[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  emptyState?: string;
  /** Optional supporting line under the empty-state title. */
  emptyDescription?: string;
  /** Icon shown in the empty state. Defaults to a generic inbox icon. */
  emptyIcon?: LucideIcon;
  onRowClick?: (row: TData) => void;
  /** Shows a "Try again" button in the error state when provided. */
  onRetry?: () => void;
}

export function ResourceTable<TData extends { id: string }>({
  title,
  cta,
  columns,
  data = [],
  isLoading,
  error,
  emptyMessage,
  emptyState = 'No records found.',
  emptyDescription,
  emptyIcon = Inbox,
  onRowClick,
  onRetry,
}: ResourceTableProps<TData>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const resolvedEmptyState = emptyMessage ?? emptyState;

  const showDefaultCta = cta === undefined;
  const hasHeader = !!(title || showDefaultCta || cta);

  return (
    <Card>
      {hasHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
          {showDefaultCta ? <Button size="sm">New</Button> : cta}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="sticky top-0 z-10 bg-card/95 text-left text-xs uppercase text-muted-foreground backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`}>
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-full max-w-[10rem]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">Unable to load records</p>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        {error.message || 'Something went wrong while fetching this data.'}
                      </p>
                      {onRetry && (
                        <Button variant="outline" size="sm" className="mt-1" onClick={onRetry}>
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Try again
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : data.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'bg-background',
                      onRowClick &&
                        'cursor-pointer transition-colors hover:bg-primary/[0.04] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
                    )}
                    onClick={() => onRowClick?.(row.original)}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row.original);
                            }
                          }
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    <EmptyState icon={emptyIcon} title={resolvedEmptyState} description={emptyDescription} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
