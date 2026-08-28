import { Allow, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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
    @IsOptional()
    @IsString()
    patientId?: string;
    @IsOptional()
    @IsString()
    payerId?: string;
    @IsOptional()
    @Allow()
    status?: EligibilityStatus;
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

// Eligibility response structure
export class EligibilityResponseDto {
    @IsString()
    requestId!: string;
    @Allow()
    status!: EligibilityStatus;
    @IsOptional()
    @IsBoolean()
    isEligible?: boolean;
    @IsOptional()
    @Allow()
    eligibilityStart?: Date;
    @IsOptional()
    @Allow()
    eligibilityEnd?: Date;
    @IsOptional()
    @Allow()
    benefitsSummary?: BenefitsSummary;
    @IsOptional()
    @Allow()
    errors?: EligibilityError[];
}


export class EligibilityError {
    code!: string;
    message!: string;
}
