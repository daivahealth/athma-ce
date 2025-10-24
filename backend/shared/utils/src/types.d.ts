/**
 * Type declarations for extending Express Request
 */

import { JwtClaims } from '@zeal/contracts';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<JwtClaims> & { sub?: string };
      context?: {
        tenantId: string;
        userId: string;
        facilityId: string;
        userRole: string;
        ipAddress: string;
        userAgent: string;
      };
    }
  }
}
