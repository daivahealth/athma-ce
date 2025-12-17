'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLabTests, useImagingStudies, useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { LabTest, ImagingStudy, Procedure } from '@/modules/foundation/types/catalog';

export type OrderSelection = {
  id: string;
  label: string;
  code: string;
  codeSystem: string;
  type: 'lab' | 'imaging' | 'procedure';
};

interface OrderAutocompleteProps {
  type: 'lab' | 'imaging' | 'procedure';
  disabledCodes?: Set<string>;
  onSelect: (selection: OrderSelection) => void;
}

export function OrderAutocomplete({ type, disabledCodes, onSelect }: OrderAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 200);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);

  const { data: labTests } = useLabTests({ search: debouncedQuery || undefined });
  const { data: imagingStudies } = useImagingStudies({ search: debouncedQuery || undefined });
  const { data: procedures } = useProcedures({ search: debouncedQuery || undefined });

  const items = useMemo(() => {
    const mapLab = (test: LabTest): OrderSelection => ({
      id: test.id,
      label: test.testName,
      code: test.loincCode || test.localCode || test.id,
      codeSystem: test.loincCode ? 'LOINC' : test.localCode ? 'LOCAL' : 'UNKNOWN',
      type: 'lab',
    });
    const mapImaging = (study: ImagingStudy): OrderSelection => ({
      id: study.id,
      label: study.studyName,
      code: study.cptCode || study.localCode || study.id,
      codeSystem: study.cptCode ? 'CPT' : study.localCode ? 'LOCAL' : 'UNKNOWN',
      type: 'imaging',
    });
    const mapProcedure = (procedure: Procedure): OrderSelection => ({
      id: procedure.id,
      label: procedure.procedureName,
      code: procedure.cptCode || procedure.icd10PcsCode || procedure.localCode || procedure.id,
      codeSystem: procedure.cptCode ? 'CPT' : procedure.icd10PcsCode ? 'ICD-10-PCS' : 'LOCAL',
      type: 'procedure',
    });

    if (type === 'imaging') {
      return (imagingStudies ?? []).map(mapImaging);
    }
    if (type === 'procedure') {
      return (procedures ?? []).map(mapProcedure);
    }
    return (labTests ?? []).map(mapLab);
  }, [type, labTests, imagingStudies, procedures]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [items]);

  useEffect(() => {
    if (!inputFocused) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [inputFocused, debouncedQuery]);

  const handleSelect = (selection: OrderSelection) => {
    if (disabledCodes?.has(selection.code)) return;
    onSelect(selection);
    setQuery('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
      return;
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(items[highlightedIndex]);
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

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
            placeholder={`Search ${type === 'lab' ? 'lab tests' : type === 'imaging' ? 'imaging studies' : 'procedures'}...`}
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(520px,90vw)] p-0">
        <div className="max-h-72 divide-y overflow-y-auto">
          {!debouncedQuery && (
            <p className="p-3 text-sm text-muted-foreground">Start typing to search catalog.</p>
          )}
          {debouncedQuery && items.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No matches found.</p>
          )}
          {items.map((item, index) => {
            const disabled = disabledCodes?.has(item.code);
            return (
              <button
                key={item.id}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm ${
                  disabled
                    ? 'cursor-not-allowed opacity-60'
                    : highlightedIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                }`}
                onClick={() => !disabled && handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                disabled={disabled}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                  <Badge variant="secondary" className="font-mono">
                    {item.codeSystem} · {item.code}
                  </Badge>
                </div>
                {disabled && (
                  <p className="text-xs text-amber-600">Already added</p>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
