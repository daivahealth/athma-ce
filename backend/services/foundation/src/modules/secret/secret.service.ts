import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { SecretCryptoService, SecretEnvelope } from './secret-crypto.service';

export interface SecretScope {
  tenantId: string;
  facilityId?: string | undefined;
  ownerId: string;
  key: string;
}

/**
 * Tenant secret storage (issue #81). Write-only from the admin surface:
 * values go in and are only ever released to internal service consumers via
 * getValue(), with every access audited. List/metadata APIs never include
 * values or ciphertext.
 */
@Injectable()
export class SecretService {
  private readonly logger = new Logger(SecretService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: SecretCryptoService,
  ) {}

  async put(scope: SecretScope, value: string, userId?: string) {
    const { envelope, keyVersion } = this.crypto.encrypt(value);
    const existing = await this.find(scope);

    const data = {
      ciphertext: JSON.stringify(envelope),
      keyVersion,
      updatedBy: userId ?? null,
    };

    const saved = existing
      ? await this.prisma.tenantSecret.update({ where: { id: existing.id }, data })
      : await this.prisma.tenantSecret.create({
          data: {
            tenantId: scope.tenantId,
            facilityId: scope.facilityId ?? null,
            ownerId: scope.ownerId,
            key: scope.key,
            ...data,
            createdBy: userId ?? null,
          },
        });

    await this.audit(scope, 'write', userId);
    return this.toMetadata(saved);
  }

  /** Metadata only — never values, never ciphertext. */
  async list(tenantId: string, ownerId?: string) {
    const secrets = await this.prisma.tenantSecret.findMany({
      where: { tenantId, ...(ownerId ? { ownerId } : {}) },
      orderBy: [{ ownerId: 'asc' }, { key: 'asc' }],
    });
    return secrets.map((s) => this.toMetadata(s));
  }

  async delete(scope: SecretScope, userId?: string) {
    const existing = await this.find(scope);
    if (!existing) {
      throw new NotFoundException(`Secret '${scope.ownerId}/${scope.key}' not found`);
    }
    await this.prisma.tenantSecret.delete({ where: { id: existing.id } });
    await this.audit(scope, 'delete', userId);
    return { deleted: true };
  }

  /**
   * Decrypts a secret for an internal service consumer. `consumer` names the
   * calling service for the audit trail. Falls back from facility scope to
   * tenant scope so a tenant-wide credential serves all facilities unless a
   * facility-specific one exists.
   */
  async getValue(scope: SecretScope, consumer: string): Promise<string> {
    let record = await this.find(scope);
    if (!record && scope.facilityId) {
      record = await this.find({ ...scope, facilityId: undefined });
    }
    if (!record) {
      throw new NotFoundException(`Secret '${scope.ownerId}/${scope.key}' not configured`);
    }
    const value = this.crypto.decrypt(JSON.parse(record.ciphertext) as SecretEnvelope);
    await this.audit(
      {
        tenantId: record.tenantId,
        facilityId: record.facilityId ?? undefined,
        ownerId: record.ownerId,
        key: record.key,
      },
      'read',
      `service:${consumer}`,
    );
    return value;
  }

  /**
   * Re-wraps every envelope not on the current master key version.
   * Value ciphertext is untouched; only wrapped DEKs are rewritten.
   */
  async rotate(userId?: string) {
    const all = await this.prisma.tenantSecret.findMany();
    let rotated = 0;
    for (const record of all) {
      const result = this.crypto.rewrap(JSON.parse(record.ciphertext) as SecretEnvelope);
      if (!result) continue;
      await this.prisma.tenantSecret.update({
        where: { id: record.id },
        data: {
          ciphertext: JSON.stringify(result.envelope),
          keyVersion: result.keyVersion,
          rotatedAt: new Date(),
          updatedBy: userId ?? null,
        },
      });
      await this.audit(
        {
          tenantId: record.tenantId,
          facilityId: record.facilityId ?? undefined,
          ownerId: record.ownerId,
          key: record.key,
        },
        'rotate',
        userId,
      );
      rotated++;
    }
    this.logger.log(`Master key rotation: ${rotated}/${all.length} secret(s) re-wrapped`);
    return { total: all.length, rotated };
  }

  private find(scope: SecretScope) {
    return this.prisma.tenantSecret.findFirst({
      where: {
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        ownerId: scope.ownerId,
        key: scope.key,
      },
    });
  }

  private audit(scope: SecretScope, action: string, actor?: string) {
    return this.prisma.secretAccessLog.create({
      data: {
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        ownerId: scope.ownerId,
        key: scope.key,
        action,
        actor: actor ?? null,
      },
    });
  }

  private toMetadata(s: {
    id: string;
    tenantId: string;
    facilityId: string | null;
    ownerId: string;
    key: string;
    keyVersion: number;
    rotatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: s.id,
      tenantId: s.tenantId,
      facilityId: s.facilityId,
      ownerId: s.ownerId,
      key: s.key,
      configured: true,
      keyVersion: s.keyVersion,
      rotatedAt: s.rotatedAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
