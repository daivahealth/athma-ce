'use client';

import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { cn } from '@/lib/utils';

const NONE = '__none';

/** Picks an active staff member (physicians first) by id — e.g. who attended a tumour board. */
export function StaffSelect({
  value, onChange, placeholder = 'Person', className, ariaLabel,
}: {
  value?: string | null;
  onChange: (staffId: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const { data: staff = [] } = useStaffList();
  const options = useMemo(
    () => [...staff]
      .filter((s) => (s as { status?: string }).status !== 'inactive')
      .sort((a, b) => Number(b.staffType === 'physician') - Number(a.staffType === 'physician')
        || (a.displayName || a.lastName).localeCompare(b.displayName || b.lastName)),
    [staff],
  );

  return (
    <Select value={value || NONE} onValueChange={(v) => onChange(v === NONE ? '' : v)}>
      <SelectTrigger className={cn('h-9', className)} aria-label={ariaLabel}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>— {placeholder} —</SelectItem>
        {options.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.displayName || `${s.firstName} ${s.lastName}`}
            {s.staffType && s.staffType !== 'physician' && <span className="ml-1 text-muted-foreground capitalize">· {s.staffType}</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
