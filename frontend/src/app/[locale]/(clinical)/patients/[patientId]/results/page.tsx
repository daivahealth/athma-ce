'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePatientResults } from '@/modules/clinical/hooks/use-reporting';
import { ResultTimeline } from '@/modules/clinical/components/reporting/ResultTimeline';
import { Button } from '@/components/ui/button';
import type { PatientResult } from '@/modules/clinical/types/reporting';

export default function PatientResultsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePatientResults(patientId, {
    type: typeFilter,
    page,
    limit: 20,
  });

  const handleResultClick = (result: PatientResult) => {
    const locale = params.locale || 'en';
    router.push(`/${locale}/results/${result.reportType}/${result.orderId}`);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Patient Results</h1>
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
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading results...</div>
      ) : (
        <>
          <ResultTimeline
            results={data?.results || []}
            onResultClick={handleResultClick}
          />

          {data && data.total > 20 && (
            <div className="flex justify-center gap-2 mt-6">
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
        </>
      )}
    </div>
  );
}
