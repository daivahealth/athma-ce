'use client';

import { useState } from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import type { Tenant } from '@/hooks/use-tenants';
import { FacilityHierarchyTree } from '@/components/structure/facility-hierarchy';

interface TenantHierarchyProps {
  tenants: Tenant[];
}

export function TenantHierarchy({ tenants }: TenantHierarchyProps) {
  if (!tenants.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No tenants available to display the hierarchy.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant) => (
        <TenantNode key={tenant.id} tenant={tenant} />
      ))}
    </div>
  );
}

function TenantNode({ tenant }: { tenant: Tenant }) {
  const [open, setOpen] = useState(false);
  const { data: facilities = [], isLoading } = useTenantFacilities(tenant.id, { enabled: open });

  return (
    <details
      className="group rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 text-sm">
        <ChevronRight className="mt-1 h-4 w-4 text-slate-400 transition group-open:rotate-90" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-base font-semibold text-slate-900 dark:text-white">{tenant.name}</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{tenant.domain}</span>
        </div>
      </summary>
      <div className="mt-3 space-y-3">
        {isLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading facilities...</p>}
        {!isLoading && facilities.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No facilities found for this tenant.</p>
        )}
        {!isLoading &&
          facilities.map((facility) => (
            <FacilityHierarchyTree key={facility.id} facility={facility} />
          ))}
      </div>
    </details>
  );
}
