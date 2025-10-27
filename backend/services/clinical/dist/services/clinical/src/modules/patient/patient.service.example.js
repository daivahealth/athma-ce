"use strict";
/**
 * Patient Service - Example Implementation
 *
 * Shows how to integrate patient history tracking with patient updates
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
// import { IdentityValidationRegistry } from '@zeal/validators'; // TODO: Implement validators package
const patient_history_service_1 = require("./patient-history.service");
let PatientService = class PatientService {
    prisma;
    historyService;
    constructor(prisma, historyService) {
        this.prisma = prisma;
        this.historyService = historyService;
    }
    /**
     * Register a new patient
     */
    async registerPatient(dto, context) {
        // Validate identity if provided
        // TODO: Uncomment when validators package is implemented
        // if (dto.nationalId && dto.nationalIdType && dto.issuingCountry) {
        //   const validationResult = IdentityValidationRegistry.validate(
        //     dto.issuingCountry,
        //     dto.nationalIdType,
        //     dto.nationalId
        //   );
        //
        //   if (!validationResult.isValid) {
        //     throw new BadRequestException({
        //       message: 'Invalid identity document',
        //       errors: validationResult.errors,
        //     });
        //   }
        //
        //   // Use normalized value
        //   dto.nationalId = validationResult.normalizedValue!;
        // }
        // Create patient
        const patient = await this.prisma.patient.create({
            data: {
                mrn: 'MRN-EXAMPLE',
                tenantId: context.tenantId,
                // Identity
                nationalId: dto.nationalId ?? null,
                nationalIdType: dto.nationalIdType ?? null,
                issuingCountry: dto.issuingCountry ?? null,
                // Demographics
                firstName: dto.firstName,
                lastName: dto.lastName,
                middleName: dto.middleName ?? null,
                dateOfBirth: dto.dateOfBirth,
                gender: dto.gender,
                maritalStatus: dto.maritalStatus ?? null,
                nationality: dto.nationality ?? null,
                preferredLanguage: dto.preferredLanguage || 'en',
                // Contact
                phoneNumber: dto.phoneNumber ?? null,
                email: dto.email ?? null,
                // Address
                addressLine1: dto.addressLine1 ?? null,
                addressLine2: dto.addressLine2 ?? null,
                city: dto.city ?? null,
                state: dto.state ?? null,
                postalCode: dto.postalCode ?? null,
                country: dto.country ?? null,
                // Medical
                bloodGroup: dto.bloodGroup ?? null,
                emergencyContact: dto.emergencyContact ?? null,
                insuranceInfo: dto.insuranceInfo ?? null,
                // Audit fields
                createdBy: context.userId,
                createdAtFacility: context.facilityId,
                registrationSource: dto.registrationSource || 'manual',
                registrationNotes: dto.registrationNotes ?? null,
            },
        });
        // Create primary identity document if provided
        if (dto.nationalId && dto.nationalIdType && dto.issuingCountry) {
            await this.prisma.patientDocument.create({
                data: {
                    tenantId: context.tenantId,
                    patientId: patient.id,
                    documentType: dto.nationalIdType,
                    documentNumber: dto.nationalId,
                    issuingCountry: dto.issuingCountry,
                    isPrimaryIdentity: true,
                    verificationStatus: 'pending',
                },
            });
        }
        return patient;
    }
    /**
     * Update patient with change history tracking
     */
    async updatePatient(patientId, dto, context) {
        // Get current patient state
        const currentPatient = await this.prisma.patient.findUnique({
            where: {
                id: patientId,
                tenantId: context.tenantId,
            },
        });
        if (!currentPatient) {
            throw new common_1.BadRequestException('Patient not found');
        }
        // Detect which fields changed
        const changes = [];
        const trackableFields = [
            'firstName',
            'lastName',
            'middleName',
            'dateOfBirth',
            'gender',
            'maritalStatus',
            'nationality',
            'phoneNumber',
            'email',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'postalCode',
            'country',
            'bloodGroup',
            'nationalId',
            'nationalIdType',
            'issuingCountry',
        ];
        for (const field of trackableFields) {
            const currentValue = currentPatient[field];
            if (dto[field] !== undefined && dto[field] !== currentValue) {
                changes.push({
                    fieldName: field,
                    oldValue: String(currentValue || ''),
                    newValue: String(dto[field] || ''),
                });
            }
        }
        // If no changes, return current patient
        if (changes.length === 0) {
            return currentPatient;
        }
        // Validate identity changes if applicable
        // TODO: Uncomment when validators package is implemented
        // if (dto.nationalId || dto.nationalIdType || dto.issuingCountry) {
        //   const validationResult = IdentityValidationRegistry.validate(
        //     dto.issuingCountry || currentPatient.issuingCountry!,
        //     dto.nationalIdType || currentPatient.nationalIdType!,
        //     dto.nationalId || currentPatient.nationalId!
        //   );
        //
        //   if (!validationResult.isValid) {
        //     throw new BadRequestException({
        //       message: 'Invalid identity document',
        //       errors: validationResult.errors,
        //     });
        //   }
        //
        //   if (dto.nationalId) {
        //     dto.nationalId = validationResult.normalizedValue!;
        //   }
        // }
        // Determine change type
        const changeType = dto.changeReason?.includes('patient request')
            ? 'patient_request'
            : dto.changeReason?.includes('correction')
                ? 'correction'
                : 'update';
        // Use transaction to update patient and record history atomically
        const updatedPatient = await this.prisma.$transaction(async (tx) => {
            // Update patient
            const updated = await tx.patient.update({
                where: { id: patientId },
                data: {
                    ...dto,
                    updatedBy: context.userId,
                    updatedAtFacility: context.facilityId,
                },
            });
            // Record history
            const historyEntries = changes.map((change) => ({
                tenantId: context.tenantId,
                patientId,
                fieldName: change.fieldName,
                oldValue: change.oldValue,
                newValue: change.newValue,
                changeType,
                changeReason: dto.changeReason ?? null,
                changedBy: context.userId,
                changedAtFacility: context.facilityId ?? null,
                patientConsent: dto.patientConsent || false,
                consentDocUrl: dto.consentDocUrl ?? null,
                supportingDocUrl: dto.supportingDocUrl ?? null,
                ipAddress: context.ipAddress ?? null,
                userAgent: context.userAgent ?? null,
            }));
            await tx.patientHistory.createMany({
                data: historyEntries,
            });
            return updated;
        });
        return updatedPatient;
    }
    /**
     * Get patient with history
     */
    async getPatientWithHistory(patientId, tenantId) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId },
            include: {
                documents: true,
                appointments: {
                    take: 10,
                    orderBy: { startTime: 'desc' },
                },
            },
        });
        if (!patient) {
            throw new common_1.BadRequestException('Patient not found');
        }
        // Get change history
        const history = await this.historyService.getPatientHistory(tenantId, patientId, { limit: 50 });
        return {
            ...patient,
            history,
        };
    }
    /**
     * Patient-initiated change request
     * Requires approval before applying
     */
    async createChangeRequest(patientId, requestedChanges, context) {
        const currentPatient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId: context.tenantId },
        });
        if (!currentPatient) {
            throw new common_1.BadRequestException('Patient not found');
        }
        // Detect changes
        const changes = [];
        for (const [field, value] of Object.entries(requestedChanges)) {
            const currentValue = currentPatient[field];
            if (value !== undefined && value !== currentValue) {
                changes.push({
                    fieldName: field,
                    oldValue: String(currentValue || ''),
                    newValue: String(value || ''),
                });
            }
        }
        // Record as pending change request (not approved yet)
        const recordOptions = {
            tenantId: context.tenantId,
            patientId,
            changes,
            changeType: 'patient_request',
            changeReason: requestedChanges.changeReason || 'Patient requested change',
            changedBy: context.userId, // Staff member who entered request
            changedAtFacility: context.facilityId,
            patientConsent: true,
        };
        if (requestedChanges.supportingDocUrl) {
            recordOptions.supportingDocUrl = requestedChanges.supportingDocUrl;
        }
        await this.historyService.recordChanges(recordOptions);
        return {
            message: 'Change request submitted. Awaiting approval.',
            pendingChanges: changes,
        };
    }
    /**
     * Approve and apply change request
     */
    async approveChangeRequest(historyId, context) {
        const historyEntry = await this.prisma.patientHistory.findUnique({
            where: { id: historyId },
        });
        if (!historyEntry) {
            throw new common_1.BadRequestException('Change request not found');
        }
        if (historyEntry.approvedBy) {
            throw new common_1.BadRequestException('Change request already approved');
        }
        // Approve the change
        await this.historyService.approveChange(historyId, context.userId);
        // Apply the change to patient
        await this.prisma.patient.update({
            where: { id: historyEntry.patientId },
            data: {
                [historyEntry.fieldName]: historyEntry.newValue,
                updatedBy: context.userId,
                updatedAtFacility: context.facilityId,
            },
        });
        return { message: 'Change approved and applied' };
    }
    /**
     * Get field change timeline
     */
    async getFieldTimeline(patientId, tenantId, fieldName) {
        const history = await this.historyService.getFieldHistory(tenantId, patientId, fieldName);
        return {
            fieldName,
            currentValue: await this.prisma.patient
                .findUnique({
                where: { id: patientId },
                select: { [fieldName]: true },
            })
                .then((p) => p?.[fieldName]),
            changes: history,
        };
    }
    /**
     * Get audit report for a patient
     */
    async getAuditReport(patientId, tenantId) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId },
        });
        if (!patient) {
            throw new common_1.BadRequestException('Patient not found');
        }
        const history = await this.historyService.getPatientHistory(tenantId, patientId);
        // Group changes by change type
        const changesByType = history.reduce((acc, change) => {
            if (!acc[change.changeType]) {
                acc[change.changeType] = [];
            }
            acc[change.changeType].push(change);
            return acc;
        }, {});
        return {
            patient: {
                id: patient.id,
                name: `${patient.firstName} ${patient.lastName}`,
                nationalId: patient.nationalId,
            },
            registeredBy: patient.createdBy ?? null,
            registeredAt: patient.createdAt,
            registeredAtFacility: patient.createdAtFacility ?? null,
            totalChanges: history.length,
            changesByType,
            recentChanges: history.slice(0, 10),
        };
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaClient,
        patient_history_service_1.PatientHistoryService])
], PatientService);
//# sourceMappingURL=patient.service.example.js.map