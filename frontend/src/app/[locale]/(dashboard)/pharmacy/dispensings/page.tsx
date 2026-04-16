'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { usePharmacyDispensings } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import type { PharmacyDispensing } from '@/modules/pharmacy/types/dispensing';
import { DispensingStatus, DispensingChannel } from '@/modules/pharmacy/types/dispensing';

const STATUS_VARIANTS: Record<DispensingStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [DispensingStatus.QUEUED]: 'outline',
  [DispensingStatus.VERIFIED]: 'secondary',
  [DispensingStatus.DISPENSED]: 'default',
  [DispensingStatus.PARTIALLY_DISPENSED]: 'secondary',
  [DispensingStatus.CANCELLED]: 'destructive',
  [DispensingStatus.RETURNED]: 'outline',
};

const CHANNEL_LABELS: Record<DispensingChannel, string> = {
  [DispensingChannel.OUTPATIENT_COUNTER]: 'Outpatient',
  [DispensingChannel.INPATIENT_WARD]: 'Inpatient Ward',
  [DispensingChannel.INPATIENT_BEDSIDE]: 'Bedside',
  [DispensingChannel.EMERGENCY]: 'Emergency',
};

export default function DispensingHistoryPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filters = {
    ...(statusFilter && { status: statusFilter }),
  };

  const { data: dispensings = [], isLoading } = usePharmacyDispensings(filters);

  const columns: ColumnDef<PharmacyDispensing>[] = [
    {
      accessorKey: 'dispensingNumber',
      header: 'Dispensing #',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.dispensingNumber}</span>
      ),
    },
    {
      accessorKey: 'patientDisplayName',
      header: 'Patient',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.patientDisplayName ?? '—'}</div>
          {row.original.mrn && (
            <div className="text-xs text-muted-foreground">MRN: {row.original.mrn}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'dispensingChannel',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">
          {CHANNEL_LABELS[row.original.dispensingChannel] ?? row.original.dispensingChannel}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANTS[row.original.status as DispensingStatus] ?? 'outline'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'dispensedAt',
      header: 'Dispensed At',
      cell: ({ row }) =>
        row.original.dispensedAt
          ? format(new Date(row.original.dispensedAt), 'dd MMM yyyy HH:mm')
          : '—',
    },
    {
      accessorKey: 'chargePosted',
      header: 'Charged',
      cell: ({ row }) => (
        <Badge variant={row.original.chargePosted ? 'default' : 'outline'}>
          {row.original.chargePosted ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/${locale}/pharmacy/dispensings/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {Object.values(DispensingStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResourceTable
        columns={columns}
        data={dispensings}
        isLoading={isLoading}
        emptyMessage="No dispensing records found"
      />
    </div>
  );
}
