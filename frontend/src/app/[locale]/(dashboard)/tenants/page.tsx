'use client';


import { useParams } from 'next/navigation';import { TenantsTable } from '@/components/tables/tenants-table';

export default function TenantsPage() {
  const params = useParams() as { locale: string };
  return (
    <div className="space-y-6">
      <TenantsTable locale={params.locale} />
    </div>
  );
}
