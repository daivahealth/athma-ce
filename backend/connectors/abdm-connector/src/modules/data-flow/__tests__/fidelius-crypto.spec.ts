import { describe, expect, it, beforeEach } from '@jest/globals';
import * as crypto from 'crypto';
import { FideliusCryptoService } from '../fidelius-crypto.service';

describe('FideliusCryptoService (ABDM data-transfer encryption)', () => {
  const service = new FideliusCryptoService();

  it('round-trips a payload sender→receiver with independent key material', () => {
    const sender = service.generateKeyMaterial();
    const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519');
    const spki = publicKey.export({ type: 'spki', format: 'der' });
    const receiverPub = spki.subarray(spki.length - 32).toString('base64');
    const receiverNonce = crypto.randomBytes(32).toString('base64');

    const payload = JSON.stringify({ resourceType: 'Bundle', id: 'b1', patient: 'राजेश' });
    const content = service.encrypt(payload, sender, receiverPub, receiverNonce);
    const decrypted = service.decrypt(content, privateKey, receiverNonce, sender.publicKey, sender.nonce);
    expect(decrypted).toBe(payload);
  });

  it('accepts SPKI/DER-encoded receiver public keys as well as raw 32-byte ones', () => {
    const sender = service.generateKeyMaterial();
    const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519');
    const der = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
    const receiverNonce = crypto.randomBytes(32).toString('base64');
    const content = service.encrypt('hello', sender, der, receiverNonce);
    expect(service.decrypt(content, privateKey, receiverNonce, sender.publicKey, sender.nonce)).toBe('hello');
  });

  it('rejects tampered ciphertext (GCM auth)', () => {
    const sender = service.generateKeyMaterial();
    const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519');
    const spki = publicKey.export({ type: 'spki', format: 'der' });
    const receiverPub = spki.subarray(spki.length - 32).toString('base64');
    const receiverNonce = crypto.randomBytes(32).toString('base64');
    const content = Buffer.from(service.encrypt('secret', sender, receiverPub, receiverNonce), 'base64');
    content[0] ^= 0xff;
    expect(() =>
      service.decrypt(content.toString('base64'), privateKey, receiverNonce, sender.publicKey, sender.nonce),
    ).toThrow();
  });

  it('produces distinct ciphertexts per transfer (fresh keys and nonces)', () => {
    const { publicKey } = crypto.generateKeyPairSync('x25519');
    const spki = publicKey.export({ type: 'spki', format: 'der' });
    const receiverPub = spki.subarray(spki.length - 32).toString('base64');
    const receiverNonce = crypto.randomBytes(32).toString('base64');
    const a = service.encrypt('same-payload', service.generateKeyMaterial(), receiverPub, receiverNonce);
    const b = service.encrypt('same-payload', service.generateKeyMaterial(), receiverPub, receiverNonce);
    expect(a).not.toBe(b);
  });
});
