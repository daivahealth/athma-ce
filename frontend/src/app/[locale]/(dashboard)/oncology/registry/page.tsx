'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { FileSearch, Pencil, Plus, Search, UserRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOncologyRegistry, useRegistryCandidates } from '@/plugins/oncology/hooks/use-oncology';
import { RegistryCandidateQueue } from '@/plugins/oncology/components/RegistryCandidateQueue';
import { LoadingState, StatusBadge, PatientCell } from '@/plugins/oncology/components/shared';
import { PageHeader } from '@/components/ui/page-header';
import { ListPagination } from '@/components/ui/list-pagination';
import type { CancerDiagnosis } from '@/plugins/oncology/types';
import { formatDayMonthYear } from '@/plugins/oncology/lib/treatment-day';

const PAGE_SIZE = 20;

export default function OncologyRegistryPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicalStatusFilter, setClinicalStatusFilter] = useState('');
  const [tab, setTab] = useState(useSearchParams().get('tab') === 'candidates' ? 'candidates' : 'registered');
  const [strengthFilter, setStrengthFilter] = useState('');
  const [page, setPage] = useState(1);

  // Candidate queue: unregistered patients whose recent results suggest cancer.
  const { data: candidateData, isLoading: candidatesLoading } = useRegistryCandidates({
    search: searchQuery || undefined,
    strength: strengthFilter || undefined,
  });
  const candidates = candidateData?.data ?? [];
  // Badge count is unfiltered so it does not change while the user types a search.
  const { data: allCandidates } = useRegistryCandidates();
  const candidateCount = allCandidates?.total ?? 0;
  const goNew = (patientId?: string) =>
    router.push(`/${params.locale}/oncology/registry/new${patientId ? `?patientId=${patientId}` : ''}`);

  const { data, isLoading } = useOncologyRegistry({
    search: searchQuery || undefined,
    clinicalStatus: clinicalStatusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const entries: CancerDiagnosis[] = data?.data ?? [];

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Oncology Registry"
        subtitle="All registered cancer patients with diagnosis and staging summary"
        icon={UserRound}
        actions={
          <Button variant="outline" onClick={() => goNew()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Manually
          </Button>
        }
      />

      {candidateCount > 0 && tab === 'registered' && (
        <button
          type="button"
          onClick={() => setTab('candidates')}
          className="flex w-full items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900 hover:bg-amber-100 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <FileSearch className="h-4 w-4 shrink-0" />
          <span>
            <strong>{candidateCount} patient{candidateCount !== 1 ? 's' : ''}</strong> ha{candidateCount !== 1 ? 've' : 's'} results
            that suggest cancer and {candidateCount !== 1 ? 'are' : 'is'} not in the registry yet. Review candidates →
          </span>
        </button>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="candidates" className="gap-2">
            Candidates
            {candidateCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 text-[11px] font-semibold leading-4 text-white">{candidateCount}</span>
            )}
          </TabsTrigger>
        </TabsList>

      <div className="flex gap-3 flex-wrap mt-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or MRN..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        {tab === 'candidates' ? (
          <Select value={strengthFilter || 'all'} onValueChange={(v) => setStrengthFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Evidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All evidence</SelectItem>
              <SelectItem value="high">Confirmed</SelectItem>
              <SelectItem value="medium">Suspected</SelectItem>
              <SelectItem value="low">Indicative</SelectItem>
            </SelectContent>
          </Select>
        ) : (
        <Select
          value={clinicalStatusFilter || 'all'}
          onValueChange={(v) => { setClinicalStatusFilter(v === 'all' ? '' : v); setPage(1); }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Clinical status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="remission">Remission</SelectItem>
            <SelectItem value="recurrence">Recurrence</SelectItem>
            <SelectItem value="relapsed">Relapsed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        )}
      </div>

      <TabsContent value="candidates" className="mt-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Patients not yet in the registry whose finalised results from the last 6 months suggest cancer. Review the
          evidence, then add the patient to the registry or dismiss the finding.
        </p>
        <RegistryCandidateQueue
          candidates={candidates}
          isLoading={candidatesLoading}
          onAdd={(c) => goNew(c.patientId)}
        />
      </TabsContent>

      <TabsContent value="registered" className="mt-4">
      {isLoading ? (
        <LoadingState />
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <UserRound className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {data ? 'No patients match the current filters' : 'No cancer diagnoses registered yet'}
          </p>
          {candidateCount > 0 ? (
            <Button onClick={() => setTab('candidates')}>
              <FileSearch className="h-4 w-4 mr-2" />
              Review {candidateCount} Candidate{candidateCount !== 1 ? 's' : ''}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => goNew()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Patient
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
                <th className="text-left p-3 font-medium">Primary Site</th>
                <th className="text-left p-3 font-medium">Stage</th>
                <th className="text-left p-3 font-medium">Metastatic</th>
                <th className="text-left p-3 font-medium">Clinical Status</th>
                <th className="text-left p-3 font-medium">Diagnosis Date</th>
                <th className="text-left p-3 font-medium">Care Plan</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/${params.locale}/oncology/registry/${entry.patient_id}`)}
                >
                  <td className="p-3">
                    <PatientCell patientDisplay={entry.patientDisplay} />
                  </td>
                  <td className="p-3 font-medium">{entry.cancer_type}</td>
                  <td className="p-3 text-muted-foreground">{entry.primary_site}</td>
                  <td className="p-3">
                    {entry.latest_stage ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        Stage {entry.latest_stage}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not staged</span>
                    )}
                  </td>
                  <td className="p-3">
                    <MetastaticBadge status={entry.metastatic_status} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={entry.clinical_status} />
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {entry.diagnosis_date ? formatDayMonthYear(String(entry.diagnosis_date)) : '—'}
                  </td>
                  <td className="p-3">
                    {entry.care_plan_status ? (
                      <StatusBadge status={entry.care_plan_status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      aria-label="Edit diagnosis"
                      onClick={(e) => { e.stopPropagation(); router.push(`/${params.locale}/oncology/registry/diagnosis/${entry.id}/edit`); }}
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
            total={data?.pagination?.total ?? entries.length}
            onPageChange={setPage}
            itemLabel="registry entries"
          />
        </div>
      )}
      </TabsContent>
      </Tabs>
    </div>
  );
}


function MetastaticBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    localized: 'bg-green-100 text-green-700',
    regional: 'bg-yellow-100 text-yellow-700',
    distant: 'bg-red-100 text-red-700',
    unknown: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
