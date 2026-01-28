'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Eye } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreateTemplateDialog } from './_components/create-template-dialog';
import { useChecklistTemplates } from '@/modules/clinical/hooks/use-checklists';
import type { ChecklistTemplate } from '@/modules/clinical/types/checklist';
import { ChecklistTemplateStatus, ChecklistCategory } from '@/modules/clinical/types/checklist';

const statusVariant: Record<ChecklistTemplateStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [ChecklistTemplateStatus.ACTIVE]: 'default',
  [ChecklistTemplateStatus.DRAFT]: 'secondary',
  [ChecklistTemplateStatus.DEPRECATED]: 'outline',
  [ChecklistTemplateStatus.ARCHIVED]: 'outline',
};

const createColumns = (
  router: ReturnType<typeof useRouter>,
  locale: string
): ColumnDef<ChecklistTemplate>[] => [
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
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-xs font-medium uppercase tracking-wide">{getValue<ChecklistCategory>()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<ChecklistTemplateStatus>();
        return (
          <Badge variant={statusVariant[status]} className="text-xs capitalize">
            {status.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ getValue }) => `v${getValue<number>()}`,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last updated',
      cell: ({ getValue }) => {
        const value = getValue<string | undefined>();
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
          onClick={() => router.push(`/${locale}/catalogs/checklists/${row.original.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

export default function ChecklistTemplatesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ChecklistTemplateStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ChecklistCategory>('all');
  const [applicabilityFilter, setApplicabilityFilter] = useState<'all' | 'inpatient' | 'outpatient'>('all');

  const filters = useMemo(() => {
    const value: Record<string, unknown> = {};
    if (statusFilter !== 'all') value.status = statusFilter;
    if (categoryFilter !== 'all') value.category = categoryFilter;
    if (applicabilityFilter === 'inpatient') value.applicableToInpatient = true;
    if (applicabilityFilter === 'outpatient') value.applicableToOutpatient = true;
    return value;
  }, [statusFilter, categoryFilter, applicabilityFilter]);

  const { data: response, isLoading } = useChecklistTemplates(filters);
  const templates = response?.data || [];
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/${locale}/catalogs`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to catalogs
      </Button>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Checklist Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable clinical checklists and auto-create rules for inpatient workflows.
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as 'all' | ChecklistTemplateStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(ChecklistTemplateStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as 'all' | ChecklistCategory)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.values(ChecklistCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category.toLowerCase().replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={applicabilityFilter}
          onValueChange={(value) => setApplicabilityFilter(value as 'all' | 'inpatient' | 'outpatient')}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="inpatient">Inpatient</SelectItem>
            <SelectItem value="outpatient">Outpatient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResourceTable
        data={filteredTemplates}
        columns={createColumns(router, locale)}
        isLoading={isLoading}
        emptyState="No checklist templates found."
        cta={null}
      />
    </div>
  );
}
