'use client';

import { useParams } from 'next/navigation';
import { CareContextView } from '@/modules/clinical/components/care-context/care-context-view';

export default function CareContextPage() {
  const params = useParams();
  const locale = params.locale as string;
  const patientId = params.patientId as string;

  return <CareContextView locale={locale} patientId={patientId} />;
}
