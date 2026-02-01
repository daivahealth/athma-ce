'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

interface PatientSearchSelectProps {
  label?: string;
  required?: boolean;
  selectedPatient: any | null;
  onSelect: (patient: any) => void;
  onClear: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PatientSearchSelect({
  label = 'Patient',
  required = false,
  selectedPatient,
  onSelect,
  onClear,
  error,
  placeholder = 'Search by name, MRN, or mobile',
  disabled = false,
}: PatientSearchSelectProps) {
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(patientSearchQuery, 300);

  const { data: patientsData, isLoading: isPatientsLoading } = usePatients(
    {
      search: debouncedSearchQuery,
      limit: 20,
    },
    { enabled: debouncedSearchQuery.trim().length > 0 },
  );

  const patientResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    return (patientsData?.data as any[] | undefined) ?? [];
  }, [debouncedSearchQuery, patientsData]);

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? ' *' : ''}
      </Label>
      {!selectedPatient && (
        <>
          <Input
            placeholder={placeholder}
            value={patientSearchQuery}
            onChange={(event) => {
              setPatientSearchQuery(event.target.value);
            }}
            disabled={disabled}
          />
          {isPatientsLoading && <p className="text-xs text-muted-foreground">Searching patients...</p>}
          {!isPatientsLoading && debouncedSearchQuery.trim() !== '' && patientResults.length === 0 && (
            <p className="text-xs text-muted-foreground">No patients found.</p>
          )}
          {patientResults.length > 0 && (
            <div className="max-h-40 overflow-auto rounded-md border p-2">
              {patientResults.map((patient: any) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => {
                    onSelect(patient);
                    setPatientSearchQuery('');
                  }}
                  className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  disabled={disabled}
                >
                  <span className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    MRN: {patient.mrn} · Mobile: {patient.phoneNumber ?? 'N/A'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {selectedPatient && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3 text-sm">
          <div>
            <p className="font-medium">
              {selectedPatient.firstName} {selectedPatient.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              MRN: {selectedPatient.mrn} · Mobile: {selectedPatient.phoneNumber ?? 'N/A'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClear();
              setPatientSearchQuery('');
            }}
            disabled={disabled}
          >
            Change
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
