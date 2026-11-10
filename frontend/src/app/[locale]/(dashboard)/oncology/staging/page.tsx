'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Search, Target } from 'lucide-react';
import { useStagings } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, PatientCell } from '@/plugins/oncology/components/shared';
import { PageHeader } from '@/components/ui/page-header';
import { ListPagination } from '@/components/ui/list-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { TumorStaging } from '@/plugins/oncology/types';

const STAGING_TYPE_LABELS: Record<string, string> = {
  clinical: 'Clinical', pathological: 'Pathological',
  restaging: 'Restaging', recurrence: 'Recurrence',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-success/10 text-success',
  superseded: 'bg-muted text-muted-foreground',
  entered_in_error: 'bg-destructive/10 text-destructive',
};

const PAGE_SIZE = 20;

export default function TumorStagingPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [stagingTypeFilter, setStagingTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchQuery.trim(), 300);

  // Staging type and search run server-side so they cover every page.
  const { data, isLoading } = useStagings({
    stagingType: stagingTypeFilter || undefined,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const stagings: TumorStaging[] = data?.data ?? [];
  const hasFilters = !!(stagingTypeFilter || search);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Tumor Staging"
        subtitle="TNM staging assessments linked to cancer diagnoses"
        icon={Target}
        actions={
          <Button onClick={() => router.push(`/${params.locale}/oncology/staging/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staging
          </Button>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, cancer type, site, stage..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <Select
          value={stagingTypeFilter || 'all'}
          onValueChange={(v) => { setStagingTypeFilter(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Staging type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="clinical">Clinical</SelectItem>
            <SelectItem value="pathological">Pathological</SelectItem>
            <SelectItem value="restaging">Restaging</SelectItem>
            <SelectItem value="recurrence">Recurrence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : stagings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <Target className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {hasFilters ? 'No records match the current filters' : 'No tumor staging records yet'}
          </p>
          {!hasFilters && (
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/staging/new`)}>
              <Plus className="h-4 w-4 mr-2" />Add First Staging
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Patient</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">System</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Stage</th>
                <th className="text-left p-3 font-medium">TNM</th>
                <th className="text-left p-3 font-medium">Grade</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {stagings.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3"><PatientCell patientDisplay={s.patientDisplay} /></td>
                  <td className="p-3">
                    <div className="font-medium">{s.cancer_type || '—'}</div>
                    {s.primary_site && <div className="text-xs text-muted-foreground">{s.primary_site}</div>}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <span>{s.staging_system}</span>
                    {s.staging_edition && <span className="text-xs ml-1 text-muted-foreground/70">({s.staging_edition})</span>}
                  </td>
                  <td className="p-3"><StagingTypeBadge type={s.staging_type} /></td>
                  <td className="p-3">
                    {s.stage_group ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        Stage {s.stage_group}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3"><TnmDisplay t={s.t_category} n={s.n_category} m={s.m_category} /></td>
                  <td className="p-3 text-muted-foreground text-xs">{s.grade || '—'}</td>
                  <td className="p-3 text-muted-foreground">{new Date(s.staging_date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => router.push(`/${params.locale}/oncology/staging/${s.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ListPagination
            className="bg-muted/20 border-t"
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.pagination?.total ?? stagings.length}
            onPageChange={setPage}
            itemLabel="records"
          />
        </div>
      )}
    </div>
  );
}


function StagingTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    clinical: 'bg-blue-100 text-blue-700', pathological: 'bg-purple-100 text-purple-700',
    restaging: 'bg-yellow-100 text-yellow-700', recurrence: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colors[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {STAGING_TYPE_LABELS[type] ?? type}
    </span>
  );
}

function TnmDisplay({ t, n, m }: { t?: string; n?: string; m?: string }) {
  if (!t && !n && !m) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {t ? `T${t}` : 'T?'} {n ? `N${n}` : 'N?'} {m ? `M${m}` : 'M?'}
    </span>
  );
}
