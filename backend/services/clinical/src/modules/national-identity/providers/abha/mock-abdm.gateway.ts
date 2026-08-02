/**
 * Offline stand-in for the ABDM gateway.
 *
 * Bound whenever `ABDM_CLIENT_ID`/`ABDM_CLIENT_SECRET` are absent, so the
 * entire ABHA journey (enrol, verify, address selection, patient linkage) is
 * exercisable in development and CI without NHA sandbox access. Mirrors the
 * `MockHieProvider` precedent from ADR-0012.
 *
 * Shapes match the live gateway's normalised output so swapping in the real
 * implementation changes nothing above this seam.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { verhoeffCheckDigit } from '@zeal/validators';
import { IdentityProviderError } from '../national-identity-provider.interface';
import { AbdmGateway, AbhaOtpChallenge, AbhaProfile } from './abdm-gateway.interface';

/** The only OTP the mock accepts — documented so tests/demos are predictable. */
const MOCK_OTP = '123456';
const TXN_TTL_MS = 10 * 60 * 1000;

interface MockTxn {
  purpose: 'enroll' | 'verify';
  loginHint: string;
  /** Last 4 digits only — the mock never retains a full Aadhaar either. */
  loginIdSuffix: string;
  createdAt: number;
  abhaNumber?: string;
  /**
   * Set once the OTP has been accepted. The transaction is retained rather
   * than deleted because ABDM keeps it alive after enrolment for the
   * address-suggestion/claim steps — but a used txn can never verify again.
   */
  used?: boolean;
}

@Injectable()
export class MockAbdmGateway implements AbdmGateway {
  readonly name = 'mock';
  private readonly logger = new Logger(MockAbdmGateway.name);
  private readonly txns = new Map<string, MockTxn>();

  async requestEnrolOtp(_tenantId: string, aadhaar: string): Promise<AbhaOtpChallenge> {
    const digits = aadhaar.replace(/\D/g, '');
    if (digits.length !== 12) {
      throw new IdentityProviderError('ABDM_INVALID_AADHAAR', 'Aadhaar number must be 12 digits');
    }
    return this.newChallenge('enroll', 'aadhaar', digits);
  }

  async enrolByAadhaar(
    _tenantId: string,
    txnId: string,
    otp: string,
    mobile?: string,
  ): Promise<AbhaProfile> {
    const txn = this.consume(txnId, otp);
    const abhaNumber = this.deterministicAbha(txn.loginIdSuffix);

    return {
      abhaNumber,
      abhaAddress: undefined, // claimed separately, mirroring the real flow
      firstName: 'Test',
      lastName: 'Patient',
      fullName: 'Test Patient',
      dateOfBirth: '1990-01-01',
      gender: 'M',
      maskedMobile: mobile ? this.mask(mobile) : `XXXXXX${txn.loginIdSuffix}`,
      userToken: `mock-user-token-${txnId}`,
      isNew: true,
    };
  }

  async requestLoginOtp(
    _tenantId: string,
    loginHint: string,
    loginId: string,
  ): Promise<AbhaOtpChallenge> {
    const digits = loginId.replace(/\D/g, '');
    if (!digits) {
      throw new IdentityProviderError('ABDM_INVALID_LOGIN_ID', 'A login identifier is required');
    }
    const challenge = this.newChallenge('verify', loginHint, digits);

    // For an abha-number login the mock echoes that same number back on verify.
    if (loginHint === 'abha-number' && digits.length === 14) {
      this.txns.get(challenge.txnId)!.abhaNumber = digits;
    }
    return challenge;
  }

  async verifyLogin(_tenantId: string, txnId: string, otp: string): Promise<AbhaProfile> {
    const txn = this.consume(txnId, otp);
    const abhaNumber = txn.abhaNumber ?? this.deterministicAbha(txn.loginIdSuffix);

    return {
      abhaNumber,
      abhaAddress: `test.patient${txn.loginIdSuffix}@sbx`,
      firstName: 'Test',
      lastName: 'Patient',
      fullName: 'Test Patient',
      dateOfBirth: '1990-01-01',
      gender: 'M',
      maskedMobile: `XXXXXX${txn.loginIdSuffix}`,
      userToken: `mock-user-token-${txnId}`,
      isNew: false,
    };
  }

  async getAbhaAddressSuggestions(_tenantId: string, txnId: string): Promise<string[]> {
    const txn = this.txns.get(txnId);
    const suffix = txn?.loginIdSuffix ?? '0000';
    return [`test.patient${suffix}@sbx`, `patient.${suffix}@sbx`, `tp${suffix}@sbx`];
  }

  async createAbhaAddress(
    _tenantId: string,
    _txnId: string,
    abhaAddress: string,
  ): Promise<string> {
    return abhaAddress;
  }

  // ---------------------------------------------------------------- internals

  private newChallenge(
    purpose: 'enroll' | 'verify',
    loginHint: string,
    digits: string,
  ): AbhaOtpChallenge {
    const txnId = crypto.randomUUID();
    const suffix = digits.slice(-4);

    this.txns.set(txnId, { purpose, loginHint, loginIdSuffix: suffix, createdAt: Date.now() });
    this.sweep();

    this.logger.log(`[mock] issued ABDM challenge ${txnId} (${purpose}/${loginHint})`);

    return {
      txnId,
      maskedTarget: `XXXXXX${suffix}`,
      message: `Mock ABDM gateway — use OTP ${MOCK_OTP}`,
    };
  }

  private consume(txnId: string, otp: string): MockTxn {
    const txn = this.txns.get(txnId);

    if (!txn || txn.used) {
      throw new IdentityProviderError('ABDM_TXN_NOT_FOUND', 'Transaction not found or already used');
    }
    if (Date.now() - txn.createdAt > TXN_TTL_MS) {
      this.txns.delete(txnId);
      throw new IdentityProviderError('ABDM_TXN_EXPIRED', 'Transaction has expired, request a new OTP');
    }
    if (otp !== MOCK_OTP) {
      // Left in place so the caller can retry with the correct OTP.
      throw new IdentityProviderError('ABDM_INVALID_OTP', 'The OTP entered is incorrect');
    }

    txn.used = true;
    return txn;
  }

  /** Same input always yields the same (checksum-valid) ABHA number. */
  private deterministicAbha(suffix: string): string {
    const padded = suffix.padStart(4, '0').slice(-4);
    const payload = `91${'0'.repeat(7)}${padded}`; // 13 digits
    return `${payload}${verhoeffCheckDigit(payload)}`;
  }

  private mask(value: string): string {
    const digits = value.replace(/\D/g, '');
    return digits.length <= 4 ? 'XXXX' : `${'X'.repeat(digits.length - 4)}${digits.slice(-4)}`;
  }

  private sweep(): void {
    const cutoff = Date.now() - TXN_TTL_MS;
    for (const [id, txn] of this.txns) {
      if (txn.createdAt < cutoff) this.txns.delete(id);
    }
  }
}
