'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWardBedBoard } from '@/modules/clinical/hooks/use-inpatient';

export default function BedBoardPage({ params }: { params: { locale: string; wardId: string } }) {
  const [includeDischarged, setIncludeDischarged] = useState(false);
  const { data, isLoading } = useWardBedBoard(params.wardId, includeDischarged);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ward Bed Board</CardTitle>
          <Button type="button" variant="outline" onClick={() => setIncludeDischarged((prev) => !prev)}>
            {includeDischarged ? 'Hide Discharged Today' : 'Include Discharged Today'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading bed board...</p>}
          {data && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Ward</p>
                <p className="text-base font-semibold">{(data.ward as any)?.wardName ?? (data.ward as any)?.wardCode ?? 'Ward'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Summary</p>
                <p className="text-base font-semibold">{JSON.stringify(data.summary)}</p>
              </div>
            </div>
          )}
          {data && (
            <div>
              <p className="text-sm font-medium">Admissions</p>
              <div className="mt-2 divide-y rounded-md border">
                {data.admissions.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">No admissions found.</p>
                )}
                {data.admissions.map((admission: any, index: number) => (
                  <div key={admission.id ?? index} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{admission.admissionNumber ?? 'Admission'}</p>
                      <p className="text-sm font-semibold">{admission.patientId ?? 'Patient'}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Bed: {admission.currentBedId ?? 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
