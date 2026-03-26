'use client';

import { useMemo } from 'react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function ActivityTimeline() {
  const activity = useMemo(() => [
    {
      id: 'evt-101',
      type: 'Encounter Signed',
      timestamp: new Date().toISOString(),
      owner: 'Dr. Sara Mahmoud',
      details: 'OPD consultation completed. SOAP note signed.',
      phi: 'Patient: A**** H****',
    },
    {
      id: 'evt-102',
      type: 'Medication Dispensed',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      owner: 'Pharmacist - DXB Clinic',
      details: 'Amoxicillin 500mg (Qty 20)',
      phi: 'Prescription: RX-24-0093',
    },
    {
      id: 'evt-103',
      type: 'Claim Submitted',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      owner: 'Revenue Ops',
      details: 'Claim #CLM-47382 sent to payer Watania',
      phi: 'Amount: AED 1,240.00',
    },
  ], []);
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {activity.map((item) => (
        <li key={item.id} className="space-y-2">
          <span className="absolute -left-[9px] mt-1 h-3 w-3 rounded-full border border-primary bg-background" />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-foreground">{item.type}</p>
            <time className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</time>
          </div>
          <p className="text-sm text-muted-foreground">{item.details}</p>
          <p className={cn('text-xs text-muted-foreground/80', 'blur-sm transition data-[mask=false]:blur-0')} data-mask="true">
            {item.phi}
          </p>
        </li>
      ))}
    </ol>
  );
}
