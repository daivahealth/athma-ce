'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNoteTemplates, useNoteTemplateStats } from '@/modules/foundation/hooks/use-catalogs';
import type { NoteTemplate } from '@/modules/foundation/types/catalog';
import { TemplateStatus, NoteTemplateType } from '@/modules/foundation/types/catalog';

const statusLabels: Record<TemplateStatus, string> = {
  [TemplateStatus.ACTIVE]: 'Active',
  [TemplateStatus.INACTIVE]: 'Inactive',
  [TemplateStatus.ARCHIVED]: 'Archived',
};

const statusVariant: Record<TemplateStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [TemplateStatus.ACTIVE]: 'default',
  [TemplateStatus.INACTIVE]: 'secondary',
  [TemplateStatus.ARCHIVED]: 'outline',
};

const templateTypeLabels: Record<NoteTemplateType, string> = {
  [NoteTemplateType.GENERAL]: 'General',
  [NoteTemplateType.SOAP]: 'SOAP Note',
  [NoteTemplateType.DISCHARGE_SUMMARY]: 'Discharge Summary',
  [NoteTemplateType.PROGRESS_NOTE]: 'Progress Note',
  [NoteTemplateType.ADMISSION_NOTE]: 'Admission Note',
  [NoteTemplateType.CONSULTATION]: 'Consultation',
  [NoteTemplateType.OPERATIVE_NOTE]: 'Operative Note',
  [NoteTemplateType.PROCEDURE_NOTE]: 'Procedure Note',
  [NoteTemplateType.PHYSICAL_THERAPY]: 'Physical Therapy',
  [NoteTemplateType.OCCUPATIONAL_THERAPY]: 'Occupational Therapy',
  [NoteTemplateType.NURSING_NOTE]: 'Nursing Note',
  [NoteTemplateType.PSYCHIATRIC_EVALUATION]: 'Psychiatric Evaluation',
  [NoteTemplateType.EMERGENCY_DEPARTMENT]: 'Emergency Department',
  [NoteTemplateType.FOLLOW_UP]: 'Follow-up',
  [NoteTemplateType.TRANSFER_NOTE]: 'Transfer Note',
  [NoteTemplateType.DEATH_NOTE]: 'Death Note',
  [NoteTemplateType.OTHER]: 'Other',
};

const createColumns = (
  router: ReturnType<typeof useRouter>,
  locale: string
): ColumnDef<NoteTemplate>[] => [
  {
    accessorKey: 'name',
    header: 'Template',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{row.original.description}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'templateType',
    header: 'Type',
    cell: ({ getValue }) => {
      const type = getValue<NoteTemplateType>();
      return (
        <Badge variant="outline" className="text-xs">
          {templateTypeLabels[type]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'specialtyId',
    header: 'Specialty',
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? <span className="font-mono text-xs">{value}</span> : 'All specialties';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<TemplateStatus>();
      return (
        <Badge variant={statusVariant[status]} className="text-xs capitalize">
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'currentVersion',
    header: 'Version',
    cell: ({ getValue }) => `v${getValue<number>()}`,
  },
  {
    id: 'scope',
    header: 'Scope',
    cell: ({ row }) => (
      <span className="text-xs font-medium uppercase tracking-wide">
        {row.original.tenantId ? 'Tenant' : 'Global'}
      </span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : '—';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/catalogs/note-templates/${row.original.id}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    ),
  },
];

export default function NoteTemplatesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TemplateStatus>('all');
  const [templateTypeFilter, setTemplateTypeFilter] = useState<'all' | NoteTemplateType>('all');

  const apiFilters = useMemo(() => {
    const filters: any = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (templateTypeFilter !== 'all') filters.templateType = templateTypeFilter;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [statusFilter, templateTypeFilter]);

  const {
    data: templates,
    isLoading,
    error,
  } = useNoteTemplates(apiFilters);
  const { data: stats } = useNoteTemplateStats();

  const sanitizedTemplates = templates ?? [];
  const filteredTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitizedTemplates;
    return sanitizedTemplates.filter((template) => {
      const haystack = `${template.name} ${template.description ?? ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [sanitizedTemplates, search]);

  const columns = useMemo(() => createColumns(router, locale), [router, locale]);

  const statusCardData = [
    {
      label: 'Total templates',
      value: stats?.total ?? sanitizedTemplates.length ?? '—',
    },
    {
      label: 'Active templates',
      value: stats?.byStatus?.[TemplateStatus.ACTIVE] ?? 0,
    },
    {
      label: 'Tenant-owned',
      value: stats?.tenantOwned ?? sanitizedTemplates.filter((t) => t.tenantId).length,
    },
    {
      label: 'Global defaults',
      value: stats?.global ?? sanitizedTemplates.filter((t) => !t.tenantId).length,
    },
  ];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/catalogs`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to catalogs
      </Button>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as 'all' | TemplateStatus)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={TemplateStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={TemplateStatus.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={TemplateStatus.ARCHIVED}>Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={templateTypeFilter}
          onValueChange={(value) => setTemplateTypeFilter(value as 'all' | NoteTemplateType)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value={NoteTemplateType.SOAP}>SOAP Note</SelectItem>
            <SelectItem value={NoteTemplateType.DISCHARGE_SUMMARY}>Discharge Summary</SelectItem>
            <SelectItem value={NoteTemplateType.PROGRESS_NOTE}>Progress Note</SelectItem>
            <SelectItem value={NoteTemplateType.ADMISSION_NOTE}>Admission Note</SelectItem>
            <SelectItem value={NoteTemplateType.CONSULTATION}>Consultation</SelectItem>
            <SelectItem value={NoteTemplateType.OPERATIVE_NOTE}>Operative Note</SelectItem>
            <SelectItem value={NoteTemplateType.PROCEDURE_NOTE}>Procedure Note</SelectItem>
            <SelectItem value={NoteTemplateType.PHYSICAL_THERAPY}>Physical Therapy</SelectItem>
            <SelectItem value={NoteTemplateType.OCCUPATIONAL_THERAPY}>Occupational Therapy</SelectItem>
            <SelectItem value={NoteTemplateType.NURSING_NOTE}>Nursing Note</SelectItem>
            <SelectItem value={NoteTemplateType.GENERAL}>General</SelectItem>
            <SelectItem value={NoteTemplateType.OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCardData.map((card) => (
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

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load note templates: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Note Templates"
          cta={
            <Button asChild size="sm">
              <Link href={`/${locale}/catalogs/note-templates/new`}>
                <Plus className="mr-2 h-4 w-4" /> New template
              </Link>
            </Button>
          }
          columns={columns}
          data={filteredTemplates}
          isLoading={isLoading}
          emptyState={search ? 'No templates match your search.' : 'No templates found.'}
          onRowClick={(template) => router.push(`/${locale}/catalogs/note-templates/${template.id}`)}
        />
      )}
    </div>
  );
}
