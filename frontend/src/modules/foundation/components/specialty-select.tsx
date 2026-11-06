'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSpecialties } from '../hooks/use-specialties';
import type { Specialty } from '../types/specialty';

const NONE = '__none__';

type ValueKey = 'code' | 'id';

function keyOf(s: Specialty, valueKey: ValueKey) {
  return valueKey === 'id' ? s.id : s.code;
}

interface SpecialtySelectProps {
  /** Specialty code (default) or id, depending on `valueKey`. Empty means none. */
  value?: string | null;
  onChange: (value: string) => void;
  /** Store the master `code` (cross-service key) or the foundation `id`. */
  valueKey?: ValueKey;
  id?: string;
  placeholder?: string;
  /** Offer a "None" option that clears the value. */
  allowNone?: boolean;
  disabled?: boolean;
}

/**
 * Single specialty picker backed by the foundation specialty master.
 * A stored value that is not in the master (legacy free text) is still shown,
 * so editing a record never silently drops it.
 */
export function SpecialtySelect({
  value,
  onChange,
  valueKey = 'code',
  id,
  placeholder = 'Select specialty',
  allowNone = true,
  disabled,
}: SpecialtySelectProps) {
  const { data: specialties = [], isLoading, isError } = useSpecialties();
  const known = specialties.some((s) => keyOf(s, valueKey) === value);

  return (
    <Select
      value={value || NONE}
      onValueChange={(next) => onChange(next === NONE ? '' : next)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger id={id}>
        <SelectValue
          placeholder={isLoading ? 'Loading specialties…' : isError ? 'Specialties unavailable' : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {allowNone && <SelectItem value={NONE}>{placeholder}</SelectItem>}
        {value && !known && !isLoading && (
          <SelectItem value={value}>{value} (not in specialty master)</SelectItem>
        )}
        {specialties.map((s) => (
          <SelectItem key={s.id} value={keyOf(s, valueKey)}>
            {s.localizedName || s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface SpecialtyMultiSelectProps {
  /** Selected specialty codes. */
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

/** Toggle-button multi-select of specialty codes, matching the catalog form style. */
export function SpecialtyMultiSelect({ value, onChange, disabled }: SpecialtyMultiSelectProps) {
  const { data: specialties = [], isLoading, isError } = useSpecialties();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading specialties…</p>;
  if (isError) return <p className="text-sm text-destructive">Could not load specialties.</p>;

  const toggle = (code: string) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);
  const unknown = value.filter((code) => !specialties.some((s) => s.code === code));

  return (
    <div className="flex flex-wrap gap-2">
      {specialties.map((s) => {
        const selected = value.includes(s.code);
        return (
          <Button
            key={s.id}
            type="button"
            size="sm"
            variant={selected ? 'default' : 'outline'}
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => toggle(s.code)}
          >
            {s.localizedName || s.name}
          </Button>
        );
      })}
      {unknown.map((code) => (
        <Button
          key={code}
          type="button"
          size="sm"
          variant="secondary"
          aria-pressed
          disabled={disabled}
          title="Not in the specialty master — click to remove"
          onClick={() => toggle(code)}
        >
          {code} ✕
        </Button>
      ))}
    </div>
  );
}
