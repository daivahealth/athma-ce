'use client';

import { useParams } from 'next/navigation';
import { LabOperationsWorkspace } from '@/modules/clinical/components/lab-operations/LabOperationsWorkspace';

export default function LabOperationsPage() {
  const params = useParams();
  const locale = params.locale as string;

  return <LabOperationsWorkspace locale={locale} />;
}
