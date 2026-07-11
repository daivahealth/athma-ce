'use client';

function partsOf(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    year: d.getFullYear(),
    shortDay: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  };
}

/** Single-date rail: MONTH / DAY / YEAR, stacked and right-aligned. */
export function DateRailSingle({ iso }: { iso: string }) {
  const { month, day, year } = partsOf(iso);
  return (
    <div className="text-right leading-tight whitespace-nowrap">
      <div className="text-[10px] font-semibold text-muted-foreground tracking-wide">{month}</div>
      <div className="text-lg font-bold text-foreground -mt-0.5">{day}</div>
      <div className="text-[10px] text-muted-foreground">{year}</div>
    </div>
  );
}

/**
 * Date-range rail for grouped courses. Deliberately not the same
 * giant-day-number treatment as a single date - two of those stacked
 * would either overlap or need much more column width than a single
 * date does, for information a course's own header already restates in
 * full. Renders two compact "D MMM" lines instead, with the year shown
 * once (or twice if the range spans a year boundary).
 */
export function DateRailRange({ startIso, endIso }: { startIso: string; endIso: string }) {
  const start = partsOf(startIso);
  const end = partsOf(endIso);
  const sameYear = start.year === end.year;

  if (startIso === endIso) return <DateRailSingle iso={startIso} />;

  return (
    <div className="text-right leading-tight whitespace-nowrap">
      <div className="text-xs font-semibold text-foreground">{start.shortDay}</div>
      <div className="text-[9px] text-muted-foreground -my-0.5">to</div>
      <div className="text-xs font-semibold text-foreground">{end.shortDay}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        {sameYear ? start.year : `${start.year}–${end.year}`}
      </div>
    </div>
  );
}
