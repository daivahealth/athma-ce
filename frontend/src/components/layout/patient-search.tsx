'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Patient } from '@/modules/clinical/types/patient';
import { cn } from '@/lib/utils';

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
        <div className="relative flex w-full max-w-xl items-center group">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search patients by name, MRN, phone"
            className="pl-9 pr-3 bg-card/50 border-border/50 focus-visible:bg-background transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-full max-w-xl p-0 overflow-hidden glass border-white/20 shadow-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
          {!showResults && !isLoading && (
            <div className="p-8 text-center text-muted-foreground/80">
              <Search className="mx-auto h-8 w-8 opacity-20 mb-2" />
              <p className="text-sm">Start typing to search patients...</p>
            </div>
          )}
          {showResults && isLoading && (
            <div className="p-4 space-y-2">
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
            </div>
          )}
          {showResults && !isLoading && patients.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No matching patients found.</p>
            </div>
          )}
          {showResults && patients.length > 0 && (
            <ul className="divide-y divide-border/30">
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
                      className={cn(
                        "w-full px-4 py-3 text-left transition-colors flex items-center justify-between group",
                        highlightedIndex === index
                          ? "bg-primary/10"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => handleSelect(patient.id)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{displayName}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={cn("px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium", gender === 'M' ? 'text-blue-500 bg-blue-500/10' : 'text-pink-500 bg-pink-500/10')}>{gender}</span>
                          <span>{age} yrs</span>
                          <span>•</span>
                          <span>{mrn}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground/70 font-mono">{phone}</div>
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
