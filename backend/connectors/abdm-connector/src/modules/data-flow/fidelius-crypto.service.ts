/**
 * ABDM data-transfer encryption (issue #116), per the Fidelius reference used
 * across the ABDM ecosystem:
 *
 *   shared secret = ECDH-Curve25519(sender private, receiver public)
 *   xorOfNonces   = senderNonce XOR receiverNonce   (32 bytes each)
 *   key           = HKDF-SHA256(sharedSecret, salt = xorOfNonces[0..20), 32B)
 *   iv            = xorOfNonces[20..32)             (last 12 bytes)
 *   ciphertext    = AES-256-GCM(payload, key, iv)   (auth tag appended)
 *
 * Public keys are accepted as base64 of either the raw 32-byte X25519 key or
 * an SPKI/DER encoding — implementations in the wild use both. Coded against
 * the published Fidelius behavior with the usual reconciliation caveat once
 * sandbox interop runs.
 */

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface SenderKeyMaterial {
  /** base64 raw 32-byte X25519 public key (what we publish to the HIU). */
  publicKey: string;
  nonce: string;
  privateKey: crypto.KeyObject;
}

const X25519_SPKI_PREFIX = Buffer.from('302a300506032b656e032100', 'hex');

@Injectable()
export class FideliusCryptoService {
  generateKeyMaterial(): SenderKeyMaterial {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519');
    const spki = publicKey.export({ type: 'spki', format: 'der' });
    return {
      publicKey: spki.subarray(spki.length - 32).toString('base64'),
      nonce: crypto.randomBytes(32).toString('base64'),
      privateKey,
    };
  }

  encrypt(
    payload: string,
    sender: SenderKeyMaterial,
    receiverPublicKeyB64: string,
    receiverNonceB64: string,
  ): string {
    const receiverKey = this.importPublicKey(receiverPublicKeyB64);
    const sharedSecret = crypto.diffieHellman({
      privateKey: sender.privateKey,
      publicKey: receiverKey,
    });

    const { key, iv } = this.deriveKeyAndIv(
      sharedSecret,
      Buffer.from(sender.nonce, 'base64'),
      Buffer.from(receiverNonceB64, 'base64'),
    );

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
    return Buffer.concat([ciphertext, cipher.getAuthTag()]).toString('base64');
  }

  /** Receiver-side decrypt — used by tests and, later, the HIU path (#83). */
  decrypt(
    contentB64: string,
    receiverPrivateKey: crypto.KeyObject,
    receiverNonceB64: string,
    senderPublicKeyB64: string,
    senderNonceB64: string,
  ): string {
    const senderKey = this.importPublicKey(senderPublicKeyB64);
    const sharedSecret = crypto.diffieHellman({
      privateKey: receiverPrivateKey,
      publicKey: senderKey,
    });
    const { key, iv } = this.deriveKeyAndIv(
      sharedSecret,
      Buffer.from(senderNonceB64, 'base64'),
      Buffer.from(receiverNonceB64, 'base64'),
    );
    const raw = Buffer.from(contentB64, 'base64');
    const tag = raw.subarray(raw.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(raw.subarray(0, raw.length - 16)), decipher.final()]).toString('utf8');
  }

  private deriveKeyAndIv(
    sharedSecret: Buffer,
    senderNonce: Buffer,
    receiverNonce: Buffer,
  ): { key: Buffer; iv: Buffer } {
    const xor = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
      xor[i] = (senderNonce[i] ?? 0) ^ (receiverNonce[i] ?? 0);
    }
    const key = Buffer.from(crypto.hkdfSync('sha256', sharedSecret, xor.subarray(0, 20), '', 32));
    return { key, iv: xor.subarray(20, 32) };
  }

  private importPublicKey(b64: string): crypto.KeyObject {
    const raw = Buffer.from(b64, 'base64');
    const der = raw.length === 32 ? Buffer.concat([X25519_SPKI_PREFIX, raw]) : raw;
    return crypto.createPublicKey({ key: der, format: 'der', type: 'spki' });
  }
}
