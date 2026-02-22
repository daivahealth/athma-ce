'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import type { QueryResult, ResultColumn } from '../types/report';
import { cn } from '@/lib/utils';

interface ResultsTableProps {
  result: QueryResult | null;
  isLoading?: boolean;
  className?: string;
}

function formatCellValue(value: any, format?: string, currency = 'INR'): string {
  if (value === null || value === undefined) {
    return '-';
  }

  // Determine locale based on currency
  const locale = currency === 'INR' ? 'en-IN' : currency === 'AED' ? 'en-AE' : 'en-US';

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      }).format(Number(value));

    case 'percentage':
      return `${(Number(value) * 100).toFixed(2)}%`;

    case 'number':
      return new Intl.NumberFormat(locale).format(Number(value));

    case 'date':
      return new Date(value).toLocaleDateString(locale);

    case 'datetime':
      return new Date(value).toLocaleString(locale);

    default:
      return String(value);
  }
}

function getColumnAlignment(format?: string): 'left' | 'right' | 'center' {
  switch (format) {
    case 'currency':
    case 'percentage':
    case 'number':
      return 'right';
    default:
      return 'left';
  }
}

export function ResultsTable({ result, isLoading = false, className }: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Get currency from config (default to INR)
  const { data: currencyConfig } = useResolveConfig('billing.currency');
  const currency = (currencyConfig?.value as string) || 'INR';

  // Calculate totals for numeric columns (currency, number)
  const columnTotals = useMemo(() => {
    if (!result?.columns || !result?.rows) return {};

    const totals: Record<string, number> = {};
    const summableFormats = ['currency', 'number'];

    for (const col of result.columns) {
      if (col.format && summableFormats.includes(col.format)) {
        totals[col.name] = result.rows.reduce((sum, row) => {
          const value = row[col.name];
          return sum + (typeof value === 'number' ? value : parseFloat(value) || 0);
        }, 0);
      }
    }

    return totals;
  }, [result?.columns, result?.rows]);

  // Check if we have any totals to display
  const hasTotals = Object.keys(columnTotals).length > 0;

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    if (!result?.columns) return [];

    return result.columns.map((col: ResultColumn) => ({
      accessorKey: col.name,
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>{col.displayName}</span>
            {isSorted === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => {
        const value = getValue();
        const formatted = formatCellValue(value, col.format, currency);
        const alignment = getColumnAlignment(col.format);

        return (
          <div
            className={cn(
              alignment === 'right' && 'text-right',
              alignment === 'center' && 'text-center',
              col.format === 'currency' && 'font-mono',
              col.format === 'number' && 'font-mono'
            )}
          >
            {formatted}
          </div>
        );
      },
    }));
  }, [result?.columns, currency]);

  const table = useReactTable({
    data: result?.rows ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
    },
  });

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!result) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-muted-foreground', className)}>
        Enter a query to see results
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-muted-foreground', className)}>
        No results found for this query
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {hasTotals && (
            <TableFooter>
              <TableRow className="bg-muted/50 font-semibold">
                {result.columns.map((col, index) => (
                  <TableCell key={col.name}>
                    {index === 0 ? (
                      <span className="text-muted-foreground">Total</span>
                    ) : columnTotals[col.name] !== undefined ? (
                      <div
                        className={cn(
                          'text-right font-mono',
                          col.format === 'currency' && 'text-primary'
                        )}
                      >
                        {formatCellValue(columnTotals[col.name], col.format, currency)}
                      </div>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            result.totalCount
          )}{' '}
          of {result.totalCount} rows
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Execution info */}
      <div className="text-xs text-muted-foreground text-right">
        Query executed in {result.executionTimeMs}ms
      </div>
    </div>
  );
}
