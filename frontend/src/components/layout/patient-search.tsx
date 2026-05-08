'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Phone } from 'lucide-react';
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
            className="pl-9 pr-12 bg-card/50 border-border/50 focus-visible:bg-background transition-all shadow-sm hover:shadow-md"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden glass border-border/40 shadow-xl rounded-xl"
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
                        "w-full px-4 py-3 text-left transition-all flex items-center justify-between group border-l-[3px] border-transparent",
                        highlightedIndex === index
                          ? "bg-muted/50 border-primary"
                          : "hover:bg-muted/30 hover:border-primary/50"
                      )}
                      onClick={() => handleSelect(patient.id)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold text-[14px] text-foreground group-hover:text-primary transition-colors">
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
                      </div>
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
