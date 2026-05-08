'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Search, UserRound } from 'lucide-react';
import { useOncologyRegistry } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import type { CancerDiagnosis, OncologyPatientDisplay } from '@/plugins/oncology/types';

export default function OncologyRegistryPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicalStatusFilter, setClinicalStatusFilter] = useState('');

  const { data, isLoading } = useOncologyRegistry({
    search: searchQuery || undefined,
    clinicalStatus: clinicalStatusFilter || undefined,
  });

  const entries: CancerDiagnosis[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Oncology Registry</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All registered cancer patients with diagnosis and staging summary
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add to Registry
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or MRN..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={clinicalStatusFilter || 'all'}
          onValueChange={(v) => setClinicalStatusFilter(v === 'all' ? '' : v)}
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
      </div>

      {isLoading ? (
        <LoadingState />
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <UserRound className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {data ? 'No patients match the current filters' : 'No cancer diagnoses registered yet'}
          </p>
          <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Patient
          </Button>
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
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
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
                    {new Date(entry.diagnosis_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {entry.care_plan_status ? (
                      <StatusBadge status={entry.care_plan_status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => router.push(`/${params.locale}/oncology/registry/diagnosis/${entry.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {entries.length} patient{entries.length !== 1 ? 's' : ''}
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
