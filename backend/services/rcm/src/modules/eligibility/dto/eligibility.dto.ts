import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

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

// DTO for checking eligibility. NOTE: previously undecorated — the global
// whitelist ValidationPipe stripped every property (see issue #128).
export class CheckEligibilityDto {
    @IsUUID()
    patientId!: string;

    @IsUUID()
    payerId!: string;

    @IsOptional()
    @IsUUID()
    policyId?: string;

    @IsOptional()
    @IsUUID()
    encounterId?: string;

    @IsOptional()
    @IsEnum(EligibilityRequestType)
    requestType?: EligibilityRequestType;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    serviceTypes?: string[];

    @IsOptional()
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
