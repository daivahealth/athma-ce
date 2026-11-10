import { Allow, IsArray, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MAX_SEARCH_LENGTH } from '../../../common/list-query';
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
    @IsOptional()
    @Allow()
    batchType?: BatchType;
    @IsString()
    claimFormat!: string;
    @IsOptional()
    @IsString()
    payerId?: string;
}

// DTO for updating a batch
export class UpdateBatchDto {
    @IsOptional()
    @Allow()
    status?: BatchStatus;
    @IsOptional()
    @IsString()
    submissionRef?: string;
}

// DTO for adding claims to batch
export class AddClaimsToBatchDto {
    @IsArray()
    @IsString({ each: true })
    claimIds!: string[];
}

// DTO for filtering batches
export class BatchFilterDto {
    @IsOptional()
    @IsString()
    payerId?: string;
    @IsOptional()
    @Allow()
    status?: BatchStatus;
    @IsOptional()
    @Allow()
    batchType?: BatchType;
    @IsOptional()
    @Allow()
    dateFrom?: Date;
    @IsOptional()
    @Allow()
    dateTo?: Date;
    /** Rows per page; clamped server-side to MAX_LIST_LIMIT. */
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    limit?: number;
    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    offset?: number;
    /** Free-text search, case-insensitive. */
    @IsOptional() @IsString() @MaxLength(MAX_SEARCH_LENGTH)
    search?: string;
}
