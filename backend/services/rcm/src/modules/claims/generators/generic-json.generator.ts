import { Injectable } from '@nestjs/common';
import {
    ClaimGenerator,
    ClaimWithDetails,
    GeneratedClaimFile,
    ClaimValidationResult,
} from './claim-generator.interface';

/**
 * Generic JSON Claim Generator
 * Default format for development and testing
 * Can be used as base for API integrations that accept JSON
 */
@Injectable()
export class GenericJsonGenerator implements ClaimGenerator {
    readonly format = 'GENERIC_JSON';
    readonly displayName = 'Generic JSON Format';
    readonly supportedRegions = ['*']; // Supports all regions as fallback

    async validate(claim: ClaimWithDetails): Promise<ClaimValidationResult> {
        const errors: ClaimValidationResult['errors'] = [];
        const warnings: ClaimValidationResult['warnings'] = [];

        // Basic validation rules
        if (!claim.patientId) {
            errors.push({
                code: 'MISSING_PATIENT',
                field: 'patientId',
                message: 'Patient ID is required',
                severity: 'error',
            });
        }

        if (!claim.serviceDate) {
            errors.push({
                code: 'MISSING_SERVICE_DATE',
                field: 'serviceDate',
                message: 'Service date is required',
                severity: 'error',
            });
        }

        if (!claim.claimLines || claim.claimLines.length === 0) {
            errors.push({
                code: 'NO_CLAIM_LINES',
                field: 'claimLines',
                message: 'Claim must have at least one line item',
                severity: 'error',
            });
        }

        if (!claim.claimDiagnoses || claim.claimDiagnoses.length === 0) {
            warnings.push({
                code: 'NO_DIAGNOSES',
                field: 'claimDiagnoses',
                message: 'Claim has no diagnosis codes - this may cause rejection',
                severity: 'warning',
            });
        }

        // Validate each claim line
        claim.claimLines?.forEach((line, index) => {
            if (!line.procedureCode) {
                errors.push({
                    code: 'MISSING_PROCEDURE_CODE',
                    field: 'procedureCode',
                    lineNumber: index + 1,
                    message: `Line ${index + 1} is missing procedure code`,
                    severity: 'error',
                });
            }

            if (!line.chargedAmount || Number(line.chargedAmount) <= 0) {
                errors.push({
                    code: 'INVALID_CHARGE_AMOUNT',
                    field: 'chargedAmount',
                    lineNumber: index + 1,
                    message: `Line ${index + 1} has invalid charged amount`,
                    severity: 'error',
                });
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    async generate(claim: ClaimWithDetails): Promise<GeneratedClaimFile> {
        const claimData = this.buildClaimPayload(claim);

        return {
            format: this.format,
            content: JSON.stringify(claimData, null, 2),
            filename: `claim_${claim.claimNumber}_${Date.now()}.json`,
            mimeType: 'application/json',
            metadata: {
                generatedAt: new Date().toISOString(),
                claimId: claim.id,
                claimNumber: claim.claimNumber,
            },
        };
    }

    async generateBatch(claims: ClaimWithDetails[]): Promise<GeneratedClaimFile> {
        const batchData = {
            batchInfo: {
                generatedAt: new Date().toISOString(),
                claimCount: claims.length,
                totalAmount: claims.reduce((sum, c) => sum + Number(c.totalAmount || 0), 0),
            },
            claims: claims.map((claim) => this.buildClaimPayload(claim)),
        };

        return {
            format: this.format,
            content: JSON.stringify(batchData, null, 2),
            filename: `claim_batch_${Date.now()}.json`,
            mimeType: 'application/json',
            metadata: {
                generatedAt: new Date().toISOString(),
                claimCount: claims.length,
            },
        };
    }

    private buildClaimPayload(claim: ClaimWithDetails) {
        return {
            header: {
                claimNumber: claim.claimNumber,
                claimId: claim.id,
                tenantId: claim.tenantId,
                status: claim.status,
                serviceDate: claim.serviceDate,
                submittedAt: claim.submittedAt,
                currency: claim.currency,
                totalAmount: claim.totalAmount,
            },
            patient: {
                patientId: claim.patientId,
            },
            payer: claim.payer
                ? {
                    payerId: claim.payer.payerId,
                    payerName: claim.payer.payerName,
                }
                : null,
            encounter: claim.encounterId
                ? {
                    encounterId: claim.encounterId,
                }
                : null,
            diagnoses: claim.claimDiagnoses.map((dx) => ({
                sequence: dx.sequence,
                code: dx.diagnosisCode,
                codeType: dx.diagnosisCodeType,
                description: dx.diagnosisDisplay,
                type: dx.diagnosisType,
                poaFlag: dx.poaFlag,
            })),
            lines: claim.claimLines.map((line) => ({
                lineNumber: line.lineNumber,
                procedureCode: line.procedureCode,
                procedureCodeType: line.procedureCodeType,
                description: line.procedureDescription,
                modifiers: [line.modifier1, line.modifier2, line.modifier3, line.modifier4].filter(Boolean),
                serviceDate: line.serviceDate,
                units: line.units,
                chargedAmount: line.chargedAmount,
                allowedAmount: line.allowedAmount,
                paidAmount: line.paidAmount,
                placeOfService: line.placeOfService,
            })),
        };
    }
}
