'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CalendarClock, FileText, Pencil, Plus, Search } from 'lucide-react';
import { useOncologyCarePlans } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, PatientCell, StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';
import { ToneBadge } from '@/components/ui/tone-badge';
import { treatmentModalityTone } from '@/plugins/oncology/lib/oncology-tone';
import { PageHeader } from '@/components/ui/page-header';
import { ListPagination } from '@/components/ui/list-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { OncologyCarePlan } from '@/plugins/oncology/types';

const PAGE_SIZE = 20;

export default function CarePlansPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchQuery.trim(), 300);

  // Search runs server-side (plan #, patient, MRN, cancer type, site, notes) so it covers every page.
  const { data, isLoading } = useOncologyCarePlans({
    status: statusFilter || undefined,
    treatmentIntent: intentFilter || undefined,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const plans: OncologyCarePlan[] = data?.data ?? [];
  const hasFilters = !!(statusFilter || intentFilter || search);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Oncology Care Plans"
        subtitle="Treatment plans linking diagnosis, staging, and planned modalities"
        icon={FileText}
        actions={
          <Button onClick={() => router.push(`/${params.locale}/oncology/care-plans/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Care Plan
          </Button>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, MRN, plan number, cancer type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="revised">Revised</SelectItem>
          </SelectContent>
        </Select>
        <Select value={intentFilter || 'all'} onValueChange={(v) => { setIntentFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Treatment intent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All intents</SelectItem>
            <SelectItem value="curative">Curative</SelectItem>
            <SelectItem value="adjuvant">Adjuvant</SelectItem>
            <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
            <SelectItem value="palliative">Palliative</SelectItem>
            <SelectItem value="surveillance">Surveillance</SelectItem>
            <SelectItem value="supportive">Supportive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {hasFilters ? 'No plans match the current filters' : 'No care plans yet'}
          </p>
          {!hasFilters && (
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/care-plans/new`)}>
              <Plus className="h-4 w-4 mr-2" />Create First Plan
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Patient</th>
                <th className="text-left p-3 font-medium">Plan #</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Treatment Intent</th>
                <th className="text-left p-3 font-medium">Subspecialty</th>
                <th className="text-left p-3 font-medium">Modalities</th>
                <th className="text-left p-3 font-medium">Cycles</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Version</th>
                <th className="p-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3"><PatientCell patientDisplay={plan.patientDisplay} /></td>
                  <td className="p-3 font-medium font-mono text-xs whitespace-nowrap">{plan.plan_number}</td>
                  <td className="p-3">
                    <div className="font-medium">{plan.cancer_type || '—'}</div>
                    {plan.primary_site && <div className="text-xs text-muted-foreground">{plan.primary_site}</div>}
                  </td>
                  <td className="p-3"><TreatmentIntentBadge intent={plan.treatment_intent} /></td>
                  <td className="p-3 text-muted-foreground capitalize text-xs">
                    {plan.oncology_subspecialty ? plan.oncology_subspecialty.replace(/_/g, ' ') : '—'}
                  </td>
                  <td className="p-3"><ModalitiesSummary modalities={plan.planned_modalities} /></td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {plan.planned_cycles ? `${plan.planned_cycles} × ${plan.cycle_duration_days ?? '?'}d` : '—'}
                  </td>
                  <td className="p-3"><StatusBadge status={plan.status} /></td>
                  <td className="p-3 text-muted-foreground text-xs">v{plan.version}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {plan.planned_modalities?.some((m) => m.modality === 'chemotherapy') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          title="Treatment schedule"
                          aria-label={`Treatment schedule for ${plan.plan_number}`}
                          onClick={() => router.push(`/${params.locale}/oncology/treatment-plans?carePlanId=${plan.id}`)}
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        aria-label={`Edit ${plan.plan_number}`}
                        onClick={() => router.push(`/${params.locale}/oncology/care-plans/${plan.id}/edit`)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ListPagination
            className="bg-muted/20 border-t"
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.pagination?.total ?? plans.length}
            onPageChange={setPage}
            itemLabel="plans"
          />
        </div>
      )}
    </div>
  );
}

function ModalitiesSummary({ modalities }: { modalities: OncologyCarePlan['planned_modalities'] }) {
  if (!modalities?.length) return <span className="text-xs text-muted-foreground">None</span>;
  // Plans saved before per-modality schedules store bare modality names.
  const shown = modalities
    .slice(0, 3)
    .map((m) => (typeof m === 'string' ? { modality: m as string, protocolCode: undefined } : m));
  const rest = modalities.length - 3;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((m, i) => (
        <ToneBadge key={i} tone={treatmentModalityTone(m.modality)} className="capitalize">
          {m.modality}
          {m.protocolCode && <span className="normal-case font-mono ml-1 opacity-75">({m.protocolCode})</span>}
        </ToneBadge>
      ))}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
    </div>
  );
}
