// PreAuth status enum
export enum PreAuthStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    PARTIALLY_APPROVED = 'partially_approved',
    DENIED = 'denied',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

// PreAuth urgency level
export enum PreAuthUrgency {
    ROUTINE = 'routine',
    URGENT = 'urgent',
    EMERGENCY = 'emergency',
}

// DTO for creating a pre-authorization request
export class CreatePreAuthDto {
    patientId!: string;
    payerId!: string;
    policyId?: string;
    encounterId?: string;
    urgency?: PreAuthUrgency;
    requestedServices!: RequestedService[];
    clinicalNotes?: string;
    scheduledDate?: Date;
}

export class RequestedService {
    procedureCode!: string;
    procedureCodeType?: string;
    description?: string;
    quantity?: number;
    estimatedCost?: number;
    diagnosisCodes?: string[];
}

// DTO for updating a pre-authorization
export class UpdatePreAuthDto {
    status?: PreAuthStatus;
    authorizationNumber?: string;
    approvedServices?: ApprovedService[];
    denialReason?: string;
    validFrom?: Date;
    validTo?: Date;
}

export class ApprovedService {
    procedureCode!: string;
    approvedQuantity!: number;
    approvedAmount?: number;
}

// DTO for filtering pre-auth requests
export class PreAuthFilterDto {
    patientId?: string;
    payerId?: string;
    encounterId?: string;
    status?: PreAuthStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}
