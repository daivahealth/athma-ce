'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const slots = [
  {
    time: '09:00',
    provider: 'Dr. Sara Mahmoud',
    specialty: 'Family Medicine',
    room: 'DXB · CL1',
    status: 'Checked-in',
  },
  {
    time: '09:30',
    provider: 'Dr. Ahmed Hussain',
    specialty: 'Cardiology',
    room: 'DXB · CL2',
    status: 'Awaiting vitals',
  },
  {
    time: '10:00',
    provider: 'Dr. Fatima Al Noor',
    specialty: 'Pediatrics',
    room: 'DXB · CL3',
    status: 'Complete',
  },
  {
    time: '10:15',
    provider: 'Dr. Omar Saeed',
    specialty: 'Dermatology',
    room: 'DXB · CL4',
    status: 'Scheduled',
  },
];

export function AppointmentSchedule() {
  const data = useMemo(() => slots, []);
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Provider</th>
              <th className="px-4 py-3 text-left">Specialty</th>
              <th className="px-4 py-3 text-left">Room</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {data.map((slot) => (
              <tr key={`${slot.time}-${slot.provider}`} className="bg-background/60">
                <td className="px-4 py-3 font-medium text-foreground">{slot.time}</td>
                <td className="px-4 py-3 text-muted-foreground">{slot.provider}</td>
                <td className="px-4 py-3 text-muted-foreground">{slot.specialty}</td>
                <td className="px-4 py-3 text-muted-foreground">{slot.room}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                      slot.status === 'Complete' && 'bg-success/10 text-success-foreground',
                      slot.status === 'Checked-in' && 'bg-primary/10 text-primary',
                      slot.status === 'Scheduled' && 'bg-warning/10 text-warning-foreground',
                      slot.status === 'Awaiting vitals' && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    {slot.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        * Data refreshed every 2 minutes from Foundation & Encounter services. PHI masked for demo.
      </p>
    </div>
  );
}
