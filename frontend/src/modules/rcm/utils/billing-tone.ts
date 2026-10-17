import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';
import type { ClaimStatus } from '@/modules/rcm/types/claims';
import type { InvoiceStatus } from '@/modules/rcm/types/invoice';

export const INVOICE_STATUS_TONE: Record<`${InvoiceStatus}`, BadgeTone> = {
  unpaid: 'orange',
  partial: 'amber',
  paid: 'emerald',
  cancelled: 'rose',
};

/** A claim's life: preparation (cool) → with the payer (blue/purple) → settled (green) or refused (red). */
export const CLAIM_STATUS_TONE: Record<ClaimStatus, BadgeTone> = {
  draft: 'slate',
  pending: 'amber',
  ready: 'sky',
  scrubbing: 'cyan',
  validated: 'teal',
  failed_validation: 'orange',
  submitted: 'blue',
  acknowledged: 'indigo',
  rejected: 'red',
  pending_adjudication: 'purple',
  adjudicated: 'violet',
  paid: 'emerald',
  partially_paid: 'green',
  denied: 'red',
  appealed: 'fuchsia',
  cancelled: 'rose',
};

/**
 * `payers.payer_type` is free text; these are the values the eligibility
 * connectors and seeds use. Anything else falls back to slate.
 */
export const PAYER_TYPE_TONE: Record<string, BadgeTone> = {
  insurance: 'blue',
  tpa: 'violet',
  government: 'teal',
  corporate: 'indigo',
  self: 'amber',
  cash: 'amber',
};

export const invoiceStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(INVOICE_STATUS_TONE, status);
export const claimStatusTone = (status: string | null | undefined): BadgeTone =>
  toneOf(CLAIM_STATUS_TONE, status);
export const payerTypeTone = (payerType: string | null | undefined): BadgeTone =>
  toneOf(PAYER_TYPE_TONE, payerType?.toLowerCase());
