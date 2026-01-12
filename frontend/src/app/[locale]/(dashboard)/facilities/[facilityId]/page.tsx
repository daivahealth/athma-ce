'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FacilityHierarchyTree } from '@/components/structure/facility-hierarchy';
import { useFacility } from '@/modules/foundation/hooks/use-facility';

export default function FacilityDetailPage({
  params,
}: {
  params: { locale: string; facilityId: string };
}) {
  const { data: facility, isLoading } = useFacility(params.facilityId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${params.locale}/facilities`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {facility?.name ?? 'Facility'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {facility?.facilityType ?? 'Facility hierarchy and location details.'}
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading facility...</p>
      )}

      {facility && <FacilityHierarchyTree facility={facility} defaultOpen />}
    </div>
  );
}
