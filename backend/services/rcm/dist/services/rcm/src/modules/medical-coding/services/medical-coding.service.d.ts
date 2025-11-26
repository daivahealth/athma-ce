import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
/**
 * MedicalCodingService
 *
 * Handles automated medical coding workflow - the bridge between clinical documentation
 * and claim submission. Auto-seeds coding sessions when posting rules create charges,
 * allowing claims to proceed while enabling coders to review and enhance coding accuracy.
 *
 * Key responsibilities:
 * - Auto-create coding sessions when charges are generated
 * - Fetch encounter diagnoses from Clinical service and create CodingDiagnosis records
 * - Create CodingProcedure records from generated charges
 * - Link charges to coding procedures for audit trail
 *
 * Architecture note:
 * - Respects database isolation: calls Clinical API for cross-database data
 * - Non-blocking design: coding sessions created in 'auto_generated' status
 * - Claims can be generated from auto-seeded data without waiting for coder review
 */
export declare class MedicalCodingService {
    private readonly prisma;
    private readonly httpService;
    private readonly logger;
    private readonly clinicalApiUrl;
    constructor(prisma: PrismaService, httpService: HttpService);
    /**
     * Auto-seed coding session after charges are created by posting rules
     *
     * This is called after the charge posting service processes an event.
     * It creates:
     * 1. A CodingSession in 'auto_generated' status
     * 2. CodingDiagnosis records sourced from Clinical DB (encounter_diagnosis)
     * 3. CodingProcedure records sourced from the charges just created
     * 4. Links charges to their corresponding coding procedures
     *
     * @param tenantId - Tenant UUID
     * @param encounterId - Encounter UUID from Clinical DB
     * @param charges - Array of charges created by posting rules
     * @param patientId - Patient UUID from Clinical DB
     * @returns Created coding session with counts of seeded records
     */
    autoSeedCodingSession(tenantId: string, encounterId: string, charges: any[], patientId: string): Promise<{
        sessionId: string;
        isNew: boolean;
        diagnosesAdded: number;
        proceduresAdded: number;
    } | null>;
    /**
     * Fetch encounter diagnoses from Clinical service and create CodingDiagnosis records
     */
    private autoSeedDiagnoses;
    /**
     * Create CodingProcedure records from charges and link charges to procedures
     */
    private autoSeedProcedures;
    /**
     * Add procedures to existing coding session (when more charges are added later)
     */
    private addProceduresToSession;
    /**
     * Get coding session for an encounter
     */
    getCodingSessionByEncounter(tenantId: string, encounterId: string): Promise<({
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
            charges: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                billingItemId: string;
                notes: string | null;
                chargeDate: Date;
                quantity: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                unitPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                patientResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                payerResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                sourceType: string | null;
                sourceId: string | null;
                originalBillingItemId: string | null;
                isCoderModified: boolean;
                codedBy: string | null;
                codedAt: Date | null;
                claimLineSequence: number | null;
                codingProcedureId: string | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    }) | null>;
    /**
     * Get coding sessions needing review (for coder inbox)
     */
    getPendingCodingSessions(tenantId: string, limit?: number): Promise<({
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    })[]>;
    /**
     * Find all coding sessions with filters
     */
    findAllSessions(tenantId: string, filters: any): Promise<({
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    })[]>;
    /**
     * Find coding session by ID
     */
    findSessionById(tenantId: string, sessionId: string): Promise<({
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
            charges: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                billingItemId: string;
                notes: string | null;
                chargeDate: Date;
                quantity: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                unitPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                patientResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                payerResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                sourceType: string | null;
                sourceId: string | null;
                originalBillingItemId: string | null;
                isCoderModified: boolean;
                codedBy: string | null;
                codedAt: Date | null;
                claimLineSequence: number | null;
                codingProcedureId: string | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    }) | null>;
    /**
     * Start coder review (change status to in_progress)
     */
    startReview(tenantId: string, sessionId: string, userId: string): Promise<{
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    }>;
    /**
     * Update coding session
     */
    updateSession(tenantId: string, sessionId: string, dto: any, userId: string): Promise<{
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    }>;
    /**
     * Submit coding session for claim generation
     */
    submitSession(tenantId: string, sessionId: string, dto: any, userId: string): Promise<{
        diagnoses: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string | null;
            sourceEncounterDiagnosisId: string | null;
            diagnosisCatalogItemId: string | null;
            diagnosisCode: string;
            diagnosisCodeType: string;
            diagnosisDisplay: string;
            diagnosisDisplayAr: string | null;
            diagnosisType: string;
            sequence: number;
            usedForBilling: boolean;
            poaFlag: string | null;
            codingSessionId: string;
        }[];
        procedures: ({
            billingItem: {
                id: string;
                tenantId: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                itemType: string;
                clinicalRefId: string | null;
                billingCode: string;
                billingCodeType: string;
                billingDescription: string;
                chargeType: string;
                defaultUnit: string;
                listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
            };
            charges: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                billingItemId: string;
                notes: string | null;
                chargeDate: Date;
                quantity: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                unitPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                patientResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                payerResponsibility: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
                sourceType: string | null;
                sourceId: string | null;
                originalBillingItemId: string | null;
                isCoderModified: boolean;
                codedBy: string | null;
                codedAt: Date | null;
                claimLineSequence: number | null;
                codingProcedureId: string | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceGroup: string | null;
            billingItemId: string;
            createdBy: string;
            updatedBy: string | null;
            sequence: number;
            codingSessionId: string;
            sourceClinicalOrderId: string | null;
            procedureCatalogItemId: string | null;
            procedureCode: string;
            procedureCodeType: string;
            procedureDisplay: string;
            procedureDisplayAr: string | null;
            serviceDate: Date;
            providerId: string | null;
            revenueCenterId: string | null;
            units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            modifier1: string | null;
            modifier2: string | null;
            modifier3: string | null;
            modifier4: string | null;
            placeOfService: string | null;
        })[];
    } & {
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        encounterId: string;
        createdBy: string;
        updatedBy: string | null;
        claimId: string | null;
        assignedTo: string | null;
        assignedAt: Date | null;
        completedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        codingNotes: string | null;
        reviewNotes: string | null;
    }>;
    /**
     * Add diagnosis to coding session
     */
    addDiagnosis(tenantId: string, sessionId: string, dto: any, userId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string | null;
        sourceEncounterDiagnosisId: string | null;
        diagnosisCatalogItemId: string | null;
        diagnosisCode: string;
        diagnosisCodeType: string;
        diagnosisDisplay: string;
        diagnosisDisplayAr: string | null;
        diagnosisType: string;
        sequence: number;
        usedForBilling: boolean;
        poaFlag: string | null;
        codingSessionId: string;
    }>;
    /**
     * Update diagnosis
     */
    updateDiagnosis(diagnosisId: string, dto: any, userId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string | null;
        sourceEncounterDiagnosisId: string | null;
        diagnosisCatalogItemId: string | null;
        diagnosisCode: string;
        diagnosisCodeType: string;
        diagnosisDisplay: string;
        diagnosisDisplayAr: string | null;
        diagnosisType: string;
        sequence: number;
        usedForBilling: boolean;
        poaFlag: string | null;
        codingSessionId: string;
    }>;
    /**
     * Delete diagnosis
     */
    deleteDiagnosis(diagnosisId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Add procedure to coding session
     */
    addProcedure(tenantId: string, sessionId: string, dto: any, userId: string): Promise<{
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string;
        createdBy: string;
        updatedBy: string | null;
        sequence: number;
        codingSessionId: string;
        sourceClinicalOrderId: string | null;
        procedureCatalogItemId: string | null;
        procedureCode: string;
        procedureCodeType: string;
        procedureDisplay: string;
        procedureDisplayAr: string | null;
        serviceDate: Date;
        providerId: string | null;
        revenueCenterId: string | null;
        units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        modifier1: string | null;
        modifier2: string | null;
        modifier3: string | null;
        modifier4: string | null;
        placeOfService: string | null;
    }>;
    /**
     * Update procedure
     */
    updateProcedure(procedureId: string, dto: any, userId: string): Promise<{
        billingItem: {
            id: string;
            tenantId: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            itemType: string;
            clinicalRefId: string | null;
            billingCode: string;
            billingCodeType: string;
            billingDescription: string;
            chargeType: string;
            defaultUnit: string;
            listPrice: import("@zeal/database-rcm/generated/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        serviceGroup: string | null;
        billingItemId: string;
        createdBy: string;
        updatedBy: string | null;
        sequence: number;
        codingSessionId: string;
        sourceClinicalOrderId: string | null;
        procedureCatalogItemId: string | null;
        procedureCode: string;
        procedureCodeType: string;
        procedureDisplay: string;
        procedureDisplayAr: string | null;
        serviceDate: Date;
        providerId: string | null;
        revenueCenterId: string | null;
        units: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        modifier1: string | null;
        modifier2: string | null;
        modifier3: string | null;
        modifier4: string | null;
        placeOfService: string | null;
    }>;
    /**
     * Delete procedure
     */
    deleteProcedure(procedureId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get audit trail for a coding session
     */
    getSessionAudit(tenantId: string, sessionId: string): Promise<{
        id: string;
        tenantId: string;
        codingSessionId: string;
        entityType: string;
        entityId: string;
        action: string;
        oldValue: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        newValue: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        changedFields: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        changedBy: string;
        changeReason: string | null;
        changedAt: Date;
    }[]>;
    /**
     * Get audit logs with filters
     */
    getAuditLogs(tenantId: string, filters: any): Promise<{
        id: string;
        tenantId: string;
        codingSessionId: string;
        entityType: string;
        entityId: string;
        action: string;
        oldValue: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        newValue: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        changedFields: import("@zeal/database-rcm/generated/runtime/library").JsonValue | null;
        changedBy: string;
        changeReason: string | null;
        changedAt: Date;
    }[]>;
    /**
     * Get coder productivity statistics
     */
    getCoderProductivity(tenantId: string, filters: any): Promise<any>;
    /**
     * Get session statistics summary
     */
    getSessionSummary(tenantId: string): Promise<{
        total: number;
        byStatus: {
            auto_generated: number;
            in_progress: number;
            completed: number;
        };
        pending: number;
    }>;
    /**
     * Create audit log entry
     */
    private createAuditLog;
}
//# sourceMappingURL=medical-coding.service.d.ts.map