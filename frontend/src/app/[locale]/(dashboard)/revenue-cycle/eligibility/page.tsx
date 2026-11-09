'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus, Search, BadgeCheck } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEligibilityRequests } from '@/modules/rcm/hooks/use-eligibility';
import type { EligibilityRequest, EligibilityStatus } from '@/modules/rcm/types/eligibility';
import { PageHeader } from '@/components/ui/page-header';
import { PatientIdentity } from '@/modules/rcm/components/patient-identity';

const statusLabels: Record<EligibilityStatus, string> = {
  accepted: 'Accepted',
  rejected: 'Rejected',
  error: 'Error',
};

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<EligibilityRequest>[] => [
  {
    accessorKey: 'id',
    header: 'Request ID',
    cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
  },
  {
    id: 'patient',
    header: 'Patient',
    cell: ({ row }) => <PatientIdentity source={row.original} />,
  },
  {
    accessorKey: 'payerId',
    header: 'Payer',
    cell: ({ getValue }) => (
      <p className="font-mono text-xs" title={getValue<string>()}>
        {getValue<string>()}
      </p>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<EligibilityStatus>();
      return <Badge variant="secondary">{statusLabels[status] ?? status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/revenue-cycle/eligibility/${row.original.id}`)}
      >
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function EligibilityPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useEligibilityRequests();
  const requests = useMemo(() => data?.requests ?? [], [data]);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return requests;
    return requests.filter((request) =>
      `${request.id} ${request.patientDisplay?.displayName ?? ''} ${request.patientDisplay?.mrn ?? ''}`
        .toLowerCase()
        .includes(term),
    );
  }, [requests, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eligibility requests"
        subtitle="Insurance coverage checks for patients"
        icon={BadgeCheck}
        actions={
          <Button asChild>
            <Link href={`/${locale}/revenue-cycle/eligibility/new`}>
              <Plus className="mr-2 h-4 w-4" /> New request
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
                placeholder="Search by request ID, patient name, or MRN..."
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
        emptyMessage="No eligibility requests found."
      />
    </div>
  );
}
