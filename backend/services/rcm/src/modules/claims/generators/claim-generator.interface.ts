import { Claim, ClaimLine, ClaimDiagnosis } from '@zeal/database-rcm/generated';

/**
 * Interface representing a generated claim file output
 */
export interface GeneratedClaimFile {
    format: string;
    content: string | Buffer;
    filename: string;
    mimeType: string;
    metadata?: Record<string, unknown>;
}

/**
 * Interface for claim validation results
 */
export interface ClaimValidationResult {
    isValid: boolean;
    errors: ClaimValidationError[];
    warnings: ClaimValidationWarning[];
}

export interface ClaimValidationError {
    code: string;
    field?: string;
    lineNumber?: number;
    message: string;
    severity: 'error';
}

export interface ClaimValidationWarning {
    code: string;
    field?: string;
    lineNumber?: number;
    message: string;
    severity: 'warning';
}

/**
 * Full claim data including lines and diagnoses for generation
 */
export interface ClaimWithDetails extends Claim {
    claimLines: ClaimLine[];
    claimDiagnoses: ClaimDiagnosis[];
    payer?: {
        id: string;
        payerName: string;
        payerId: string | null;
        configuration: Record<string, unknown>;
    } | null;
}

/**
 * Strategy interface for claim generators
 * Implementations handle specific regional formats (X12 837, DHA XML, etc.)
 */
export interface ClaimGenerator {
    /**
     * The format identifier this generator handles
     */
    readonly format: string;

    /**
     * Human-readable name for this format
     */
    readonly displayName: string;

    /**
     * Supported regions/countries
     */
    readonly supportedRegions: string[];

    /**
     * Validate the claim data before generation
     */
    validate(claim: ClaimWithDetails): Promise<ClaimValidationResult>;

    /**
     * Generate the claim file in the target format
     */
    generate(claim: ClaimWithDetails): Promise<GeneratedClaimFile>;

    /**
     * Generate a batch of claims (for formats that support batching)
     */
    generateBatch?(claims: ClaimWithDetails[]): Promise<GeneratedClaimFile>;
}
