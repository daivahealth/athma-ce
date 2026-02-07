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
    patientId!: string;
    encounterId?: string;
    payerId?: string;
    serviceDate!: Date;
    currency?: string;
    notes?: string;
}

// DTO for updating a claim
export class UpdateClaimDto {
    status?: ClaimStatus;
    payerId?: string;
    totalAmount?: number;
    currency?: string;
    notes?: string;
}

// DTO for generating claims from encounters
export class GenerateClaimsDto {
    encounterIds?: string[];
    patientId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    payerId?: string;
}

// DTO for filtering claims list
export class ClaimFilterDto {
    patientId?: string;
    encounterId?: string;
    payerId?: string;
    status?: ClaimStatus;
    batchId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}

// DTO for claim validation result
export class ValidationResultDto {
    isValid!: boolean;
    errors!: ValidationError[];
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
    success!: boolean;
    claimId!: string;
    submissionRef?: string;
    submittedAt?: Date;
    error?: string;
}
