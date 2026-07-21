'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePatientResults } from '@/modules/clinical/hooks/use-reporting';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { ResultTimeline } from '@/modules/clinical/components/reporting/ResultTimeline';
import { ResultDetailPane } from '@/modules/clinical/components/reporting/ResultDetailPane';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import type { PatientResult } from '@/modules/clinical/types/reporting';

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function PatientResultsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const locale = (params.locale as string) || 'en';

  const { data: patient } = usePatient(patientId);

  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState<PatientResult | null>(null);

  const { data, isLoading } = usePatientResults(patientId, {
    type: typeFilter,
    page,
    limit: 20,
  });

  useEffect(() => {
    if (!data?.results?.length) return;
    const stillPresent = selectedResult && data.results.some((r) => r.id === selectedResult.id);
    if (!stillPresent) {
      setSelectedResult(data.results[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${locale}/patients/${patientId}/care-context`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {patient && (
          <div>
            <h1 className="text-xl font-semibold">
              {patient.firstName} {patient.middleName && `${patient.middleName} `}
              {patient.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                MRN: {patient.mrn}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {calculateAge(patient.dateOfBirth)} years old
              </span>
              <span className="capitalize">{patient.gender}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {['all', 'lab', 'imaging', 'procedure'].map((type) => (
          <Button
            key={type}
            variant={typeFilter === (type === 'all' ? undefined : type) ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setTypeFilter(type === 'all' ? undefined : type);
              setPage(1);
            }}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading results...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[380px_1fr] items-start">
          <div className="space-y-4">
            <ResultTimeline
              results={data?.results || []}
              onResultClick={setSelectedResult}
              selectedResultId={selectedResult?.id}
            />

            {data && data.total > 20 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(data.total / 20)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * 20 >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          <ResultDetailPane result={selectedResult} />
        </div>
      )}
    </div>
  );
}
