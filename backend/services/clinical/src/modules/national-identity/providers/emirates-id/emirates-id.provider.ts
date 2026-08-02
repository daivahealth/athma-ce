/**
 * Emirates ID provider (UAE).
 *
 * Validate-only: there is no online verification seam wired up for Emirates ID
 * today, so this provider advertises exactly one capability. It exists to prove
 * the abstraction holds for a document that *cannot* be verified online — the
 * generic service and UI must degrade gracefully rather than assume every
 * provider supports OTP.
 */

import { Injectable } from '@nestjs/common';
import { EmiratesIdValidator, type ValidationResult } from '@zeal/validators';
import {
  IdentityCapability,
  NationalIdentityProvider,
} from '../national-identity-provider.interface';

@Injectable()
export class EmiratesIdProvider implements NationalIdentityProvider {
  readonly country = 'AE';
  readonly identityType = 'emirates_id';
  readonly label = 'Emirates ID';
  readonly capabilities: ReadonlySet<IdentityCapability> = new Set<IdentityCapability>(['validate']);
  readonly loginHints: readonly string[] = [];

  private readonly validator = new EmiratesIdValidator();

  validate(value: string): ValidationResult {
    return this.validator.validate(value);
  }
}
