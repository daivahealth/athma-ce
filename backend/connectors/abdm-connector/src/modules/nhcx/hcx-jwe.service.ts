/**
 * HCX payload encryption (issue #122). The HCX protocol wraps every FHIR
 * payload in a compact JWE — RSA-OAEP-256 key wrap + A256GCM content
 * encryption — with the x-hcx-* protocol headers carried INSIDE the JWE
 * protected header (they are integrity-protected as the AAD).
 *
 * Implemented with node crypto only; verifiable locally with self-generated
 * RSA certs. Wire behavior carries the standing reconcile-on-sandbox caveat.
 */

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const b64u = (buf: Buffer): string => buf.toString('base64url');

@Injectable()
export class HcxJweService {
  /** Compact JWE of `payload`, protocol headers integrity-protected. */
  encrypt(
    payload: Record<string, unknown>,
    protocolHeaders: Record<string, string>,
    recipientPublicKeyPem: string,
  ): string {
    const header = { alg: 'RSA-OAEP-256', enc: 'A256GCM', ...protocolHeaders };
    const protectedB64 = b64u(Buffer.from(JSON.stringify(header)));

    const cek = crypto.randomBytes(32);
    const encryptedKey = crypto.publicEncrypt(
      {
        key: recipientPublicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      cek,
    );

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', cek, iv);
    cipher.setAAD(Buffer.from(protectedB64, 'ascii'));
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(payload), 'utf8'),
      cipher.final(),
    ]);

    return [
      protectedB64,
      b64u(encryptedKey),
      b64u(iv),
      b64u(ciphertext),
      b64u(cipher.getAuthTag()),
    ].join('.');
  }

  /** Decrypts a compact JWE with our participant private key. */
  decrypt(
    compact: string,
    privateKeyPem: string,
  ): { headers: Record<string, unknown>; payload: Record<string, unknown> } {
    const parts = compact.split('.');
    if (parts.length !== 5) throw new Error('Malformed JWE');
    const [protectedB64, ekB64, ivB64, ctB64, tagB64] = parts as [string, string, string, string, string];

    const headers = JSON.parse(Buffer.from(protectedB64, 'base64url').toString('utf8'));
    if (headers.alg !== 'RSA-OAEP-256' || headers.enc !== 'A256GCM') {
      throw new Error(`Unsupported JWE alg/enc '${headers.alg}/${headers.enc}'`);
    }

    const cek = crypto.privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(ekB64, 'base64url'),
    );

    const decipher = crypto.createDecipheriv('aes-256-gcm', cek, Buffer.from(ivB64, 'base64url'));
    decipher.setAAD(Buffer.from(protectedB64, 'ascii'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
    const payload = Buffer.concat([
      decipher.update(Buffer.from(ctB64, 'base64url')),
      decipher.final(),
    ]).toString('utf8');

    return { headers, payload: JSON.parse(payload) };
  }

  /** Protocol headers only (needed to correlate before/without decrypting). */
  readHeaders(compact: string): Record<string, unknown> {
    const protectedB64 = compact.split('.')[0] ?? '';
    return JSON.parse(Buffer.from(protectedB64, 'base64url').toString('utf8'));
  }
}
