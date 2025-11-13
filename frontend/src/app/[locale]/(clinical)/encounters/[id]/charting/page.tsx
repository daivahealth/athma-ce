'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClinicalNotesForm } from '@/modules/clinical/components/charting/clinical-notes-form';
import { DiagnosisForm } from '@/modules/clinical/components/charting/diagnosis-form';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

function formatAge(date?: string | null) {
  if (!date) return '—';
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return `${age} yrs`;
}

export default function ChartingPage() {
  const params = useParams();
  const encounterId = params.id as string;
  const { data: encounter, isLoading } = useEncounter(encounterId);
  const [expandedPanel, setExpandedPanel] = useState<'notes' | 'diagnoses' | 'orders' | 'prescriptions' | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Loading charting workspace...
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center space-y-2">
        <p className="text-lg font-semibold">Encounter not found</p>
        <p className="text-sm text-muted-foreground">Please return to encounters and select another record.</p>
      </div>
    );
  }

  const patient = encounter.patient;
  const patientName =
    patient?.displayName || `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() || 'Unknown patient';
  const patientGender = patient?.gender ? patient.gender[0].toUpperCase() + patient.gender.slice(1) : '—';
  const patientMrn = patient?.mrn ?? '—';

  const panelContent = {
    notes: {
      title: 'Clinical Notes',
      content: (
        <ClinicalNotesForm
          encounterId={encounterId}
          patientId={encounter.patientId}
          authorStaffId={encounter.primaryStaffId}
        />
      ),
    },
    diagnoses: {
      title: 'Diagnoses',
      content: (
        <DiagnosisForm
          encounterId={encounterId}
          patientId={encounter.patientId}
          addedBy={encounter.primaryStaffId}
        />
      ),
    },
    orders: {
      title: 'Orders',
      content: <p className="text-sm text-muted-foreground">Orders UI coming soon.</p>,
    },
    prescriptions: {
      title: 'Prescriptions',
      content: <p className="text-sm text-muted-foreground">Prescriptions UI coming soon.</p>,
    },
  } as const;

  const renderPanel = (key: keyof typeof panelContent) => {
    const panel = panelContent[key];
    const isExpanded = expandedPanel === key;
    return (
      <Card key={key} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{panel.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpandedPanel(isExpanded ? null : key)}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
        {panel.content}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Charting</CardTitle>
          <CardDescription>Encounter #{encounter.encounterNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <div className="text-muted-foreground">Patient</div>
              <div className="font-medium">{patientName}</div>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-10" />
            <div>
              <div className="text-muted-foreground">Age</div>
              <div className="font-medium">{formatAge(patient?.dateOfBirth)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Gender</div>
              <div className="font-medium">{patientGender}</div>
            </div>
            <div>
              <div className="text-muted-foreground">MRN</div>
              <div className="font-mono">{patientMrn}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Status</div>
              <Badge variant="outline" className="capitalize mt-1">
                {encounter.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {expandedPanel ? (
        <div>{renderPanel(expandedPanel)}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">{renderPanel('notes')}</div>
          <div className="space-y-6">
            {renderPanel('diagnoses')}
            {renderPanel('orders')}
            {renderPanel('prescriptions')}
          </div>
        </div>
      )}
    </div>
  );
}
