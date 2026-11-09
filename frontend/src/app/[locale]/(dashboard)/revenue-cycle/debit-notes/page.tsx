'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, Search, FilePlus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebitNotes } from '@/modules/rcm/hooks/use-debit-notes';
import type { DebitNote, DebitNoteStatus } from '@/modules/rcm/types/debit-note';
import { PageHeader } from '@/components/ui/page-header';
import { PatientIdentity } from '@/modules/rcm/components/patient-identity';

const statusLabels: Record<DebitNoteStatus, string> = {
  draft: 'Draft',
  posted: 'Posted',
  voided: 'Voided',
};

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<DebitNote>[] => [
  {
    accessorKey: 'debitNoteNumber',
    header: 'Debit note #',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    id: 'patient',
    header: 'Patient',
    cell: ({ row }) => <PatientIdentity source={row.original} />,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `${Number(row.original.amount || 0).toFixed(2)} ${row.original.currency}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<DebitNoteStatus>();
      return <Badge variant="secondary">{statusLabels[status]}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/debit-notes/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function DebitNotesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const { data: debitNotes, isLoading, error } = useDebitNotes();
  const sanitized = useMemo(() => debitNotes ?? [], [debitNotes]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((note) => {
      const patientName = note.patientDisplay?.displayName || note.patientDisplayName || '';
      const mrn = note.patientDisplay?.mrn || note.mrn || '';
      return `${note.debitNoteNumber} ${patientName} ${mrn} ${note.patientId}`
        .toLowerCase()
        .includes(term);
    });
  }, [sanitized, search]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Debit notes"
        subtitle="Additional charges raised against patient invoices"
        icon={FilePlus}
        actions={
          <Button asChild>
            <Link href={`/${locale}/revenue-cycle/debit-notes/new`}>
              <Plus className="mr-2 h-4 w-4" /> New debit note
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search debit notes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ResourceTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        error={error}
        emptyMessage="No debit notes found."
      />
    </div>
  );
}
