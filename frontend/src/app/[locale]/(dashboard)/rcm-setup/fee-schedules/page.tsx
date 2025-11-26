'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFeeSchedules } from '@/modules/rcm/hooks/use-fee-schedules';
import type { FeeSchedule } from '@/modules/rcm/types/fee-schedule';
import { FeeScheduleType, FeeScheduleStatus, AuthorityCode } from '@/modules/rcm/types/fee-schedule';

const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<FeeSchedule>[] => [
  {
    accessorKey: 'scheduleName',
    header: 'Schedule',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.scheduleName}</p>
        <p className="text-xs text-muted-foreground">{row.original.version || '—'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'scheduleType',
    header: 'Type',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<FeeScheduleStatus>();
      const variant = status === FeeScheduleStatus.ACTIVE ? 'default' : status === FeeScheduleStatus.DRAFT ? 'outline' : 'secondary';
      return <Badge variant={variant}>{toLabel(status)}</Badge>;
    },
  },
  {
    accessorKey: 'effectiveFrom',
    header: 'Effective',
    cell: ({ row }) => {
      const from = format(new Date(row.original.effectiveFrom), 'PP');
      const to = row.original.effectiveTo ? format(new Date(row.original.effectiveTo), 'PP') : '—';
      return (
        <div className="text-sm">
          <p>{from}</p>
          <p className="text-xs text-muted-foreground">to {to}</p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/rcm-setup/fee-schedules/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function FeeSchedulesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | FeeScheduleType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | FeeScheduleStatus>('all');
  const [authorityFilter, setAuthorityFilter] = useState<'all' | AuthorityCode>('all');

  const filters = useMemo(
    () => ({
      scheduleType: typeFilter === 'all' ? undefined : typeFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
      authorityCode: authorityFilter === 'all' ? undefined : authorityFilter,
    }),
    [typeFilter, statusFilter, authorityFilter],
  );

  const { data: schedules, isLoading, error } = useFeeSchedules(filters);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => schedules ?? [], [schedules]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((schedule) =>
      `${schedule.scheduleName} ${schedule.version ?? ''}`.toLowerCase().includes(term),
    );
  }, [sanitized, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fee schedules..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'all' | FeeScheduleType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.values(FeeScheduleType).map((type) => (
              <SelectItem key={type} value={type}>
                {toLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | FeeScheduleStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(FeeScheduleStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {toLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={authorityFilter} onValueChange={(value) => setAuthorityFilter(value as 'all' | AuthorityCode)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Authority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All authorities</SelectItem>
            {Object.values(AuthorityCode).map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load fee schedules: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Fee schedules"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/rcm-setup/fee-schedules/new`}>
                <Plus className="mr-2 h-4 w-4" /> New schedule
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No schedules match your search.' : 'No fee schedules defined.'}
          onRowClick={(row) => router.push(`/${locale}/rcm-setup/fee-schedules/${row.id}`)}
        />
      )}
    </div>
  );
}
