import { describe, expect, it } from '@jest/globals';
import * as crypto from 'crypto';
import { HcxJweService } from '../hcx-jwe.service';

describe('HcxJweService (HCX payload encryption)', () => {
  const service = new HcxJweService();
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pub = publicKey.export({ type: 'spki', format: 'pem' }).toString();
  const priv = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const headers = {
    'x-hcx-sender_code': 'HOSP-001',
    'x-hcx-recipient_code': 'PAYER-9',
    'x-hcx-correlation_id': 'corr-1',
  };
  const payload = { resourceType: 'CoverageEligibilityRequest', patient: { reference: 'Patient/1' } };

  it('round-trips payload and protocol headers', () => {
    const jwe = service.encrypt(payload, headers, pub);
    const out = service.decrypt(jwe, priv);
    expect(out.payload).toEqual(payload);
    expect(out.headers['x-hcx-sender_code']).toBe('HOSP-001');
  });

  it('exposes protocol headers for correlation without decrypting', () => {
    const jwe = service.encrypt(payload, headers, pub);
    expect(service.readHeaders(jwe)['x-hcx-correlation_id']).toBe('corr-1');
  });

  it('rejects a tampered protected header (headers are the AAD)', () => {
    const jwe = service.encrypt(payload, headers, pub);
    const parts = jwe.split('.');
    parts[0] = Buffer.from(
      JSON.stringify({ ...service.readHeaders(jwe), 'x-hcx-sender_code': 'EVIL' }),
    ).toString('base64url');
    expect(() => service.decrypt(parts.join('.'), priv)).toThrow();
  });

  it('rejects decryption with the wrong private key', () => {
    const jwe = service.encrypt(payload, headers, pub);
    const other = crypto
      .generateKeyPairSync('rsa', { modulusLength: 2048 })
      .privateKey.export({ type: 'pkcs8', format: 'pem' })
      .toString();
    expect(() => service.decrypt(jwe, other)).toThrow();
  });

  it('rejects malformed and downgraded JWEs', () => {
    expect(() => service.decrypt('a.b.c', priv)).toThrow(/Malformed/);
    const jwe = service.encrypt(payload, headers, pub);
    const parts = jwe.split('.');
    parts[0] = Buffer.from(JSON.stringify({ alg: 'none', enc: 'A256GCM' })).toString('base64url');
    expect(() => service.decrypt(parts.join('.'), priv)).toThrow(/Unsupported/);
  });
});
