import { Injectable, Logger } from '@nestjs/common';
import {
    EligibilityConnector,
    EligibilityCheckPayload,
    EligibilityCheckResponse,
} from './eligibility-connector.interface';
import { EligibilityRequestType } from '../dto/eligibility.dto';

/**
 * Mock Eligibility Connector
 * Used for development, testing, and demo purposes
 * Returns simulated responses based on request data
 */
@Injectable()
export class MockEligibilityConnector implements EligibilityConnector {
    private readonly logger = new Logger(MockEligibilityConnector.name);

    readonly connectorId = 'MOCK';
    readonly displayName = 'Mock Eligibility Connector (Development)';
    readonly supportedPayerTypes = ['*'];

    async checkEligibility(payload: EligibilityCheckPayload): Promise<EligibilityCheckResponse> {
        this.logger.log(`Mock eligibility check for patient ${payload.patientId}`);

        // Simulate network delay
        await this.delay(500);

        // Simulate different responses based on patient ID patterns
        if (payload.patientId.endsWith('_invalid')) {
            return {
                success: true,
                isEligible: false,
                errors: [
                    {
                        code: 'INACTIVE_COVERAGE',
                        message: 'Patient coverage is not active for the requested date of service',
                    },
                ],
            };
        }

        // Default: return eligible with mock benefits
        const today = new Date();
        const yearEnd = new Date(today.getFullYear(), 11, 31);

        return {
            success: true,
            isEligible: true,
            eligibilityStart: new Date(today.getFullYear(), 0, 1),
            eligibilityEnd: yearEnd,
            benefitsSummary: {
                copay: 50,
                coinsurance: 20,
                deductible: 1000,
                deductibleMet: 750,
                outOfPocketMax: 5000,
                outOfPocketMet: 1500,
                coverageLevel: 'individual',
                planName: 'Gold PPO Plan',
                networkStatus: 'in-network',
            },
            rawResponse: {
                mockResponse: true,
                timestamp: new Date().toISOString(),
            },
        };
    }

    async checkBenefits(payload: EligibilityCheckPayload): Promise<EligibilityCheckResponse> {
        this.logger.log(`Mock benefits check for patient ${payload.patientId}`);

        // Use same logic as eligibility for mock
        const response = await this.checkEligibility(payload);

        // Add more detailed benefits for benefits-specific request
        if (response.benefitsSummary) {
            response.benefitsSummary = {
                ...response.benefitsSummary,
                // Additional mock benefits details
            };
        }

        return response;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
