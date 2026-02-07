import { Injectable, Logger } from '@nestjs/common';
import { ClaimGenerator } from './claim-generator.interface';
import { GenericJsonGenerator } from './generic-json.generator';

/**
 * Supported claim formats
 * Add new formats here as they are implemented
 */
export enum ClaimFormat {
    GENERIC_JSON = 'GENERIC_JSON',
    // US Formats
    X12_837P = 'X12_837P', // Professional claims
    X12_837I = 'X12_837I', // Institutional claims
    X12_837D = 'X12_837D', // Dental claims
    // UAE Formats
    UAE_DHA_XML = 'UAE_DHA_XML', // Dubai Health Authority
    UAE_DOH_XML = 'UAE_DOH_XML', // Department of Health (Abu Dhabi)
    UAE_MOHAP = 'UAE_MOHAP', // Ministry of Health
    // Saudi Formats
    SAUDI_WASEEL = 'SAUDI_WASEEL',
    SAUDI_CCHI = 'SAUDI_CCHI', // Council of Cooperative Health Insurance
    // European Formats
    EU_FHIR_R4 = 'EU_FHIR_R4', // FHIR R4 based claims
    // Indian Formats
    INDIA_ROHINI = 'INDIA_ROHINI',
    INDIA_IRDAI = 'INDIA_IRDAI',
}

/**
 * Factory for creating claim generators based on format
 */
@Injectable()
export class ClaimGeneratorFactory {
    private readonly logger = new Logger(ClaimGeneratorFactory.name);
    private readonly generators: Map<string, ClaimGenerator> = new Map();

    constructor(private readonly genericJsonGenerator: GenericJsonGenerator) {
        // Register available generators
        this.registerGenerator(genericJsonGenerator);

        // Future: Register other generators here
        // this.registerGenerator(new X12837PGenerator());
        // this.registerGenerator(new DhaXmlGenerator());
    }

    /**
     * Register a claim generator
     */
    registerGenerator(generator: ClaimGenerator): void {
        this.generators.set(generator.format, generator);
        this.logger.log(`Registered claim generator: ${generator.format} (${generator.displayName})`);
    }

    /**
     * Get a generator by format
     * Falls back to GENERIC_JSON if format not found
     */
    getGenerator(format: string): ClaimGenerator {
        const generator = this.generators.get(format);

        if (!generator) {
            this.logger.warn(
                `Generator for format '${format}' not found, falling back to GENERIC_JSON`,
            );
            return this.generators.get(ClaimFormat.GENERIC_JSON)!;
        }

        return generator;
    }

    /**
     * Get generator based on payer configuration
     */
    getGeneratorForPayer(payerConfig: Record<string, unknown> | null): ClaimGenerator {
        const format = (payerConfig?.claimFormat as string) || ClaimFormat.GENERIC_JSON;
        return this.getGenerator(format);
    }

    /**
     * List all available generators
     */
    listAvailableFormats(): Array<{
        format: string;
        displayName: string;
        supportedRegions: string[];
    }> {
        return Array.from(this.generators.values()).map((g) => ({
            format: g.format,
            displayName: g.displayName,
            supportedRegions: g.supportedRegions,
        }));
    }

    /**
     * Check if a format is supported
     */
    isFormatSupported(format: string): boolean {
        return this.generators.has(format);
    }
}
