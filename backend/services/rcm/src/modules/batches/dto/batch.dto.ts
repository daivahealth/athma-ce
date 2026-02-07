// Batch status enum
export enum BatchStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    SUBMITTING = 'submitting',
    SUBMITTED = 'submitted',
    ACKNOWLEDGED = 'acknowledged',
    REJECTED = 'rejected',
    PARTIALLY_PROCESSED = 'partially_processed',
}

// Batch type enum
export enum BatchType {
    PROFESSIONAL = 'professional',
    INSTITUTIONAL = 'institutional',
    DENTAL = 'dental',
    PHARMACY = 'pharmacy',
}

// DTO for creating a batch
export class CreateBatchDto {
    batchType?: BatchType;
    claimFormat!: string;
    payerId?: string;
}

// DTO for updating a batch
export class UpdateBatchDto {
    status?: BatchStatus;
    submissionRef?: string;
}

// DTO for adding claims to batch
export class AddClaimsToBatchDto {
    claimIds!: string[];
}

// DTO for filtering batches
export class BatchFilterDto {
    payerId?: string;
    status?: BatchStatus;
    batchType?: BatchType;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}
