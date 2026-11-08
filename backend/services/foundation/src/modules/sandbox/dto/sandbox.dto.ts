import { Transform } from 'class-transformer';
import { ArrayMaxSize, Equals, IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { SANDBOX_MODULES, SANDBOX_ORGANISATION_TYPES, type SandboxOrganisationType } from '../sandbox.settings';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value);

export class CreateSandboxDto {
  @Transform(trim)
  @IsString()
  @Length(2, 120)
  organisationName!: string;

  @IsIn(SANDBOX_ORGANISATION_TYPES)
  organisationType!: SandboxOrganisationType;

  /** Omit to use the organisation type's defaults. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SANDBOX_MODULES.length)
  @IsIn(SANDBOX_MODULES, { each: true })
  modules?: string[];

  /** The visitor acknowledges the sandbox is temporary and must hold no real patient data. */
  @Equals(true)
  acknowledged!: boolean;
}

export class SwitchWorkspaceDto {
  @IsIn(['sandbox', 'demo'])
  target!: 'sandbox' | 'demo';
}
