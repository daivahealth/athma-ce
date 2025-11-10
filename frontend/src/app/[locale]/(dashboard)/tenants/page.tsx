import { TenantsTable } from '@/components/tables/tenants-table';

export default function TenantsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
          { href: `/${params.locale}/tenants`, label: 'Tenants' },
        ]}
      />
      <TenantsTable />
    </div>
  );
}
