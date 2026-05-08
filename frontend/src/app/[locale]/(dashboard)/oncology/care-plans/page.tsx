'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { FileText, Pencil, Plus, Search } from 'lucide-react';
import { useOncologyCarePlans } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';
import type { OncologyCarePlan } from '@/plugins/oncology/types';

export default function CarePlansPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');

  const { data, isLoading } = useOncologyCarePlans(
    statusFilter || intentFilter
      ? { status: statusFilter || undefined, treatmentIntent: intentFilter || undefined }
      : undefined,
  );

  const allPlans: OncologyCarePlan[] = data?.data ?? [];

  const plans = allPlans.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.plan_number?.toLowerCase().includes(q) ||
      p.cancer_type?.toLowerCase().includes(q) ||
      p.primary_site?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Oncology Care Plans</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Treatment plans linking diagnosis, staging, and planned modalities
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/oncology/care-plans/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Care Plan
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plan number, cancer type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
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
        <Select value={intentFilter || 'all'} onValueChange={(v) => setIntentFilter(v === 'all' ? '' : v)}>
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
            {allPlans.length === 0 ? 'No care plans yet' : 'No plans match the current filters'}
          </p>
          {allPlans.length === 0 && (
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
                <th className="text-left p-3 font-medium">Plan #</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Treatment Intent</th>
                <th className="text-left p-3 font-medium">Subspecialty</th>
                <th className="text-left p-3 font-medium">Modalities</th>
                <th className="text-left p-3 font-medium">Cycles</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Version</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium font-mono text-xs">{plan.plan_number}</td>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => router.push(`/${params.locale}/oncology/care-plans/${plan.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {plans.length} plan{plans.length !== 1 ? 's' : ''}
            {plans.length !== allPlans.length && ` (filtered from ${allPlans.length})`}
          </div>
        </div>
      )}
    </div>
  );
}

function ModalitiesSummary({ modalities }: { modalities: OncologyCarePlan['planned_modalities'] }) {
  if (!modalities?.length) return <span className="text-xs text-muted-foreground">None</span>;
  const shown = modalities.slice(0, 3);
  const rest = modalities.length - 3;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((m, i) => (
        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-muted capitalize">{m.modality}</span>
      ))}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
    </div>
  );
}
