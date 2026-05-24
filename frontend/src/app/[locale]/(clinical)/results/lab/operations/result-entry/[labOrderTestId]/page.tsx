'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { LabResultEntryWorkspace } from '@/modules/clinical/components/lab-operations/LabResultEntryWorkspace';

export default function LabOperationsResultEntryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <LabResultEntryWorkspace
      locale={params.locale as string}
      labOrderTestId={params.labOrderTestId as string}
      specimenId={searchParams.get('specimenId') ?? undefined}
    />
  );
}
