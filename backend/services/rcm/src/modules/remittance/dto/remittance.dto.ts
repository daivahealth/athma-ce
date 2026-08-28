import { Allow, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
// Remittance status enum
export enum RemittanceStatus {
    RECEIVED = 'received',
    PROCESSING = 'processing',
    PROCESSED = 'processed',
    RECONCILED = 'reconciled',
    ERROR = 'error',
}

// Remittance format
export enum RemittanceFormat {
    ERA_835 = 'ERA_835',
    EOB_PDF = 'EOB_PDF',
    MANUAL = 'MANUAL',
    JSON = 'JSON',
}

// DTO for uploading/creating a remittance
export class CreateRemittanceDto {
    @IsString()
    payerId!: string;
    @Allow()
    format!: RemittanceFormat;
    @IsOptional()
    @IsString()
    checkNumber?: string;
    @IsOptional()
    @Allow()
    checkDate?: Date;
    @IsNumber()
    paymentAmount!: number;
    @IsOptional()
    @IsString()
    fileContent?: string;
    @IsOptional()
    @IsString()
    fileName?: string;
}

// DTO for remittance line items
export class RemittanceLineDto {
    @IsOptional()
    @IsString()
    claimId?: string;
    @IsString()
    claimNumber!: string;
    @IsOptional()
    @Allow()
    serviceDate?: Date;
    @IsNumber()
    billedAmount!: number;
    @IsOptional()
    @IsNumber()
    allowedAmount?: number;
    @IsNumber()
    paidAmount!: number;
    @IsOptional()
    @IsNumber()
    patientResponsibility?: number;
    @IsOptional()
    @Allow()
    adjustmentCodes?: AdjustmentCode[];
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    remarkCodes?: string[];
}

export class AdjustmentCode {
    code!: string;
    reason!: string;
    amount!: number;
}

// DTO for filtering remittances
export class RemittanceFilterDto {
    @IsOptional()
    @IsString()
    payerId?: string;
    @IsOptional()
    @Allow()
    status?: RemittanceStatus;
    @IsOptional()
    @Allow()
    dateFrom?: Date;
    @IsOptional()
    @Allow()
    dateTo?: Date;
    @IsOptional()
    @IsNumber()
    limit?: number;
    @IsOptional()
    @IsNumber()
    offset?: number;
}

// Reconciliation result
export class ReconciliationResultDto {
    @IsString()
    remittanceId!: string;
    @IsNumber()
    matchedLines!: number;
    @IsNumber()
    unmatchedLines!: number;
    @IsNumber()
    totalPaid!: number;
    @IsNumber()
    totalAdjusted!: number;
    @Allow()
    matchedClaims!: Array<{
        claimId: string;
        claimNumber: string;
        paidAmount: number;
    }>;
    @IsOptional()
    @Allow()
    unmatchedLines_details?: Array<{
        claimNumber: string;
        reason: string;
    }>;
}
