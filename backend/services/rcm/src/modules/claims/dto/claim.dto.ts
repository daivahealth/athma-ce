import { Allow, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// Claims status enum
export enum ClaimStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    READY = 'ready',
    SCRUBBING = 'scrubbing',
    VALIDATED = 'validated',
    FAILED_VALIDATION = 'failed_validation',
    SUBMITTED = 'submitted',
    ACKNOWLEDGED = 'acknowledged',
    REJECTED = 'rejected',
    PENDING_ADJUDICATION = 'pending_adjudication',
    ADJUDICATED = 'adjudicated',
    PAID = 'paid',
    PARTIALLY_PAID = 'partially_paid',
    DENIED = 'denied',
    APPEALED = 'appealed',
    CANCELLED = 'cancelled',
}

// DTO for creating a claim
export class CreateClaimDto {
    @IsString()
    patientId!: string;
    @IsOptional()
    @IsString()
    encounterId?: string;
    @IsOptional()
    @IsString()
    payerId?: string;
    @Allow()
    serviceDate!: Date;
    @IsOptional()
    @IsString()
    currency?: string;
    @IsOptional()
    @IsString()
    notes?: string;
}

// DTO for updating a claim
export class UpdateClaimDto {
    @IsOptional()
    @Allow()
    status?: ClaimStatus;
    @IsOptional()
    @IsString()
    payerId?: string;
    @IsOptional()
    @IsNumber()
    totalAmount?: number;
    @IsOptional()
    @IsString()
    currency?: string;
    @IsOptional()
    @IsString()
    notes?: string;
}

// DTO for generating claims from encounters
export class GenerateClaimsDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    encounterIds?: string[];
    @IsOptional()
    @IsString()
    patientId?: string;
    @IsOptional()
    @Allow()
    dateFrom?: Date;
    @IsOptional()
    @Allow()
    dateTo?: Date;
    @IsOptional()
    @IsString()
    payerId?: string;
}

// DTO for filtering claims list
export class ClaimFilterDto {
    @IsOptional() @IsString() patientId?: string;
    @IsOptional() @IsString() encounterId?: string;
    @IsOptional() @IsString() payerId?: string;
    @IsOptional() status?: ClaimStatus;
    @IsOptional() @IsString() batchId?: string;
    @IsOptional() dateFrom?: Date;
    @IsOptional() dateTo?: Date;
    @IsOptional() limit?: number;
    @IsOptional() offset?: number;
}

// DTO for claim validation result
export class ValidationResultDto {
    @IsBoolean()
    isValid!: boolean;
    @Allow()
    errors!: ValidationError[];
    @Allow()
    warnings!: ValidationWarning[];
}

export class ValidationError {
    code!: string;
    field?: string;
    message!: string;
}

export class ValidationWarning {
    code!: string;
    field?: string;
    message!: string;
}

// DTO for claim submission result
export class SubmissionResultDto {
    @IsBoolean()
    success!: boolean;
    @IsString()
    claimId!: string;
    @IsOptional()
    @IsString()
    submissionRef?: string;
    @IsOptional()
    @Allow()
    submittedAt?: Date;
    @IsOptional()
    @IsString()
    error?: string;
}
