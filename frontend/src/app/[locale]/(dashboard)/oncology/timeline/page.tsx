'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Search, GitCommitHorizontal, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOncologyRegistry } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import type { CancerDiagnosis, OncologyPatientDisplay } from '@/plugins/oncology/types';

export default function CancerTimelineListPage() {
  const router = useRouter();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useOncologyRegistry({
    search: searchQuery || undefined,
  });

  const entries: CancerDiagnosis[] = data?.data ?? [];

  // Deduplicate by patient_id so each patient appears once
  const seen = new Set<string>();
  const patients = entries.filter((e) => {
    if (seen.has(e.patient_id)) return false;
    seen.add(e.patient_id);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cancer Timeline</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a patient to view their complete cancer journey
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient name or MRN..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <UserRound className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {data ? 'No patients match the search' : 'No cancer patients registered yet'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Patient</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Primary Site</th>
                <th className="text-left p-3 font-medium">Clinical Status</th>
                <th className="text-left p-3 font-medium">Diagnosis Date</th>
                <th className="p-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {patients.map((entry) => (
                <tr
                  key={entry.patient_id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/${locale}/oncology/timeline/${entry.patient_id}`)}
                >
                  <td className="p-3">
                    <PatientCell patientDisplay={entry.patientDisplay} />
                  </td>
                  <td className="p-3 font-medium">{entry.cancer_type}</td>
                  <td className="p-3 text-muted-foreground">{entry.primary_site}</td>
                  <td className="p-3">
                    <StatusBadge status={entry.clinical_status} />
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(entry.diagnosis_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${locale}/oncology/timeline/${entry.patient_id}`);
                      }}
                    >
                      <GitCommitHorizontal className="h-3.5 w-3.5" />
                      View Timeline
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {patients.length} patient{patients.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

function PatientCell({ patientDisplay }: { patientDisplay?: OncologyPatientDisplay }) {
  if (!patientDisplay) return <span className="text-muted-foreground text-xs">—</span>;
  const genderAge = [
    patientDisplay.gender
      ? patientDisplay.gender.charAt(0).toUpperCase() + patientDisplay.gender.slice(1)
      : null,
    patientDisplay.age != null ? `${patientDisplay.age}y` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <div>
      <div className="font-medium">{patientDisplay.displayName}</div>
      <div className="flex items-center gap-2 mt-0.5">
        {patientDisplay.mrn && (
          <span className="text-xs text-muted-foreground">MRN: {patientDisplay.mrn}</span>
        )}
        {genderAge && <span className="text-xs text-muted-foreground">{genderAge}</span>}
      </div>
    </div>
  );
}
