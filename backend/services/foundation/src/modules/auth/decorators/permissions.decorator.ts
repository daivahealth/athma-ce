import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

/**
 * Lets the caller through without the @Permissions check when the named route
 * parameter is their own user id (reading one's own profile or facilities).
 * Only use it on GET handlers that return the caller's own data.
 */
export const ALLOW_SELF_KEY = 'allowSelfParam';
export const AllowSelf = (param: string) => SetMetadata(ALLOW_SELF_KEY, param);
