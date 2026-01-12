'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTenant, useTenants } from '@/hooks/use-tenants';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import { FacilityHierarchyTree } from '@/components/structure/facility-hierarchy';

export default function TenantDetailPage({
  params,
}: {
  params: { locale: string; tenantId: string };
}) {
  const { data: tenant, isLoading: tenantLoading } = useTenant(params.tenantId);
  const { data: fallbackTenants = [] } = useTenants();
  const resolvedTenant = tenant ?? fallbackTenants.find((item) => item.id === params.tenantId);
  const { data: facilities = [], isLoading: facilitiesLoading } = useTenantFacilities(params.tenantId, {
    enabled: !!resolvedTenant,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${params.locale}/tenants`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {resolvedTenant?.name ?? 'Tenant'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {resolvedTenant?.domain ?? 'Tenant hierarchy and facility structure.'}
        </p>
      </div>

      {tenantLoading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading tenant...</p>
      )}

      {!tenantLoading && facilitiesLoading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading facilities...</p>
      )}

      {!tenantLoading && !facilitiesLoading && facilities.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No facilities found for this tenant.
        </div>
      )}

      <div className="space-y-4">
        {facilities.map((facility) => (
          <FacilityHierarchyTree key={facility.id} facility={facility} defaultOpen />
        ))}
      </div>
    </div>
  );
}
