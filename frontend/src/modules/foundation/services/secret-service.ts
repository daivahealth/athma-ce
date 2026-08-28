import { foundationClient } from '@/lib/api/client';

/**
 * Tenant secrets (write-only credential store, issue #102). Values can be
 * written and rotated but NEVER read back — list returns metadata only.
 */
export interface SecretMetadata {
  id: string;
  tenantId: string;
  facilityId: string | null;
  ownerId: string;
  key: string;
  configured: boolean;
  keyVersion: number;
  rotatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const secretService = {
  /** Metadata only — no values, ever. */
  async list(tenantId: string, ownerId?: string): Promise<SecretMetadata[]> {
    const response = await foundationClient.get(`/secrets/tenant/${tenantId}`, {
      params: ownerId ? { ownerId } : {},
    });
    return response.data?.data ?? [];
  },

  /** Write a secret value. The response never echoes the value. */
  async put(
    tenantId: string,
    key: string,
    payload: { value: string; ownerId: string; facilityId?: string },
  ): Promise<SecretMetadata> {
    const response = await foundationClient.put(`/secrets/tenant/${tenantId}/${key}`, payload);
    return response.data?.data;
  },

  async remove(
    tenantId: string,
    key: string,
    params: { ownerId: string; facilityId?: string },
  ): Promise<void> {
    await foundationClient.delete(`/secrets/tenant/${tenantId}/${key}`, { params });
  },
};
