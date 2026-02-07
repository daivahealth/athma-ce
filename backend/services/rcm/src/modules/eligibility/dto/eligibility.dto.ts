// Eligibility request status
export enum EligibilityStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    ERROR = 'error',
}

// Request type
export enum EligibilityRequestType {
    ELIGIBILITY = 'eligibility',
    BENEFITS = 'benefits',
}

// DTO for checking eligibility
export class CheckEligibilityDto {
    patientId!: string;
    payerId!: string;
    policyId?: string;
    encounterId?: string;
    requestType?: EligibilityRequestType;
    serviceTypes?: string[];
    serviceDate?: Date;
}

// DTO for filtering eligibility requests
export class EligibilityFilterDto {
    patientId?: string;
    payerId?: string;
    status?: EligibilityStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}

// Eligibility response structure
export class EligibilityResponseDto {
    requestId!: string;
    status!: EligibilityStatus;
    isEligible?: boolean;
    eligibilityStart?: Date;
    eligibilityEnd?: Date;
    benefitsSummary?: BenefitsSummary;
    errors?: EligibilityError[];
}

export class BenefitsSummary {
    copay?: number;
    coinsurance?: number;
    deductible?: number;
    deductibleMet?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
    coverageLevel?: string;
    planName?: string;
    networkStatus?: string;
}

export class EligibilityError {
    code!: string;
    message!: string;
}
