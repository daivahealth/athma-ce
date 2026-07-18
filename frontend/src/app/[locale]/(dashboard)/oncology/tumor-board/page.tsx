'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Search, Users } from 'lucide-react';
import { useTumorBoardCases } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';
import { PageHeader } from '@/components/ui/page-header';
import type { TumorBoardCase, OncologyPatientDisplay } from '@/plugins/oncology/types';

export default function TumorBoardPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useTumorBoardCases(statusFilter ? { status: statusFilter } : undefined);
  const allCases: TumorBoardCase[] = data?.data ?? [];

  const cases = allCases.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.cancer_type?.toLowerCase().includes(q) ||
      c.primary_site?.toLowerCase().includes(q) ||
      c.mdt_recommendation?.toLowerCase().includes(q) ||
      c.treatment_intent?.toLowerCase().includes(q) ||
      c.patientDisplay?.displayName.toLowerCase().includes(q) ||
      c.patientDisplay?.mrn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Tumor Board"
        subtitle="Multi-disciplinary team (MDT) case reviews and treatment decisions"
        icon={Users}
        actions={
          <Button onClick={() => router.push(`/${params.locale}/oncology/tumor-board/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Case
          </Button>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, cancer type, recommendation..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter || 'all'}
          onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="deferred">Deferred</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {allCases.length === 0 ? 'No tumor board cases yet' : 'No cases match the current filters'}
          </p>
          {allCases.length === 0 && (
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/tumor-board/new`)}>
              <Plus className="h-4 w-4 mr-2" />Schedule First Case
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
                <th className="text-left p-3 font-medium">Meeting Date</th>
                <th className="text-left p-3 font-medium">Attendees</th>
                <th className="text-left p-3 font-medium">Treatment Intent</th>
                <th className="text-left p-3 font-medium">MDT Recommendation</th>
                <th className="text-left p-3 font-medium">Outcome</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3"><PatientCell patientDisplay={c.patientDisplay} /></td>
                  <td className="p-3">
                    <div className="font-medium">{c.cancer_type || '—'}</div>
                    {c.primary_site && <div className="text-xs text-muted-foreground">{c.primary_site}</div>}
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(c.meeting_date).toLocaleDateString()}
                  </td>
                  <td className="p-3"><AttendeesSummary attendees={c.attendees} /></td>
                  <td className="p-3">
                    {c.treatment_intent
                      ? <TreatmentIntentBadge intent={c.treatment_intent} />
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[200px]">
                    <p className="truncate" title={c.mdt_recommendation ?? undefined}>
                      {c.mdt_recommendation || <span className="italic">Pending</span>}
                    </p>
                  </td>
                  <td className="p-3">
                    {c.review_outcome ? <OutcomeBadge outcome={c.review_outcome} /> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => router.push(`/${params.locale}/oncology/tumor-board/${c.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {cases.length} case{cases.length !== 1 ? 's' : ''}
            {cases.length !== allCases.length && ` (filtered from ${allCases.length})`}
          </div>
        </div>
      )}
    </div>
  );
}

function PatientCell({ patientDisplay }: { patientDisplay?: OncologyPatientDisplay }) {
  if (!patientDisplay) return <span className="text-muted-foreground text-xs">—</span>;
  const genderAge = [
    patientDisplay.gender ? patientDisplay.gender.charAt(0).toUpperCase() + patientDisplay.gender.slice(1) : null,
    patientDisplay.age != null ? `${patientDisplay.age}y` : null,
  ].filter(Boolean).join(' · ');
  return (
    <div>
      <div className="font-medium">{patientDisplay.displayName}</div>
      <div className="flex items-center gap-2 mt-0.5">
        {patientDisplay.mrn && <span className="text-xs text-muted-foreground">MRN: {patientDisplay.mrn}</span>}
        {genderAge && <span className="text-xs text-muted-foreground">{genderAge}</span>}
      </div>
    </div>
  );
}

function AttendeesSummary({ attendees }: { attendees: TumorBoardCase['attendees'] }) {
  if (!attendees || attendees.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const shown = attendees.slice(0, 2);
  const rest = attendees.length - 2;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((a, i) => (
        <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded" title={a.specialty}>
          {a.role || a.specialty}
        </span>
      ))}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
    </div>
  );
}

const OUTCOME_STYLES: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  deferred_for_more_info: 'bg-yellow-100 text-yellow-700',
  second_opinion: 'bg-orange-100 text-orange-700',
  clinical_trial: 'bg-blue-100 text-blue-700',
};
const OUTCOME_LABELS: Record<string, string> = {
  approved: 'Approved', deferred_for_more_info: 'More Info Needed',
  second_opinion: 'Second Opinion', clinical_trial: 'Clinical Trial',
};

function OutcomeBadge({ outcome }: { outcome: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${OUTCOME_STYLES[outcome] ?? 'bg-gray-100 text-gray-600'}`}>
      {OUTCOME_LABELS[outcome] ?? outcome.replace(/_/g, ' ')}
    </span>
  );
}
