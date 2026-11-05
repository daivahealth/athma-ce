/**
 * Chemo order safety rules (ASCO/ONS administration safety standards).
 *
 * Pure functions so the state machine and separation-of-duties rules can be
 * unit-tested without a database. The service loads the order row, calls the
 * matching `assertCan*` guard, and only then writes. Every guard throws a
 * `ChemoOrderRuleError` with a user-facing message; the service maps it to 400.
 *
 * Status flow:
 *   draft → pending → approved → verified → in_progress → completed
 *   pending | approved | verified | in_progress → held → (resume) pending
 *   draft | pending | approved | verified | held → cancelled
 */

export type ChemoOrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'verified'
  | 'in_progress'
  | 'completed'
  | 'held'
  | 'cancelled';

export class ChemoOrderRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChemoOrderRuleError';
  }
}

/** Statuses a new order may be created in. Anything further must go through the workflow. */
export const CREATABLE_STATUSES: readonly ChemoOrderStatus[] = ['draft', 'pending'];
export const EDITABLE_STATUSES: readonly ChemoOrderStatus[] = ['draft', 'pending'];
export const HOLDABLE_STATUSES: readonly ChemoOrderStatus[] = ['pending', 'approved', 'verified', 'in_progress'];
export const CANCELLABLE_STATUSES: readonly ChemoOrderStatus[] = ['draft', 'pending', 'approved', 'verified', 'held'];

/**
 * Pre-chemo checklist items that must be confirmed before an order can be approved.
 * Keys match the `pre_chemo_checklist` JSON written by the order form.
 * `premedicationsOrdered` is deliberately not required: not every regimen has premedications.
 */
