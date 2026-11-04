// Run: npm test (in plugins/oncology) — uses node:test via tsx from backend/node_modules.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ChemoOrderRuleError,
  assertCanApprove,
  assertCanCancel,
  assertCanEdit,
  assertCanHold,
  assertCanResume,
  assertCanStart,
  assertCanSubmit,
  assertCanVerify,
  missingPreChemoChecks,
  parseDualSignFlag,
  resolveInitialStatus,
} from './chemo-order-rules';

const ORDERER = '11111111-1111-4111-8111-111111111111';
const APPROVER = '22222222-2222-4222-8222-222222222222';
const NURSE = '33333333-3333-4333-8333-333333333333';
const NURSE2 = '44444444-4444-4444-8444-444444444444';

const FULL_CHECKLIST = {
  consentDocumented: true,
  allergiesReviewed: true,
  labsReviewed: true,
  labsWithinRange: true,
  bsaVerified: true,
  doseVerified: true,
};

const throwsRule = (fn: () => unknown, pattern: RegExp) =>
  assert.throws(fn, (err: unknown) => err instanceof ChemoOrderRuleError && pattern.test(err.message));

describe('resolveInitialStatus', () => {
  it('defaults to pending', () => assert.equal(resolveInitialStatus(undefined), 'pending'));
  it('allows draft', () => assert.equal(resolveInitialStatus('draft'), 'draft'));
  for (const s of ['approved', 'verified', 'in_progress', 'completed', 'held', 'cancelled', 42]) {
    it(`rejects ${String(s)}`, () => throwsRule(() => resolveInitialStatus(s), /only be created as/));
  }
});

describe('missingPreChemoChecks', () => {
  it('lists every required item for an empty checklist', () => assert.equal(missingPreChemoChecks({}).length, 6));
  it('treats non-true values as missing', () =>
    assert.deepEqual(missingPreChemoChecks({ ...FULL_CHECKLIST, consentDocumented: 'yes' }), ['informed consent documented']));
  it('passes a complete checklist', () => assert.deepEqual(missingPreChemoChecks(FULL_CHECKLIST), []));
  it('handles null', () => assert.equal(missingPreChemoChecks(null).length, 6));
});

describe('assertCanApprove', () => {
  const pending = { status: 'pending', ordering_provider: ORDERER, pre_chemo_checklist: FULL_CHECKLIST };
  it('allows a second clinician', () => assert.equal(assertCanApprove(pending, APPROVER), APPROVER));
  it('blocks self-approval (case-insensitive)', () =>
    throwsRule(() => assertCanApprove(pending, ORDERER.toUpperCase()), /cannot approve their own/));
  it('requires a signed-in user', () => throwsRule(() => assertCanApprove(pending, null), /signed-in user/));
  it('requires pending', () => throwsRule(() => assertCanApprove({ ...pending, status: 'draft' }, APPROVER), /Only pending/));
  it('requires the checklist', () =>
    throwsRule(() => assertCanApprove({ ...pending, pre_chemo_checklist: { consentDocumented: true } }, APPROVER), /checklist incomplete/));
});

describe('assertCanVerify', () => {
  const approved = { status: 'approved', ordering_provider: ORDERER, approved_by: APPROVER };
  it('blocks the approver verifying', () => throwsRule(() => assertCanVerify(approved, APPROVER, NURSE2, true), /approver cannot/));
  it('requires a second verifier under dual sign-off', () =>
    throwsRule(() => assertCanVerify(approved, NURSE, undefined, true), /Dual sign-off is required/));
  it('allows no second verifier when dual sign-off is off', () =>
    assert.deepEqual(assertCanVerify(approved, NURSE, '', false), { verifier: NURSE, secondVerifier: null }));
  it('rejects a free-text second verifier', () => throwsRule(() => assertCanVerify(approved, NURSE, 'Nurse Jane', true), /user id/));
  it('rejects the verifier as their own second', () => throwsRule(() => assertCanVerify(approved, NURSE, NURSE, true), /different person/));
  it('rejects the approver or orderer as second verifier under dual sign-off', () => {
    throwsRule(() => assertCanVerify(approved, NURSE, APPROVER, true), /independent/);
    throwsRule(() => assertCanVerify(approved, NURSE, ORDERER, true), /independent/);
  });
  it('accepts an independent pair', () =>
    assert.deepEqual(assertCanVerify(approved, NURSE, NURSE2, true), { verifier: NURSE, secondVerifier: NURSE2 }));
  it('requires approved status', () => throwsRule(() => assertCanVerify({ ...approved, status: 'pending' }, NURSE, NURSE2, true), /Only approved/));
});

describe('assertCanStart', () => {
  it('requires verification under dual sign-off', () =>
    throwsRule(() => assertCanStart({ status: 'approved' }, NURSE, true), /must be verified/));
  it('requires a recorded second verifier under dual sign-off', () =>
    throwsRule(() => assertCanStart({ status: 'verified', second_verified_by: null }, NURSE, true), /no independent second/));
  it('starts a dual-signed order', () => assert.equal(assertCanStart({ status: 'verified', second_verified_by: NURSE2 }, NURSE, true), NURSE));
  it('allows approved orders when dual sign-off is off', () => assert.equal(assertCanStart({ status: 'approved' }, NURSE, false), NURSE));
  it('never starts pending orders', () => throwsRule(() => assertCanStart({ status: 'pending' }, NURSE, false), /approved or verified/));
});

describe('hold / cancel / resume / edit / submit', () => {
  it('cannot hold or cancel completed or cancelled orders', () => {
    for (const status of ['completed', 'cancelled']) {
      throwsRule(() => assertCanHold({ status }), /cannot be put on hold/);
      throwsRule(() => assertCanCancel({ status }), /cannot be cancelled/);
    }
  });
  it('cannot cancel an in-progress order (hold it first)', () => throwsRule(() => assertCanCancel({ status: 'in_progress' }), /cannot be cancelled/));
  it('can hold an in-progress order', () => assert.doesNotThrow(() => assertCanHold({ status: 'in_progress' })));
  it('can cancel a held order', () => assert.doesNotThrow(() => assertCanCancel({ status: 'held' })));
  it('resumes only held orders', () => {
    assert.doesNotThrow(() => assertCanResume({ status: 'held' }));
    throwsRule(() => assertCanResume({ status: 'pending' }), /Only held/);
  });
  it('edits only draft or pending', () => {
    assert.doesNotThrow(() => assertCanEdit({ status: 'draft' }));
    throwsRule(() => assertCanEdit({ status: 'approved' }), /Only draft or pending/);
  });
  it('submits only drafts', () => {
    assert.doesNotThrow(() => assertCanSubmit({ status: 'draft' }));
    throwsRule(() => assertCanSubmit({ status: 'pending' }), /Only draft/);
  });
});

describe('parseDualSignFlag', () => {
  it('fails closed', () => {
    for (const v of [undefined, null, true, 'true', 'yes', {}]) assert.equal(parseDualSignFlag(v), true);
  });
  it('honours explicit false', () => {
    for (const v of [false, 'false', 0, '0']) assert.equal(parseDualSignFlag(v), false);
  });
});
