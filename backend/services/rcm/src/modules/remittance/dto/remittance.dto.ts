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
    payerId!: string;
    format!: RemittanceFormat;
    checkNumber?: string;
    checkDate?: Date;
    paymentAmount!: number;
    fileContent?: string;
    fileName?: string;
}

// DTO for remittance line items
export class RemittanceLineDto {
    claimId?: string;
    claimNumber!: string;
    serviceDate?: Date;
    billedAmount!: number;
    allowedAmount?: number;
    paidAmount!: number;
    patientResponsibility?: number;
    adjustmentCodes?: AdjustmentCode[];
    remarkCodes?: string[];
}

export class AdjustmentCode {
    code!: string;
    reason!: string;
    amount!: number;
}

// DTO for filtering remittances
export class RemittanceFilterDto {
    payerId?: string;
    status?: RemittanceStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}

// Reconciliation result
export class ReconciliationResultDto {
    remittanceId!: string;
    matchedLines!: number;
    unmatchedLines!: number;
    totalPaid!: number;
    totalAdjusted!: number;
    matchedClaims!: Array<{
        claimId: string;
        claimNumber: string;
        paidAmount: number;
    }>;
    unmatchedLines_details?: Array<{
        claimNumber: string;
        reason: string;
    }>;
}
