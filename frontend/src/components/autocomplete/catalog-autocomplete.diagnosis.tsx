'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDiagnoses as useCatalogDiagnoses } from '@/modules/foundation/hooks/use-catalogs';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Diagnosis as CatalogDiagnosis } from '@/modules/foundation/types/catalog';

interface DiagnosisAutocompleteProps {
  disabledCodes?: Set<string>;
  onSelect: (diagnosis: CatalogDiagnosis) => void;
}

export function DiagnosisAutocomplete({ disabledCodes, onSelect }: DiagnosisAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 200);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);

  const { data: diagnoses, isLoading } = useCatalogDiagnoses({
    search: debouncedQuery || undefined,
    isActive: true,
  });

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [diagnoses]);

  const handleSelect = (diagnosis: CatalogDiagnosis) => {
    if (disabledCodes?.has(diagnosis.code)) return;
    onSelect(diagnosis);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const items = diagnoses ?? [];
    if (!open || items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % items.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(items[highlightedIndex]);
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const items = useMemo(() => diagnoses ?? [], [diagnoses]);

  useEffect(() => {
    if (!inputFocused) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [inputFocused, debouncedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 100)}
            placeholder="Search ICD catalog..."
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(520px,90vw)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-72 divide-y overflow-y-auto">
          {!debouncedQuery && !isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Start typing to search diagnoses.</p>
          )}
          {isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Searching...</p>
          )}
          {!isLoading && debouncedQuery && items.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No diagnoses found.</p>
          )}
          {items.map((diagnosis, index) => {
            const disabled = disabledCodes?.has(diagnosis.code);
            return (
              <button
                key={diagnosis.id}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm ${
                  disabled
                    ? 'cursor-not-allowed opacity-60'
                    : highlightedIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                }`}
                onClick={() => !disabled && handleSelect(diagnosis)}
                onMouseEnter={() => setHighlightedIndex(index)}
                disabled={disabled}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{diagnosis.shortDescription || diagnosis.description}</span>
                  <Badge variant="secondary" className="font-mono">
                    {diagnosis.code}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {diagnosis.chapter || diagnosis.category || diagnosis.version?.versionLabel || '—'}
                </p>
                {disabled && (
                  <p className="text-xs text-amber-600">Already added to encounter</p>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
