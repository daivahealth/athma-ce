'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Patient } from '@/modules/clinical/types/patient';

interface PatientSearchProps {
  locale: string;
}

export function PatientSearch({ locale }: PatientSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query.trim(), 200);

  useEffect(() => {
    setOpen(debouncedQuery.length > 0);
  }, [debouncedQuery]);

  const { data, isLoading } = usePatients(
    { search: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length > 0 }
  );

  const patients: Patient[] = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [patients]);

  const handleSelect = (patientId: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/${locale}/patients-ai/${patientId}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || patients.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= patients.length ? 0 : next;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev <= 0) {
          return patients.length - 1;
        }
        return prev - 1;
      });
      return;
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(patients[highlightedIndex].id);
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const showResults = debouncedQuery.length > 0;

  return (
    <Popover open={open && showResults} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex w-full max-w-xl items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search patients by name, MRN, phone"
            className="pl-9 pr-3"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-full max-w-xl p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-64 overflow-y-auto">
          {!showResults && !isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Start typing to search patients.</p>
          )}
          {showResults && isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Searching...</p>
          )}
          {showResults && !isLoading && patients.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No matching patients found.</p>
          )}
          {showResults && patients.length > 0 && (
            <ul className="divide-y">
              {patients.map((patient, index) => {
                const displayName = patient.fullName || `${patient.firstName} ${patient.lastName}`;
                const gender = patient.gender ? patient.gender[0].toUpperCase() : '—';
                const age = patient.dateOfBirth
                  ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 31557600000)
                  : '—';
                const mrn = patient.mrn || '—';
                const phone = patient.phoneNumber || 'No phone';

                return (
                  <li key={patient.id}>
                    <button
                      type="button"
                      className={`w-full px-3 py-2 text-left ${
                        highlightedIndex === index
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => handleSelect(patient.id)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{displayName}</span>
                        {` | ${gender}/${age} | ${mrn} | ${phone}`}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
