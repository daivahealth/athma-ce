import * as React from 'react';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';

const calendarOverrides: CalendarProps['classNames'] = {
  month_grid: 'w-full border-collapse',
  weekdays: 'grid grid-cols-7 place-items-center',
  week: 'grid grid-cols-7 place-items-center',
  weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center',
  day:
    'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-range-middle)]:rounded-none [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20',
  range_start: 'day-range-start',
  range_end: 'day-range-end',
  range_middle: 'day-range-middle',
  table: 'w-full border-collapse',
  head_row: 'grid grid-cols-7 place-items-center',
  row: 'grid grid-cols-7 place-items-center mt-2',
  head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center',
  cell:
    'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-range-middle)]:rounded-none [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20',
};

export function AppCalendar({ classNames, ...props }: CalendarProps) {
  return <Calendar {...props} classNames={{ ...calendarOverrides, ...classNames }} />;
}
