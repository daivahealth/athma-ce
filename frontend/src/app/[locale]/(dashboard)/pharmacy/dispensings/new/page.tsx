'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatientSearchSelect } from '@/components/patient-search-select';

import { useCreateDispensing } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { DispensingSource, DispensingChannel } from '@/modules/pharmacy/types/dispensing';

const SOURCE_OPTIONS = [
  {
    value: DispensingSource.OTC,
    label: 'Over the Counter (OTC)',
    description: 'Direct sale without a prescription',
    Icon: ShoppingBag,
  },
  {
    value: DispensingSource.PAPER_OP,
    label: 'Paper OP Prescription',
    description: 'Paper prescription from outpatient doctor',
    Icon: FileText,
  },
  {
    value: DispensingSource.PAPER_WARD,
    label: 'Paper Ward Prescription',
    description: 'Paper prescription from ward / inpatient',
    Icon: FileText,
  },
];

function channelForSource(source: DispensingSource): DispensingChannel {
  if (source === DispensingSource.PAPER_WARD) return DispensingChannel.INPATIENT_WARD;
  return DispensingChannel.OUTPATIENT_COUNTER;
}

export default function DirectDispensePage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [source, setSource] = useState<DispensingSource>(DispensingSource.OTC);
  const [paperRef, setPaperRef] = useState('');

  const createDispensing = useCreateDispensing();

  const isPaperSource =
    source === DispensingSource.PAPER_OP || source === DispensingSource.PAPER_WARD;

  const handleSubmit = async () => {
    if (!selectedPatient) return;

    const result = await createDispensing.mutateAsync({
      patientId: selectedPatient.id,
      dispensingSource: source,
      dispensingChannel: channelForSource(source),
      patientDisplayName:
        `${selectedPatient.firstName} ${selectedPatient.lastName}`.trim(),
      mrn: selectedPatient.mrn,
      ...(isPaperSource && paperRef ? { paperPrescriptionRef: paperRef } : {}),
    });

    router.push(`/${locale}/pharmacy/dispensings/${result.id}`);
  };

  const canSubmit =
    !!selectedPatient && (!isPaperSource || paperRef.trim().length > 0);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Direct Dispense</h1>
          <p className="text-sm text-muted-foreground">
            Dispense medications for OTC sales or paper prescriptions
          </p>
        </div>
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientSearchSelect
            label=""
            required
            selectedPatient={selectedPatient}
            onSelect={setSelectedPatient}
            onClear={() => setSelectedPatient(null)}
          />
        </CardContent>
      </Card>

      {/* Dispensing Source */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dispensing Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            {SOURCE_OPTIONS.map(({ value, label, description, Icon }) => {
              const isSelected = source === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSource(value)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isSelected ? 'text-primary' : ''}`}>
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                  </div>
                  {isSelected && (
                    <Badge className="mt-0.5" variant="default">
                      Selected
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Paper prescription ref */}
          {isPaperSource && (
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="paper-ref">
                Paper Prescription Reference <span className="text-destructive">*</span>
              </Label>
              <Input
                id="paper-ref"
                placeholder="e.g. RX-2024-001234"
                value={paperRef}
                onChange={(e) => setPaperRef(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The reference number written on the paper prescription
              </p>
            </div>
          )}

          {/* Channel badge */}
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span>Dispensing channel:</span>
            <Badge variant="outline" className="text-xs">
              {source === DispensingSource.PAPER_WARD
                ? 'Inpatient Ward'
                : 'Outpatient Counter'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || createDispensing.isPending}
          className="min-w-36"
        >
          {createDispensing.isPending ? 'Creating...' : 'Create & Process'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {!canSubmit && !selectedPatient && (
        <p className="text-sm text-muted-foreground">Select a patient to continue</p>
      )}
      {!canSubmit && selectedPatient && isPaperSource && !paperRef.trim() && (
        <p className="text-sm text-destructive">Paper prescription reference is required</p>
      )}
    </div>
  );
}
