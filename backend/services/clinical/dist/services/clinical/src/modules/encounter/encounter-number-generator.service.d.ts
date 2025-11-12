/**
 * Encounter Number Generator Service
 *
 * Generates unique encounter numbers based on configurable formats.
 * Supports various formats through configuration:
 * - {YEAR} - 4-digit year
 * - {YY} - 2-digit year
 * - {MONTH} - 2-digit month
 * - {DAY} - 2-digit day
 * - {FACILITY} - Facility code
 * - {SEQ:n} - Sequential number with n digits
 * - {RANDOM:n} - Random alphanumeric with n characters
 *
 * Examples:
 * - ENC-{YEAR}-{SEQ:6} -> ENC-2025-000123
 * - {FACILITY}-{YY}{MONTH}-{SEQ:5} -> FAC01-2510-00456
 * - ENC{YEAR}{RANDOM:4} -> ENC2025AB3D
 */
import { PrismaService } from '@zeal/database-clinical';
export interface EncounterNumberGenerationContext {
    tenantId: string;
    facilityId: string;
    facilityCode?: string;
}
export declare class EncounterNumberGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Generate a new encounter number based on configuration
     */
    generateEncounterNumber(context: EncounterNumberGenerationContext): Promise<string>;
    /**
     * Get encounter number format from configuration
     */
    private getEncounterNumberFormat;
    /**
     * Apply format template to generate encounter number
     */
    private applyFormat;
    /**
     * Get next sequence number for tenant/facility
     */
    private getNextSequence;
    /**
     * Generate random alphanumeric string
     */
    private generateRandom;
    /**
     * Check if encounter number already exists
     */
    private encounterNumberExists;
    /**
     * Validate encounter number format string
     */
    validateFormat(format: string): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=encounter-number-generator.service.d.ts.map