export const REQUIRED_PRE_CHEMO_CHECKS: ReadonlyArray<{ key: string; label: string }> = [
  { key: 'consentDocumented', label: 'informed consent documented' },
  { key: 'allergiesReviewed', label: 'allergies reviewed' },
  { key: 'labsReviewed', label: 'labs reviewed' },
  { key: 'labsWithinRange', label: 'labs within acceptable range' },
  { key: 'bsaVerified', label: 'weight / BSA verified' },
  { key: 'doseVerified', label: 'calculated doses verified' },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The order columns the guards need, as returned by the raw SQL row. */
export interface ChemoOrderSnapshot {
  status: string;
  ordering_provider?: string | null;
  approved_by?: string | null;
  verified_by?: string | null;
  second_verified_by?: string | null;
  pre_chemo_checklist?: unknown;
}

function sameUser(a?: string | null, b?: string | null): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

function requireActor(actorId: string | null | undefined, action: string): string {
  if (!actorId) {
    throw new ChemoOrderRuleError(`A signed-in user is required to ${action} a chemo order`);
  }
  return actorId;
}

/** Status for a new order. The client may ask for `draft`; it can never skip to a signed-off status. */
export function resolveInitialStatus(requested: unknown): ChemoOrderStatus {
  if (requested === undefined || requested === null || requested === '') return 'pending';
  if (typeof requested === 'string' && (CREATABLE_STATUSES as readonly string[]).includes(requested)) {
    return requested as ChemoOrderStatus;
  }
  throw new ChemoOrderRuleError(`New chemo orders can only be created as ${CREATABLE_STATUSES.join(' or ')}`);
}

/** Labels of the required pre-chemo checks that are not confirmed. */
export function missingPreChemoChecks(checklist: unknown): string[] {
  const c = checklist && typeof checklist === 'object' ? (checklist as Record<string, unknown>) : {};
  return REQUIRED_PRE_CHEMO_CHECKS.filter(({ key }) => c[key] !== true).map(({ label }) => label);
}

export function assertCanEdit(order: ChemoOrderSnapshot): void {
  if (!(EDITABLE_STATUSES as readonly string[]).includes(order.status)) {
    throw new ChemoOrderRuleError(`Only draft or pending orders can be edited (order is ${order.status})`);
  }
}

export function assertCanSubmit(order: ChemoOrderSnapshot): void {
  if (order.status !== 'draft') {
    throw new ChemoOrderRuleError(`Only draft orders can be submitted (order is ${order.status})`);
  }
}

/** Approval: pending only, by someone other than the ordering provider, with the safety checklist complete. */
export function assertCanApprove(order: ChemoOrderSnapshot, approverId: string | null | undefined): string {
  const approver = requireActor(approverId, 'approve');
  if (order.status !== 'pending') {
    throw new ChemoOrderRuleError(`Only pending orders can be approved (order is ${order.status})`);
  }
  if (sameUser(approver, order.ordering_provider)) {
    throw new ChemoOrderRuleError('The ordering provider cannot approve their own chemo order; a second clinician must approve it');
  }
  const missing = missingPreChemoChecks(order.pre_chemo_checklist);
  if (missing.length) {
    throw new ChemoOrderRuleError(`Pre-chemo checklist incomplete: ${missing.join(', ')}`);
  }
  return approver;
}

/**
 * Bedside verification: approved only, by someone other than the approver.
 * With dual sign-off on, an independent second verifier (a different user from the
 * verifier, the approver and the ordering provider) is mandatory.
 */
export function assertCanVerify(
  order: ChemoOrderSnapshot,
  verifierId: string | null | undefined,
  secondVerifierId: string | null | undefined,
  requireDualSign: boolean,
): { verifier: string; secondVerifier: string | null } {
  const verifier = requireActor(verifierId, 'verify');
  if (order.status !== 'approved') {
    throw new ChemoOrderRuleError(`Only approved orders can be verified (order is ${order.status})`);
  }
  if (sameUser(verifier, order.approved_by)) {
    throw new ChemoOrderRuleError('The approver cannot also perform the bedside verification');
  }
  const second = secondVerifierId ? String(secondVerifierId).trim() : '';
  if (!second) {
    if (requireDualSign) {
      throw new ChemoOrderRuleError('Dual sign-off is required: select an independent second verifier');
    }
    return { verifier, secondVerifier: null };
  }
  if (!UUID_RE.test(second)) {
    throw new ChemoOrderRuleError('Second verifier must be a user id');
  }
  if (sameUser(second, verifier)) {
    throw new ChemoOrderRuleError('The second verifier must be a different person from the verifier');
  }
  if (requireDualSign && (sameUser(second, order.approved_by) || sameUser(second, order.ordering_provider))) {
    throw new ChemoOrderRuleError('The second verifier must be independent of the ordering provider and the approver');
  }
  return { verifier, secondVerifier: second };
}

/** Administration may start only after verification when dual sign-off is on; otherwise approval suffices. */
export function assertCanStart(order: ChemoOrderSnapshot, administratorId: string | null | undefined, requireDualSign: boolean): string {
  const administrator = requireActor(administratorId, 'start administration of');
  if (requireDualSign) {
    if (order.status !== 'verified') {
      throw new ChemoOrderRuleError(`Dual sign-off is required: the order must be verified before administration (order is ${order.status})`);
    }
    if (!order.second_verified_by) {
      throw new ChemoOrderRuleError('Dual sign-off is required: the order has no independent second verification');
    }
  } else if (order.status !== 'verified' && order.status !== 'approved') {
    throw new ChemoOrderRuleError(`Order must be approved or verified before administration (order is ${order.status})`);
  }
  return administrator;
}

export function assertCanHold(order: ChemoOrderSnapshot): void {
  if (!(HOLDABLE_STATUSES as readonly string[]).includes(order.status)) {
    throw new ChemoOrderRuleError(`A ${order.status} order cannot be put on hold`);
  }
}

export function assertCanCancel(order: ChemoOrderSnapshot): void {
  if (!(CANCELLABLE_STATUSES as readonly string[]).includes(order.status)) {
    throw new ChemoOrderRuleError(`A ${order.status} order cannot be cancelled`);
  }
}

/** Resuming a held order sends it back to pending; earlier sign-offs are cleared and must be redone. */
export function assertCanResume(order: ChemoOrderSnapshot): void {
  if (order.status !== 'held') {
    throw new ChemoOrderRuleError(`Only held orders can be resumed (order is ${order.status})`);
  }
}

/** Reads a boolean config value, failing closed (true) for anything that is not an explicit false. */
export function parseDualSignFlag(value: unknown): boolean {
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return true;
}
