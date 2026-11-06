'use client';

import { useParams, useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EncounterPicker } from '@/modules/clinical/components/encounter-picker';
import { EncounterStatus } from '@/modules/clinical/types/encounter';

export default function ChartingLandingPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinical Charting</h1>
        <p className="text-muted-foreground">
          Launch the charting workspace for an active encounter to capture notes, diagnoses, orders, and prescriptions.
        </p>
      </div>

      <EncounterPicker
        description="Search or filter to locate the encounter you need to chart."
        renderActions={(encounter) => (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/${params.locale}/patients-ai/${encounter.patientId}`)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI+
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`/${params.locale}/encounters/${encounter.id}/charting`)}
              disabled={encounter.status === EncounterStatus.FINISHED}
            >
              Open charting
            </Button>
          </>
        )}
      />
    </div>
  );
}
