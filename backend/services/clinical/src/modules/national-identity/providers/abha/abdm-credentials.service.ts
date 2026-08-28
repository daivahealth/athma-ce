/**
 * Resolves ABDM client credentials for a tenant/facility (issue #96).
 *
 * Source of truth is the Foundation TenantSecret store (owner 'abdm', keys
 * 'abdm.client_id' / 'abdm.client_secret'), scoped per FACILITY — in ABDM's
 * HRP model each facility is its own HIP with its own registration — with an
 * automatic fallback to tenant-scoped secrets (Foundation resolves
 * facility → tenant) for a tenant-wide registration.
 *
 * The ABDM_CLIENT_ID / ABDM_CLIENT_SECRET env vars remain a documented
 * fallback for single-tenant/self-hosted deployments only: they are consulted
 * when NO secret is stored for the tenant. In SaaS, tenants without stored
 * credentials get the mock gateway — one deployment's env credentials are
 * never silently shared across tenants that didn't configure their own.
 *
 * Failure semantics are inherited from SecretClient: a Foundation/crypto
 * failure THROWS (fails closed) — only a clean "not configured" falls through
 * to env/mock.
 */

import { Injectable, Logger } from '@nestjs/common';
import { secretClient } from '../../../../config';

export interface AbdmScope {
  tenantId: string;
  facilityId?: string | undefined;
}

export interface AbdmCredentials {
  clientId: string;
  clientSecret: string;
  source: 'secret' | 'env';
}

const OWNER_ID = 'abdm';
const CLIENT_ID_KEY = 'abdm.client_id';
const CLIENT_SECRET_KEY = 'abdm.client_secret';

@Injectable()
export class AbdmCredentialsService {
  private readonly logger = new Logger(AbdmCredentialsService.name);

  /** Resolved credentials, or null when the tenant has none (→ mock gateway). */
  async getCredentials(scope: AbdmScope): Promise<AbdmCredentials | null> {
    const ref = {
      tenantId: scope.tenantId,
      ...(scope.facilityId ? { facilityId: scope.facilityId } : {}),
      ownerId: OWNER_ID,
    };

    const [clientId, clientSecret] = await Promise.all([
      secretClient.getOptional({ ...ref, key: CLIENT_ID_KEY }),
      secretClient.getOptional({ ...ref, key: CLIENT_SECRET_KEY }),
    ]);

    if (clientId && clientSecret) {
      return { clientId, clientSecret, source: 'secret' };
    }
    if (clientId || clientSecret) {
      // Half-configured is treated as unconfigured, loudly — a silent mock
      // fallback here would mask an admin's incomplete setup.
      this.logger.warn(
        `Tenant ${scope.tenantId} has only one of ${CLIENT_ID_KEY}/${CLIENT_SECRET_KEY} configured — treating ABDM as unconfigured`,
      );
      return null;
    }

    const envId = process.env['ABDM_CLIENT_ID'];
    const envSecret = process.env['ABDM_CLIENT_SECRET'];
    if (envId && envSecret) {
      return { clientId: envId, clientSecret: envSecret, source: 'env' };
    }

    return null;
  }

  async hasCredentials(scope: AbdmScope): Promise<boolean> {
    return (await this.getCredentials(scope)) !== null;
  }
}
