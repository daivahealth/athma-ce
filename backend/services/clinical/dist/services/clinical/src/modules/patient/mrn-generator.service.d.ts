/**
 * MRN (Medical Record Number) Generator Service
 *
 * Generates unique medical record numbers based on configurable formats.
 * Supports various formats through configuration:
 * - {YEAR} - 4-digit year
 * - {YY} - 2-digit year
 * - {MONTH} - 2-digit month
 * - {FACILITY} - Facility code
 * - {SEQ} - Sequential number
 * - {RANDOM} - Random alphanumeric
 *
 * Examples:
 * - PAT-{YEAR}-{SEQ:6} -> PAT-2025-000123
 * - {FACILITY}-{YY}{MONTH}-{SEQ:5} -> FAC01-2510-00456
 * - MRN{YEAR}{RANDOM:4} -> MRN2025AB3D
 */
import { PrismaService } from '@zeal/database-clinical';
export interface MrnGenerationContext {
    tenantId: string;
    facilityId: string;
    facilityCode?: string;
}
export declare class MrnGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Generate a new MRN based on configuration
     */
    generateMrn(context: MrnGenerationContext): Promise<string>;
    /**
     * Get MRN format from configuration
     */
    private getMrnFormat;
    /**
     * Apply format template to generate MRN
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
     * Check if MRN already exists
     */
    private mrnExists;
    /**
     * Validate MRN format string
     */
    validateFormat(format: string): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=mrn-generator.service.d.ts.map