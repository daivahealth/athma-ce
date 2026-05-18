'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils';

interface PatientSearchSelectProps {
  selectedPatient?: any | null;
  value?: any | null;
  onSelect: (patient: any) => void;
  onClear: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  /** @deprecated — label is no longer rendered; kept for API compatibility */
  label?: string;
  /** @deprecated — required asterisk is no longer rendered; kept for API compatibility */
  required?: boolean;
}

export function PatientSearchSelect({
  selectedPatient,
  value,
  onSelect,
  onClear,
  error,
  placeholder = 'Search by name, MRN, or mobile',
  disabled = false,
}: PatientSearchSelectProps) {
  const currentPatient = selectedPatient ?? value ?? null;
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(patientSearchQuery, 300);

  // Used to position the portal dropdown under the input
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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

  // Recalculate position whenever results appear or window scrolls/resizes
  useEffect(() => {
    if (patientResults.length === 0) return;

    const recalc = () => {
      if (!inputWrapperRef.current) return;
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };

    recalc();
    window.addEventListener('scroll', recalc, true);
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('scroll', recalc, true);
      window.removeEventListener('resize', recalc);
    };
  }, [patientResults.length]);

  const dropdown =
    patientResults.length > 0 ? (
      <div
        style={dropdownStyle}
        className="max-h-64 overflow-y-auto rounded-xl border border-border/50 bg-background shadow-lg divide-y divide-border/50"
      >
        {patientResults.map((patient: any) => {
          const displayName = patient.fullName || `${patient.firstName} ${patient.lastName}`;
          const gender = patient.gender ? patient.gender[0].toUpperCase() : '—';
          const age = patient.dateOfBirth
            ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31557600000)
            : '—';
          const mrn = patient.mrn || '—';
          const phone = patient.phoneNumber || 'No phone';

          return (
            <button
              key={patient.id}
              type="button"
              onClick={() => {
                onSelect(patient);
                setPatientSearchQuery('');
              }}
              className="flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-all hover:bg-muted/30 border-l-[3px] border-transparent hover:border-primary/50 group"
              disabled={disabled}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-[14px] text-foreground transition-colors group-hover:text-primary">
                  {displayName}
                </span>
                <div className="flex items-center text-[11px] text-muted-foreground font-mono bg-background/50 border border-border/50 px-2 py-0.5 rounded-md shadow-sm">
                  <Phone className="h-3 w-3 mr-1.5 opacity-60" />
                  {phone}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex h-5 items-center justify-center rounded bg-background border px-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm",
                    gender === 'M' ? 'border-blue-200 text-blue-600 dark:border-blue-900/50 dark:text-blue-400' : 'border-pink-200 text-pink-600 dark:border-pink-900/50 dark:text-pink-400'
                  )}>
                    {gender}
                  </span>
                  <span className="font-medium">{age} yrs</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <span className="font-mono text-[11px] tracking-tight">{mrn}</span>
              </div>
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <div className="space-y-2">
      {!currentPatient && (
        <div ref={inputWrapperRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
            <Input
              placeholder={placeholder}
              value={patientSearchQuery}
              onChange={(event) => setPatientSearchQuery(event.target.value)}
              disabled={disabled}
              className="pl-9"
            />
          </div>

          {isPatientsLoading && <p className="mt-2 text-xs text-muted-foreground">Searching patients...</p>}
          {!isPatientsLoading && debouncedSearchQuery.trim() !== '' && patientResults.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">No patients found.</p>
          )}

          {/* Render dropdown via portal so it escapes any stacking context */}
          {typeof window !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
        </div>
      )}
      {currentPatient && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-primary/20 bg-primary/5 p-4 relative">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-[15px] text-foreground">
              {currentPatient.fullName || `${currentPatient.firstName} ${currentPatient.lastName}`}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-background/50"
              onClick={() => {
                onClear();
                setPatientSearchQuery('');
              }}
              disabled={disabled}
            >
              Change
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex h-5 items-center justify-center rounded bg-background border px-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm",
                (currentPatient.gender?.[0]?.toUpperCase() === 'M') ? 'border-blue-200 text-blue-600 dark:border-blue-900/50 dark:text-blue-400' : 'border-pink-200 text-pink-600 dark:border-pink-900/50 dark:text-pink-400'
              )}>
                {currentPatient.gender ? currentPatient.gender[0].toUpperCase() : '—'}
              </span>
              <span className="font-medium">
                {currentPatient.dateOfBirth ? Math.floor((Date.now() - new Date(currentPatient.dateOfBirth).getTime()) / 31557600000) : '—'} yrs
              </span>
            </div>
            <div className="h-3 w-px bg-border" />
            <span className="font-mono text-[11px] tracking-tight">{currentPatient.mrn || '—'}</span>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center text-[11px] font-mono">
              <Phone className="h-3 w-3 mr-1.5 opacity-60" />
              {currentPatient.phoneNumber || 'No phone'}
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
