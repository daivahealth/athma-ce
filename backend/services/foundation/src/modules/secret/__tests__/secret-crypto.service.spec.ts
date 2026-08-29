import { describe, expect, it, beforeEach } from '@jest/globals';
import * as crypto from 'crypto';
import { SecretCryptoService } from '../secret-crypto.service';

describe('SecretCryptoService (tenant-secret envelope encryption)', () => {
  const service = new SecretCryptoService();
  const keyV1 = crypto.randomBytes(32).toString('base64');
  const keyV2 = crypto.randomBytes(32).toString('base64');

  beforeEach(() => {
    process.env.SECRETS_MASTER_KEY = keyV1;
    process.env.SECRETS_MASTER_KEY_VERSION = '1';
    delete process.env.SECRETS_MASTER_KEY_PREVIOUS;
    delete process.env.SECRETS_MASTER_KEY_PREVIOUS_VERSION;
  });

  it('round-trips a secret, including non-ASCII values', () => {
    const { envelope, keyVersion } = service.encrypt('abdm-secret-π-मूल्य');
    expect(keyVersion).toBe(1);
    expect(service.decrypt(envelope)).toBe('abdm-secret-π-मूल्य');
  });

  it('rotation re-wraps only the data key — value ciphertext stays identical', () => {
    const { envelope } = service.encrypt('rotate-me');
    expect(service.rewrap(envelope)).toBeNull(); // no-op on the current version

    process.env.SECRETS_MASTER_KEY = keyV2;
    process.env.SECRETS_MASTER_KEY_VERSION = '2';
    process.env.SECRETS_MASTER_KEY_PREVIOUS = keyV1;
    process.env.SECRETS_MASTER_KEY_PREVIOUS_VERSION = '1';

    const rotated = service.rewrap(envelope);
    expect(rotated?.keyVersion).toBe(2);
    expect(rotated?.envelope.ct).toBe(envelope.ct);
    expect(rotated?.envelope.wrappedDek).not.toBe(envelope.wrappedDek);
    expect(service.decrypt(rotated!.envelope)).toBe('rotate-me');
    // the old envelope is still readable through the previous-key window
    expect(service.decrypt(envelope)).toBe('rotate-me');
  });

  it('fails closed when no master key can serve the envelope version', () => {
    const { envelope } = service.encrypt('orphan');
    process.env.SECRETS_MASTER_KEY = keyV2;
    process.env.SECRETS_MASTER_KEY_VERSION = '2';
    expect(() => service.decrypt(envelope)).toThrow(/No master key available/);
  });

  it('fails closed when the master key is missing or malformed', () => {
    delete process.env.SECRETS_MASTER_KEY;
    expect(() => service.encrypt('x')).toThrow(/not configured/);
    process.env.SECRETS_MASTER_KEY = 'too-short';
    expect(() => service.encrypt('x')).toThrow(/misconfigured/);
  });

  it('rejects a corrupted envelope (GCM auth on the wrapped key)', () => {
    const { envelope } = service.encrypt('tamper');
    const corrupted = { ...envelope, wrappedDek: Buffer.from(crypto.randomBytes(48)).toString('base64') };
    expect(() => service.decrypt(corrupted)).toThrow();
  });
});
