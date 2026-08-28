import { Allow, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// Denial status enum
export enum DenialStatus {
    OPEN = 'open',
    APPEALING = 'appealing',
    UPHELD = 'upheld',
    OVERTURNED = 'overturned',
}

// Appeal status enum
export enum AppealStatus {
    DRAFT = 'draft',
    FILED = 'filed',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

// A supporting reference attached to an appeal (document, note, prior-auth number, etc.)
export class AppealSupportingRef {
    type!: string;
    ref!: string;
    description?: string;
}

// DTO for recording a denial against a claim
export class CreateDenialDto {
    @IsString()
    claimId!: string;
    @IsString()
    denialCode!: string;
    @IsString()
    denialReason!: string;
    @IsNumber()
    deniedAmount!: number;
    @IsOptional()
    @IsString()
    currency?: string;
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    remarkCodes?: string[];
    @IsOptional()
    @Allow()
    deniedAt?: Date;
    @IsOptional()
    @Allow()
    appealDeadline?: Date;
    @IsOptional()
    @Allow()
    status?: DenialStatus;
}

// DTO for drafting an appeal against a denial
export class CreateAppealDto {
    @IsString()
    narrative!: string;
    @IsOptional()
    @IsString()
    justification?: string;
    @IsOptional()
    @Allow()
    supportingRefs?: AppealSupportingRef[];
}

// DTO for filing a drafted appeal
export class FileAppealDto {
    @IsOptional()
    @IsString()
    narrative?: string;
    @IsOptional()
    @IsString()
    justification?: string;
    @IsOptional()
    @Allow()
    supportingRefs?: AppealSupportingRef[];
}

// DTO for filtering denials list
export class DenialFilterDto {
    @IsOptional() @IsString() claimId?: string;
    @IsOptional() @IsString() encounterId?: string;
    @IsOptional() @IsString() patientId?: string;
    @IsOptional() @IsEnum(DenialStatus) status?: DenialStatus;
    @IsOptional() @Type(() => Number) @IsInt() limit?: number;
    @IsOptional() @Type(() => Number) @IsInt() offset?: number;
}
