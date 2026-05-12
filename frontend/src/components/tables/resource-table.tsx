'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  onRowClick?: (row: TData) => void;
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
  onRowClick,
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
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
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
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td colSpan={columns.length} className="px-4 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-destructive">
                    {error.message || 'Unable to load records.'}
                  </td>
                </tr>
              ) : data.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`bg-background ${onRowClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                    onClick={() => onRowClick?.(row.original)}
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
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                    {resolvedEmptyState}
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
