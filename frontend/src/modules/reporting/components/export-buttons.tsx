'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useExportReport } from '../hooks/use-reports';
import type { QueryResult, ExportFormat } from '../types/report';

interface ExportButtonsProps {
  result: QueryResult | null;
  title?: string;
  disabled?: boolean;
  currency?: string;
}

export function ExportButtons({ result, title, disabled = false, currency }: ExportButtonsProps) {
  const { toast } = useToast();
  const exportMutation = useExportReport();
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!result) {
      toast({
        title: 'No data to export',
        description: 'Run a query first to export the results.',
        variant: 'destructive',
      });
      return;
    }

    setExportingFormat(format);

    try {
      await exportMutation.mutateAsync({ result, format, title, currency });
      toast({
        title: 'Export successful',
        description: `Report exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportingFormat(null);
    }
  };

  const isExporting = exportMutation.isPending;
  const isDisabled = disabled || !result || result.rows.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isDisabled}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          disabled={isExporting}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>Excel (.xlsx)</span>
          {exportingFormat === 'excel' && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={isExporting}
        >
          <File className="mr-2 h-4 w-4 text-blue-600" />
          <span>CSV (.csv)</span>
          {exportingFormat === 'csv' && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          <span>PDF (.pdf)</span>
          {exportingFormat === 'pdf' && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
