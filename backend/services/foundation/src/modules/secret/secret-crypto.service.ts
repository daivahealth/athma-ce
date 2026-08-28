import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Envelope encryption for tenant secrets (issue #81, ADR-0015 §5).
 *
 * Each secret value is encrypted with its own random 256-bit data key (DEK)
 * using AES-256-GCM; the DEK is wrapped with a versioned master key. Rotation
 * re-wraps only the DEK — the value's own ciphertext never has to be touched.
 *
 * Master keys come from the environment for self-hosted deployments:
 *   SECRETS_MASTER_KEY           base64-encoded 32 bytes (current)
 *   SECRETS_MASTER_KEY_VERSION   integer version of the current key (default 1)
 *   SECRETS_MASTER_KEY_PREVIOUS  optional previous key, readable during rotation
 *   SECRETS_MASTER_KEY_PREVIOUS_VERSION  its version (default current - 1)
 *
 * A KMS-backed provider can replace this key source later without changing
 * the envelope format. FAILS CLOSED: a missing/invalid master key makes every
 * operation throw — a dependent integration goes unavailable, never
 * silently unencrypted.
 */

export interface SecretEnvelope {
  /** Master key version that wrapped the DEK. */
  v: number;
  /** AES-GCM parameters for the value, all base64. */
  iv: string;
  tag: string;
  ct: string;
  /** AES-GCM parameters for the wrapped DEK, all base64. */
  dekIv: string;
  dekTag: string;
  wrappedDek: string;
}

const KEY_BYTES = 32;
const IV_BYTES = 12;

@Injectable()
export class SecretCryptoService {
  private readonly logger = new Logger(SecretCryptoService.name);

  encrypt(plaintext: string): { envelope: SecretEnvelope; keyVersion: number } {
    const { key: masterKey, version } = this.currentMasterKey();

    const dek = randomBytes(KEY_BYTES);
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv('aes-256-gcm', dek, iv);
    const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    const dekIv = randomBytes(IV_BYTES);
    const wrap = createCipheriv('aes-256-gcm', masterKey, dekIv);
    const wrappedDek = Buffer.concat([wrap.update(dek), wrap.final()]);
    const dekTag = wrap.getAuthTag();
    dek.fill(0);

    return {
      keyVersion: version,
      envelope: {
        v: version,
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        ct: ct.toString('base64'),
        dekIv: dekIv.toString('base64'),
        dekTag: dekTag.toString('base64'),
        wrappedDek: wrappedDek.toString('base64'),
      },
    };
  }

  decrypt(envelope: SecretEnvelope): string {
    const dek = this.unwrapDek(envelope);
    try {
      const decipher = createDecipheriv(
        'aes-256-gcm',
        dek,
        Buffer.from(envelope.iv, 'base64'),
      );
      decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
      return Buffer.concat([
        decipher.update(Buffer.from(envelope.ct, 'base64')),
        decipher.final(),
      ]).toString('utf8');
    } finally {
      dek.fill(0);
    }
  }

  /**
   * Re-wraps the DEK under the current master key. Only touches key material —
   * the value ciphertext is carried over unchanged. No-op (returns null) when
   * the envelope is already on the current version.
   */
  rewrap(envelope: SecretEnvelope): { envelope: SecretEnvelope; keyVersion: number } | null {
    const { key: masterKey, version } = this.currentMasterKey();
    if (envelope.v === version) return null;

    const dek = this.unwrapDek(envelope);
    try {
      const dekIv = randomBytes(IV_BYTES);
      const wrap = createCipheriv('aes-256-gcm', masterKey, dekIv);
      const wrappedDek = Buffer.concat([wrap.update(dek), wrap.final()]);
      const dekTag = wrap.getAuthTag();
      return {
        keyVersion: version,
        envelope: {
          ...envelope,
          v: version,
          dekIv: dekIv.toString('base64'),
          dekTag: dekTag.toString('base64'),
          wrappedDek: wrappedDek.toString('base64'),
        },
      };
    } finally {
      dek.fill(0);
    }
  }

  private unwrapDek(envelope: SecretEnvelope): Buffer {
    const masterKey = this.masterKeyForVersion(envelope.v);
    const unwrap = createDecipheriv(
      'aes-256-gcm',
      masterKey,
      Buffer.from(envelope.dekIv, 'base64'),
    );
    unwrap.setAuthTag(Buffer.from(envelope.dekTag, 'base64'));
    try {
      return Buffer.concat([
        unwrap.update(Buffer.from(envelope.wrappedDek, 'base64')),
        unwrap.final(),
      ]);
    } catch {
      // GCM auth failure: wrong key for this version, or corrupted envelope.
      throw new ServiceUnavailableException(
        `Cannot unwrap secret data key (master key v${envelope.v} invalid or mismatched)`,
      );
    }
  }

  private currentMasterKey(): { key: Buffer; version: number } {
    const key = this.parseKey(process.env.SECRETS_MASTER_KEY, 'SECRETS_MASTER_KEY');
    const version = parseInt(process.env.SECRETS_MASTER_KEY_VERSION ?? '1', 10);
    if (!Number.isInteger(version) || version < 1) {
      throw new ServiceUnavailableException('SECRETS_MASTER_KEY_VERSION must be a positive integer');
    }
    return { key, version };
  }

  private masterKeyForVersion(version: number): Buffer {
    const current = this.currentMasterKey();
    if (version === current.version) return current.key;

    const prevRaw = process.env.SECRETS_MASTER_KEY_PREVIOUS;
    const prevVersion = parseInt(
      process.env.SECRETS_MASTER_KEY_PREVIOUS_VERSION ?? String(current.version - 1),
      10,
    );
    if (prevRaw && version === prevVersion) {
      return this.parseKey(prevRaw, 'SECRETS_MASTER_KEY_PREVIOUS');
    }
    throw new ServiceUnavailableException(
      `No master key available for envelope version ${version} (current v${current.version})`,
    );
  }

  private parseKey(raw: string | undefined, name: string): Buffer {
    if (!raw) {
      this.logger.error(`${name} is not configured — secret operations are disabled`);
      throw new ServiceUnavailableException('Secret storage is not configured on this server');
    }
    const key = Buffer.from(raw, 'base64');
    if (key.length !== KEY_BYTES) {
      this.logger.error(`${name} must be base64 for exactly ${KEY_BYTES} bytes`);
      throw new ServiceUnavailableException('Secret storage is misconfigured on this server');
    }
    return key;
  }
}
