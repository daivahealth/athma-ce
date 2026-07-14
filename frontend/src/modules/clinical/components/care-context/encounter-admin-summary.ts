import type { Claim } from '@/modules/rcm/types/claims';
import type { PreAuthRequest } from '@/modules/rcm/types/preauth';
import type { Denial } from '@/modules/rcm/types/denial';
import type { Invoice } from '@/modules/rcm/types/invoice';

/** All revenue-cycle records that belong to a single encounter. */
export interface EncounterRcm {
  claims: Claim[];
  preauths: PreAuthRequest[];
  denials: Denial[];
  invoices: Invoice[];
}

function readable(value?: string | null): string {
  if (!value) return '';
  const s = value.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function money(amount: number, currency?: string | null): string {
  const n = Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return currency ? `${currency} ${n}` : n;
}

function uniqueStatuses(statuses: (string | null | undefined)[]): string {
  return [...new Set(statuses.filter(Boolean).map((s) => readable(s)))].join(' / ');
}

/**
 * Administrative / financial one-liner for an encounter — pre-authorisation,
 * claim status, denials/appeals and payment position. This is deliberately the
 * *administrative* counterpart to the clinical timeline summary, so that the two
 * center-panel views together give a complete context.
 */
export function buildAdminSummary(rcm: EncounterRcm): string {
  const parts: string[] = [];

  if (rcm.preauths.length) {
    parts.push(`Pre-auth ${uniqueStatuses(rcm.preauths.map((p) => p.status))}`);
  }

  if (rcm.claims.length) {
    const label = rcm.claims.length > 1 ? `${rcm.claims.length} claims` : 'Claim';
    parts.push(`${label} ${uniqueStatuses(rcm.claims.map((c) => c.status))}`);
  }

  if (rcm.denials.length) {
    if (rcm.denials.some((d) => d.status === 'appealing')) {
      parts.push('denial under appeal');
    } else if (rcm.denials.some((d) => d.status === 'open')) {
      parts.push('denial open — action needed');
    } else {
      parts.push(`denial ${uniqueStatuses(rcm.denials.map((d) => d.status))}`);
    }
  }

  if (rcm.invoices.length) {
    const currency = rcm.invoices[0]?.currency;
    const due = rcm.invoices.reduce((acc, i) => acc + (Number(i.balanceDue) || 0), 0);
    const net = rcm.invoices.reduce((acc, i) => acc + (Number(i.netAmount) || 0), 0);
    if (due <= 0) {
      parts.push(`invoice settled (${money(net, currency)})`);
    } else if (due < net) {
      parts.push(`${money(due, currency)} balance due of ${money(net, currency)}`);
    } else {
      parts.push(`${money(due, currency)} unpaid`);
    }
  }

  if (parts.length === 0) return 'No billing or claims activity recorded for this encounter.';

  const joined = parts.join(' · ');
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}
