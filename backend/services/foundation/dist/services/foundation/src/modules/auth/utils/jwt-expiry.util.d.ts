import type { JwtSignOptions } from '@nestjs/jwt';
export type ExpiresInValue = NonNullable<JwtSignOptions['expiresIn']>;
export declare const resolveExpiresIn: (value: string | undefined, fallback: ExpiresInValue) => ExpiresInValue;
export declare const DEFAULT_ACCESS_TOKEN_EXPIRY: ExpiresInValue;
export declare const DEFAULT_REFRESH_TOKEN_EXPIRY: ExpiresInValue;
export declare const DEFAULT_RESET_TOKEN_EXPIRY: ExpiresInValue;
//# sourceMappingURL=jwt-expiry.util.d.ts.map