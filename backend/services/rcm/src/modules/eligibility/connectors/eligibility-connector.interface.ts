import { EligibilityRequestType, BenefitsSummary } from '../dto/eligibility.dto';

/**
 * Eligibility check request payload
 */
export interface EligibilityCheckPayload {
    patientId: string;
    payerId: string;
    policyId?: string;
    memberId?: string;
    memberName?: string;
    dateOfBirth?: Date;
    requestType: EligibilityRequestType;
    serviceTypes: string[];
    serviceDate?: Date;
    providerNpi?: string;
    facilityId?: string;
}

/**
 * Eligibility check response from connector
 */
export interface EligibilityCheckResponse {
    success: boolean;
    isEligible?: boolean;
    eligibilityStart?: Date;
    eligibilityEnd?: Date;
    benefitsSummary?: BenefitsSummary;
    rawResponse?: unknown;
    errors?: Array<{
        code: string;
        message: string;
    }>;
}

/**
 * Strategy interface for eligibility connectors
 * Implementations handle specific payer integrations
 */
export interface EligibilityConnector {
    /**
     * The connector identifier
     */
    readonly connectorId: string;

    /**
     * Human-readable name
     */
    readonly displayName: string;

    /**
     * Supported payer types or regions
     */
    readonly supportedPayerTypes: string[];

    /**
     * Check eligibility with the payer
     */
    checkEligibility(payload: EligibilityCheckPayload): Promise<EligibilityCheckResponse>;

    /**
     * Check benefits (more detailed than eligibility)
     */
    checkBenefits?(payload: EligibilityCheckPayload): Promise<EligibilityCheckResponse>;
}
