'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWardPatients } from '@/modules/clinical/hooks/use-inpatient';

export default function WardPatientsPage({ params }: { params: { locale: string; wardId: string } }) {
  const { data, isLoading } = useWardPatients(params.wardId);
  const admissions = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ward Patients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading patients...</p>}
        {!isLoading && admissions.length === 0 && (
          <p className="text-sm text-muted-foreground">No patients found.</p>
        )}
        {!isLoading && admissions.length > 0 && (
          <div className="divide-y rounded-md border">
            {admissions.map((admission: any, index: number) => (
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
        )}
      </CardContent>
    </Card>
  );
}
