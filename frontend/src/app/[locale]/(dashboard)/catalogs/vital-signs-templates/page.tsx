'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Activity, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ResourceTable } from '@/components/tables/resource-table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useVitalSignsTemplates,
  useVitalCareSettings,
  useVitalAgeGroups,
} from '@/modules/clinical/hooks/use-vital-signs-templates';
import type { VitalSignsTemplate } from '@/modules/clinical/types/vital-signs-template';

const careSettingLabels: Record<string, string> = {
  OPD: 'OPD',
  ER: 'ER',
  IPD: 'IPD',
  ICU: 'ICU',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

const ageGroupLabels: Record<string, string> = {
  newborn: 'Newborn',
  infant: 'Infant',
  child: 'Child',
  adolescent: 'Adolescent',
  adult: 'Adult',
  elderly: 'Elderly',
  all: 'All',
};

const createColumns = (locale: string): ColumnDef<VitalSignsTemplate>[] => [
  {
    accessorKey: 'name',
    header: 'Template',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name?.en ?? '—'}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.templateCode}</p>
      </div>
    ),
  },
  {
    accessorKey: 'careSetting',
    header: 'Care Settings',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.careSetting.map((setting) => (
          <Badge key={setting} variant="secondary" className="text-xs">
            {careSettingLabels[setting] || setting}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'ageGroup',
    header: 'Age Groups',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.ageGroup.map((age) => (
          <Badge key={age} variant="outline" className="text-xs">
            {ageGroupLabels[age] || age}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'specialties',
    header: 'Specialties',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.specialties?.length || 0} mapped</span>
    ),
  },
  {
    accessorKey: 'version',
    header: 'Version',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">v{row.original.version}</Badge>
        {row.original.isDefault && <Badge variant="default">Default</Badge>}
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link href={`/${locale}/catalogs/vital-signs-templates/${row.original.id}`}>
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </button>
      </Link>
    ),
  },
];

export default function VitalSignsTemplatesPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [careSetting, setCareSetting] = useState<string>('all');
  const [ageGroup, setAgeGroup] = useState<string>('all');
  const [status, setStatus] = useState<string>('active');
  const [isDefault, setIsDefault] = useState<string>('all');

  const { data: careSettings } = useVitalCareSettings();
  const { data: ageGroups } = useVitalAgeGroups();

  const { data: templates, isLoading, error } = useVitalSignsTemplates({
    search: search || undefined,
    careSetting: careSetting !== 'all' ? (careSetting as VitalSignsTemplate['careSetting'][number]) : undefined,
    ageGroup: ageGroup !== 'all' ? (ageGroup as VitalSignsTemplate['ageGroup'][number]) : undefined,
    isActive: status === 'all' ? undefined : status === 'active',
    isDefault: isDefault === 'all' ? undefined : isDefault === 'default',
  });

  const columns = useMemo(() => createColumns(locale), [locale]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or code..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={careSetting} onValueChange={(value) => setCareSetting(value)}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Care setting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All care settings</SelectItem>
            {careSettings?.map((setting) => (
              <SelectItem key={setting} value={setting}>
                {careSettingLabels[setting] || setting}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value)}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Age group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All age groups</SelectItem>
            {ageGroups?.map((age) => (
              <SelectItem key={age} value={age}>
                {ageGroupLabels[age] || age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={isDefault} onValueChange={(value) => setIsDefault(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="default">Default only</SelectItem>
            <SelectItem value="non-default">Non-default</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load vital signs templates: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Vital Signs Templates"
          columns={columns}
          data={templates ?? []}
          isLoading={isLoading}
          emptyState="No templates match your filters."
          cta={
            <Link href={`/${locale}/catalogs/vital-signs-templates/new`}>
              <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <Activity className="h-4 w-4" />
                New vital signs template
              </button>
            </Link>
          }
        />
      )}
    </div>
  );
}
