'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  useReportableOrders,
  useCreateLabReport,
  useCreateImagingReport,
  useCreateProcedureReport,
} from '@/modules/clinical/hooks/use-reporting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText } from 'lucide-react';
import type { ReportableOrder } from '@/modules/clinical/types/reporting';
import type { ReportType } from '@/modules/clinical/types/reporting';

interface NewReportDialogProps {
  reportType: ReportType;
}

const typeLabels: Record<ReportType, string> = {
  lab: 'Lab Report',
  imaging: 'Imaging Report',
  procedure: 'Procedure Report',
};

const routePrefixes: Record<ReportType, string> = {
  lab: 'results/lab',
  imaging: 'results/imaging',
  procedure: 'results/procedure',
};

export function NewReportDialog({ reportType }: NewReportDialogProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: orders, isLoading } = useReportableOrders(
    reportType,
    { search: debouncedSearch || undefined, limit: 30 },
    open,
  );

  const createLab = useCreateLabReport();
  const createImaging = useCreateImagingReport();
  const createProcedure = useCreateProcedureReport();

  const handleCreate = async (order: ReportableOrder) => {
    setCreating(order.id);
    try {
      if (reportType === 'lab') {
        await createLab.mutateAsync({ orderId: order.id });
      } else if (reportType === 'imaging') {
        await createImaging.mutateAsync({ orderId: order.id });
      } else {
        await createProcedure.mutateAsync({ orderId: order.id });
      }
      setOpen(false);
      router.push(`/${locale}/${routePrefixes[reportType]}/${order.id}`);
    } catch {
      // Error handled by mutation
    } finally {
      setCreating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New {typeLabels[reportType]}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New {typeLabels[reportType]}</DialogTitle>
          <DialogDescription>
            Select an order to create a new report. Only orders without existing reports are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by name..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="md" text="Loading orders..." />
            </div>
          )}

          {!isLoading && orders && orders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No reportable orders found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? 'Try a different search term.'
                  : `All ${reportType} orders already have reports, or no orders of this type exist.`}
              </p>
            </div>
          )}

          {!isLoading && orders && orders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Name</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderName}
                    </TableCell>
                    <TableCell>{order.patientName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(order.orderedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleCreate(order)}
                        disabled={creating !== null}
                      >
                        {creating === order.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Create
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
