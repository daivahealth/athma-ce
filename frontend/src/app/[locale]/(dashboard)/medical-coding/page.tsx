'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Search, Eye } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCodingSessions, usePendingCodingSessions, useCoderProductivity, useCodingSessionSummary } from '@/modules/rcm/hooks/use-medical-coding';
import type { CodingSession } from '@/modules/rcm/types/medical-coding';
import { CodingSessionStatus } from '@/modules/rcm/types/medical-coding';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  [CodingSessionStatus.NEW]: 'secondary',
  [CodingSessionStatus.PENDING]: 'secondary',
  [CodingSessionStatus.IN_REVIEW]: 'outline',
  [CodingSessionStatus.RETURNED]: 'outline',
  [CodingSessionStatus.COMPLETED]: 'default',
  [CodingSessionStatus.SUBMITTED]: 'default',
};

const statusLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<CodingSession>[] => [
  {
    accessorKey: 'patientId',
    header: 'Patient',
    cell: ({ row }) => (
      <div>
        <p className="font-mono text-xs" title={row.original.patientId}>
          {row.original.patientId.slice(0, 8)}…
        </p>
        <p className="text-xs text-muted-foreground">Encounter {row.original.encounterId.slice(0, 6)}…</p>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      const variant = statusVariant[value] || 'secondary';
      return <Badge variant={variant}>{statusLabel(value)}</Badge>;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ getValue }) => getValue<string | null>() || '—',
  },
  {
    accessorKey: 'coderId',
    header: 'Coder',
    cell: ({ getValue }) => getValue<string | null>() || 'Unassigned',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : '—';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/medical-coding/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> Review
      </Button>
    ),
  },
];

export default function MedicalCodingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [queueFilter, setQueueFilter] = useState('');

  const filters = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      queue: queueFilter || undefined,
    }),
    [statusFilter, queueFilter],
  );

  const { data: sessions, isLoading, error } = useCodingSessions(filters);
  const { data: pendingSessions } = usePendingCodingSessions();
  const { data: productivity } = useCoderProductivity();
  const { data: summary } = useCodingSessionSummary();

  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => sessions ?? [], [sessions]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((session) =>
      `${session.patientId} ${session.encounterId}`.toLowerCase().includes(term),
    );
  }, [sanitized, search]);

  const statCards = [
    { label: 'Total sessions', value: summary?.total ?? sanitized.length },
    { label: 'Pending', value: summary?.byStatus?.[CodingSessionStatus.PENDING] ?? 0 },
    { label: 'In review', value: summary?.byStatus?.[CodingSessionStatus.IN_REVIEW] ?? 0 },
    { label: 'Submitted', value: summary?.byStatus?.[CodingSessionStatus.SUBMITTED] ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medical coding</h1>
        <p className="text-muted-foreground">Coder inbox, assignments, and productivity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coder productivity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {productivity && productivity.length > 0 ? (
            productivity.map((stat) => (
              <div key={stat.coderId} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{stat.coderName || stat.coderId}</p>
                  <p className="text-xs text-muted-foreground">{stat.sessionsCompleted} sessions completed</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{stat.diagnosesCoded} diagnoses</p>
                  <p>{stat.proceduresCoded} procedures</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No productivity data.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSessions && pendingSessions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pendingSessions.slice(0, 6).map((session) => (
                <Button
                  key={session.id}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/${locale}/medical-coding/${session.id}`)}
                >
                  {session.patientId.slice(0, 6)}… ({statusLabel(session.status)})
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pending sessions.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or encounter..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(CodingSessionStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Queue"
          value={queueFilter}
          onChange={(event) => setQueueFilter(event.target.value)}
          className="w-[160px]"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load sessions: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Coding sessions"
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No sessions match your search.' : 'No sessions available.'}
          onRowClick={(row) => router.push(`/${locale}/medical-coding/${row.id}`)}
        />
      )}
    </div>
  );
}
