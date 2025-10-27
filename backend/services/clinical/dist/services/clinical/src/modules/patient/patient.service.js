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
     * Transform frontend DTO to match database schema
     * Handles field name aliases and nested object construction
     */
    transformPatientDto(dto) {
        const transformed = { ...dto };
        // Handle contactNumber -> phoneNumber transformation
        if (dto.contactNumber && !dto.phoneNumber) {
            transformed.phoneNumber = dto.contactNumber;
        }
        delete transformed.contactNumber;
        // Handle flat emergency contact fields -> emergencyContact object
        if (dto.emergencyContactName || dto.emergencyContactNumber || dto.emergencyContactRelation) {
            transformed.emergencyContact = {
                name: dto.emergencyContactName,
                phoneNumber: dto.emergencyContactNumber,
                relation: dto.emergencyContactRelation,
            };
            delete transformed.emergencyContactName;
            delete transformed.emergencyContactNumber;
            delete transformed.emergencyContactRelation;
        }
        return transformed;
    }
    /**
     * Register a new patient
     */
    async registerPatient(dto, context) {
        // Transform frontend DTO to match database schema
        const transformedDto = this.transformPatientDto(dto);
        // Validate identity if provided
        // TODO: Uncomment when validators package is implemented
        // if (transformedDto.nationalId && transformedDto.nationalIdType && transformedDto.issuingCountry) {
        //   const validationResult = IdentityValidationRegistry.validate(
        //     transformedDto.issuingCountry,
        //     transformedDto.nationalIdType,
        //     transformedDto.nationalId
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
        //   transformedDto.nationalId = validationResult.normalizedValue!;
        // }
        // Create patient
        const patient = await this.prisma.patient.create({
            data: {
                tenantId: context.tenantId,
                // Identity
                nationalId: transformedDto.nationalId ?? null,
                nationalIdType: transformedDto.nationalIdType ?? null,
                issuingCountry: transformedDto.issuingCountry ?? null,
                // Demographics
                firstName: transformedDto.firstName,
                lastName: transformedDto.lastName,
                middleName: transformedDto.middleName ?? null,
                dateOfBirth: transformedDto.dateOfBirth,
                gender: transformedDto.gender,
                maritalStatus: transformedDto.maritalStatus ?? null,
                nationality: transformedDto.nationality ?? null,
                preferredLanguage: transformedDto.preferredLanguage || 'en',
                // Contact
                phoneNumber: transformedDto.phoneNumber ?? null,
                email: transformedDto.email ?? null,
                // Address
                addressLine1: transformedDto.addressLine1 ?? null,
                addressLine2: transformedDto.addressLine2 ?? null,
                city: transformedDto.city ?? null,
                state: transformedDto.state ?? null,
                postalCode: transformedDto.postalCode ?? null,
                country: transformedDto.country ?? null,
                // Medical
                bloodGroup: transformedDto.bloodGroup ?? null,
                emergencyContact: transformedDto.emergencyContact ?? null,
                insuranceInfo: transformedDto.insuranceInfo ?? null,
                // Audit fields
                createdBy: context.userId,
                createdAtFacility: context.facilityId,
                registrationSource: transformedDto.registrationSource || 'manual',
                registrationNotes: transformedDto.registrationNotes ?? null,
            },
        });
        // Create primary identity document if provided
        if (transformedDto.nationalId && transformedDto.nationalIdType && transformedDto.issuingCountry) {
            await this.prisma.patientDocument.create({
                data: {
                    tenantId: context.tenantId,
                    patientId: patient.id,
                    documentType: transformedDto.nationalIdType,
                    documentNumber: transformedDto.nationalId,
                    issuingCountry: transformedDto.issuingCountry,
                    isPrimaryIdentity: true,
                    verificationStatus: 'pending',
                },
            });
        }
        return patient;
    }
    /**
     * Search patients
     */
    async searchPatients(tenantId, options) {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            status: { not: 'deleted' },
        };
        // Support both 'search' and 'query' parameters
        const searchTerm = options.search || options.query;
        if (searchTerm) {
            where.OR = [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { nationalId: { contains: searchTerm, mode: 'insensitive' } },
                { phoneNumber: { contains: searchTerm } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        if (options.nationalId) {
            where.nationalId = { contains: options.nationalId };
        }
        if (options.phoneNumber) {
            where.phoneNumber = { contains: options.phoneNumber };
        }
        if (options.email) {
            where.email = { contains: options.email, mode: 'insensitive' };
        }
        const [patients, total] = await Promise.all([
            this.prisma.patient.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.patient.count({ where }),
        ]);
        return {
            data: patients,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get patient by ID
     */
    async getPatientById(patientId, tenantId) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId },
        });
        if (!patient) {
            throw new common_1.BadRequestException('Patient not found');
        }
        return patient;
    }
    /**
     * Update patient with change history tracking
     */
    async updatePatient(patientId, dto, context) {
        // Transform frontend DTO to match database schema
        const transformedDto = this.transformPatientDto(dto);
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
            if (transformedDto[field] !== undefined && transformedDto[field] !== currentValue) {
                changes.push({
                    fieldName: field,
                    oldValue: String(currentValue || ''),
                    newValue: String(transformedDto[field] || ''),
                });
            }
        }
        // If no changes, return current patient
        if (changes.length === 0) {
            return currentPatient;
        }
        // Validate identity changes if applicable
        // TODO: Uncomment when validators package is implemented
        // if (transformedDto.nationalId || transformedDto.nationalIdType || transformedDto.issuingCountry) {
        //   const validationResult = IdentityValidationRegistry.validate(
        //     transformedDto.issuingCountry || currentPatient.issuingCountry!,
        //     transformedDto.nationalIdType || currentPatient.nationalIdType!,
        //     transformedDto.nationalId || currentPatient.nationalId!
        //   );
        //
        //   if (!validationResult.isValid) {
        //     throw new BadRequestException({
        //       message: 'Invalid identity document',
        //       errors: validationResult.errors,
        //     });
        //   }
        //
        //   if (transformedDto.nationalId) {
        //     transformedDto.nationalId = validationResult.normalizedValue!;
        //   }
        // }
        // Determine change type
        const changeType = transformedDto.changeReason?.includes('patient request')
            ? 'patient_request'
            : transformedDto.changeReason?.includes('correction')
                ? 'correction'
                : 'update';
        // Use transaction to update patient and record history atomically
        const updatedPatient = await this.prisma.$transaction(async (tx) => {
            // Update patient
            const updated = await tx.patient.update({
                where: { id: patientId },
                data: {
                    ...transformedDto,
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
                changeReason: transformedDto.changeReason ?? null,
                changedBy: context.userId,
                changedAtFacility: context.facilityId ?? null,
                patientConsent: transformedDto.patientConsent || false,
                consentDocUrl: transformedDto.consentDocUrl ?? null,
                supportingDocUrl: transformedDto.supportingDocUrl ?? null,
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
    __metadata("design:paramtypes", [database_clinical_1.PrismaService,
        patient_history_service_1.PatientHistoryService])
], PatientService);
//# sourceMappingURL=patient.service.js.map