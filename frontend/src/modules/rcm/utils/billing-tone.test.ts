import type { ClaimStatus } from '@/modules/rcm/types/claims';
import { InvoiceStatus } from '@/modules/rcm/types/invoice';
import {
  CLAIM_STATUS_TONE,
  INVOICE_STATUS_TONE,
  PAYER_TYPE_TONE,
  claimStatusTone,
  invoiceStatusTone,
  payerTypeTone,
} from './billing-tone';

const CLAIM_STATUSES: ClaimStatus[] = [
  'draft',
  'pending',
  'ready',
  'scrubbing',
  'validated',
  'failed_validation',
  'submitted',
  'acknowledged',
  'rejected',
  'pending_adjudication',
  'adjudicated',
  'paid',
  'partially_paid',
  'denied',
  'appealed',
  'cancelled',
];

describe('billing tones', () => {
  it.each(Object.values(InvoiceStatus))('maps invoice status %s', (status) => {
    expect(invoiceStatusTone(status)).toBe(INVOICE_STATUS_TONE[status]);
  });

  it.each(CLAIM_STATUSES)('maps claim status %s', (status) => {
    expect(claimStatusTone(status)).toBe(CLAIM_STATUS_TONE[status]);
  });

  it('covers every claim status in the map', () => {
    expect(Object.keys(CLAIM_STATUS_TONE).sort()).toEqual([...CLAIM_STATUSES].sort());
  });

  it.each(Object.keys(PAYER_TYPE_TONE))('maps payer type %s, ignoring case', (payerType) => {
    expect(payerTypeTone(payerType.toUpperCase())).toBe(PAYER_TYPE_TONE[payerType]);
  });

  it('falls back to slate for unknown values', () => {
    expect(invoiceStatusTone('refunded')).toBe('slate');
    expect(claimStatusTone('lost')).toBe('slate');
    expect(payerTypeTone('barter')).toBe('slate');
    expect(payerTypeTone(null)).toBe('slate');
  });
});
