'use client';

import { useParams, useRouter } from 'next/navigation';
import { ClipboardPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EncounterPicker } from '@/modules/clinical/components/encounter-picker';
import { EncounterStatus } from '@/modules/clinical/types/encounter';

/**
 * CPOE landing — lets nurses and front-desk staff find an encounter and enter
 * orders on behalf of the ordering physician, without opening the charting workspace.
 */
export default function CpoeLandingPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Entry (CPOE)</h1>
        <p className="text-muted-foreground">
          Place lab, imaging, procedure and package orders for an encounter — including verbal, telephone
          or written orders entered on behalf of a physician.
        </p>
      </div>

      <EncounterPicker
        description="Search by patient name or MRN, then place orders for the encounter."
        renderActions={(encounter) => (
          <Button
            size="sm"
            onClick={() => router.push(`/${params.locale}/cpoe/${encounter.id}`)}
            disabled={
              encounter.status === EncounterStatus.FINISHED ||
              encounter.status === EncounterStatus.CANCELLED
            }
          >
            <ClipboardPlus className="mr-2 h-4 w-4" />
            Place orders
          </Button>
        )}
      />
    </div>
  );
}
