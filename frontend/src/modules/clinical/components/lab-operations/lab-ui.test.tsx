import { fireEvent, render, screen } from '@testing-library/react';
import {
  LabDateRangeFilter,
  MAX_LAB_RANGE_DAYS,
  lastDaysRange,
  localDateRange,
  normaliseLabRange,
  toLocalDateInput,
} from './lab-ui';

const TODAY = '2026-11-09';

describe('lab date range helpers', () => {
  it('builds a range ending today', () => {
    expect(lastDaysRange(1, TODAY)).toEqual({ from: TODAY, to: TODAY });
    expect(lastDaysRange(7, TODAY)).toEqual({ from: '2026-11-03', to: TODAY });
    expect(lastDaysRange(30, TODAY)).toEqual({ from: '2026-10-11', to: TODAY });
  });

  it('queries from local midnight of the first day to local midnight after the last day', () => {
    const q = localDateRange({ from: '2026-11-02', to: '2026-11-04' });
    expect(q.from).toBe(new Date(2026, 10, 2).toISOString());
    expect(q.to).toBe(new Date(2026, 10, 5).toISOString());
  });

  it('moves the other end when the ends cross', () => {
    expect(normaliseLabRange({ from: '2026-11-08', to: '2026-11-05' }, 'from', TODAY)).toEqual({ from: '2026-11-08', to: '2026-11-08' });
    expect(normaliseLabRange({ from: '2026-11-08', to: '2026-11-05' }, 'to', TODAY)).toEqual({ from: '2026-11-05', to: '2026-11-05' });
  });

  it('never goes past today', () => {
    expect(normaliseLabRange({ from: '2026-11-01', to: '2026-11-20' }, 'to', TODAY)).toEqual({ from: '2026-11-01', to: TODAY });
  });

  it(`caps the range at ${MAX_LAB_RANGE_DAYS} days, keeping the end that moved`, () => {
    const fromMoved = normaliseLabRange({ from: '2026-01-01', to: TODAY }, 'from', TODAY);
    expect(fromMoved.from).toBe('2026-01-01');
    expect(fromMoved.to).toBe('2026-04-02'); // 92 days including both ends
    const toMoved = normaliseLabRange({ from: '2026-01-01', to: TODAY }, 'to', TODAY);
    expect(toMoved).toEqual({ from: '2026-08-10', to: TODAY });
  });
});

describe('LabDateRangeFilter', () => {
  it('applies a preset and marks it active', () => {
    const today = toLocalDateInput();
    const onChange = jest.fn();
    const { rerender } = render(<LabDateRangeFilter value={lastDaysRange(1, today)} onChange={onChange} label="Reported" />);
    expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    expect(onChange).toHaveBeenCalledWith(lastDaysRange(7, today));

    rerender(<LabDateRangeFilter value={lastDaysRange(7, today)} onChange={onChange} label="Reported" />);
    expect(screen.getByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Today' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps the range valid when a date is typed', () => {
    const today = toLocalDateInput();
    const onChange = jest.fn();
    render(<LabDateRangeFilter value={lastDaysRange(1, today)} onChange={onChange} label="Reported" />);
    const earlier = lastDaysRange(10, today).from;
    fireEvent.change(screen.getByLabelText('Reported from'), { target: { value: earlier } });
    expect(onChange).toHaveBeenLastCalledWith({ from: earlier, to: today });
  });
});
