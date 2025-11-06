"use strict";
/**
 * Encounter Service
 *
 * Business logic for encounter management
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
exports.EncounterService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let EncounterService = class EncounterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new encounter
     */
    async createEncounter(dto, context) {
        const { tenantId, userId, facilityId } = context;
        // Verify patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: dto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${dto.patientId} not found`);
        }
        // If appointment ID provided, verify it exists
        if (dto.appointmentId) {
            const appointment = await this.prisma.appointment.findUnique({
                where: { id: dto.appointmentId },
            });
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${dto.appointmentId} not found`);
            }
        }
        // Check if encounter already exists for this patient-staff combination on the same day
        const startDate = new Date(dto.startTime);
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existingEncounter = await this.prisma.encounter.findFirst({
            where: {
                tenantId,
                patientId: dto.patientId,
                primaryStaffId: dto.primaryStaffId,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: {
                    notIn: ['cancelled'], // Exclude cancelled encounters from the check
                },
            },
        });
        if (existingEncounter) {
            throw new common_1.BadRequestException(`An encounter already exists for this patient with this staff member on ${startDate.toLocaleDateString()}. Only one encounter per patient-staff combination per day is allowed.`);
        }
        // Build encounter data
        const encounterData = {
            tenantId,
            patientId: dto.patientId,
            facilityId,
            appointmentId: dto.appointmentId || null,
            primaryStaffId: dto.primaryStaffId,
            encounterClass: dto.encounterClass || 'AMB',
            status: dto.status || 'planned',
            priority: dto.priority || 'routine',
            startTime: new Date(dto.startTime),
            endTime: dto.endTime ? new Date(dto.endTime) : null,
            encounterSource: dto.encounterSource || 'appointment',
            allergies: dto.allergies || [],
            currentMedications: dto.currentMedications || [],
        };
        // Add optional fields only if provided
        if (dto.walkInDetails)
            encounterData.walkInDetails = dto.walkInDetails;
        if (dto.vitalSigns)
            encounterData.vitalSigns = dto.vitalSigns;
        if (dto.chiefComplaint)
            encounterData.chiefComplaint = dto.chiefComplaint;
        if (dto.presentingSymptoms)
            encounterData.presentingSymptoms = dto.presentingSymptoms;
        if (dto.medicalHistory)
            encounterData.medicalHistory = dto.medicalHistory;
        if (dto.socialHistory)
            encounterData.socialHistory = dto.socialHistory;
        if (dto.familyHistory)
            encounterData.familyHistory = dto.familyHistory;
        if (dto.notes)
            encounterData.notes = dto.notes;
        // Create encounter
        const encounter = await this.prisma.encounter.create({
            data: encounterData,
            include: {
                patient: {
                    select: {
                        id: true,
                        mrn: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
                appointment: true,
            },
        });
        return encounter;
    }
    /**
     * Search encounters with filters
     */
    async searchEncounters(tenantId, query) {
        const { page = 1, limit = 20, search, ...filters } = query;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
        };
        if (filters.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters.primaryStaffId) {
            where.primaryStaffId = filters.primaryStaffId;
        }
        if (filters.facilityId) {
            where.facilityId = filters.facilityId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.encounterClass) {
            where.encounterClass = filters.encounterClass;
        }
        if (filters.startDate || filters.endDate) {
            where.startTime = {};
            if (filters.startDate) {
                where.startTime.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.startTime.lte = new Date(filters.endDate);
            }
        }
        if (search) {
            where.OR = [
                { chiefComplaint: { contains: search, mode: 'insensitive' } },
                { presentingSymptoms: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [encounters, total] = await Promise.all([
            this.prisma.encounter.findMany({
                where,
                skip,
                take: limit,
                orderBy: { startTime: 'desc' },
                include: {
                    patient: {
                        select: {
                            id: true,
                            mrn: true,
                            firstName: true,
                            lastName: true,
                            dateOfBirth: true,
                            gender: true,
                        },
                    },
                    appointment: {
                        select: {
                            id: true,
                            appointmentType: true,
                            status: true,
                        },
                    },
                },
            }),
            this.prisma.encounter.count({ where }),
        ]);
        return {
            data: encounters,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get encounter by ID
     */
    async getEncounterById(id, tenantId) {
        const encounter = await this.prisma.encounter.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        mrn: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true,
                        phoneNumber: true,
                        email: true,
                    },
                },
                appointment: {
                    select: {
                        id: true,
                        appointmentType: true,
                        status: true,
                        startTime: true,
                        endTime: true,
                    },
                },
            },
        });
        if (!encounter) {
            throw new common_1.NotFoundException(`Encounter with ID ${id} not found`);
        }
        return encounter;
    }
    /**
     * Update encounter
     */
    async updateEncounter(id, dto, context) {
        const { tenantId } = context;
        // Verify encounter exists
        const existing = await this.prisma.encounter.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Encounter with ID ${id} not found`);
        }
        // Prepare update data
        const updateData = {};
        if (dto.status)
            updateData.status = dto.status;
        if (dto.endTime)
            updateData.endTime = new Date(dto.endTime);
        if (dto.chiefComplaint !== undefined)
            updateData.chiefComplaint = dto.chiefComplaint;
        if (dto.presentingSymptoms !== undefined)
            updateData.presentingSymptoms = dto.presentingSymptoms;
        if (dto.vitalSigns)
            updateData.vitalSigns = dto.vitalSigns;
        if (dto.allergies)
            updateData.allergies = dto.allergies;
        if (dto.currentMedications)
            updateData.currentMedications = dto.currentMedications;
        if (dto.medicalHistory !== undefined)
            updateData.medicalHistory = dto.medicalHistory;
        if (dto.socialHistory !== undefined)
            updateData.socialHistory = dto.socialHistory;
        if (dto.familyHistory !== undefined)
            updateData.familyHistory = dto.familyHistory;
        if (dto.notes !== undefined)
            updateData.notes = dto.notes;
        if (dto.dischargeDisposition !== undefined)
            updateData.dischargeDisposition = dto.dischargeDisposition;
        if (dto.followUpInstructions !== undefined)
            updateData.followUpInstructions = dto.followUpInstructions;
        const updated = await this.prisma.encounter.update({
            where: { id },
            data: updateData,
            include: {
                patient: {
                    select: {
                        id: true,
                        mrn: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true,
                    },
                },
                appointment: true,
            },
        });
        return updated;
    }
    /**
     * Update encounter status
     */
    async updateEncounterStatus(id, status, tenantId) {
        const encounter = await this.prisma.encounter.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        if (!encounter) {
            throw new common_1.NotFoundException(`Encounter with ID ${id} not found`);
        }
        return this.prisma.encounter.update({
            where: { id },
            data: {
                status,
                // If finishing encounter, set end time
                ...(status === 'finished' && !encounter.endTime
                    ? { endTime: new Date() }
                    : {}),
            },
        });
    }
    /**
     * Get patient encounters
     */
    async getPatientEncounters(patientId, tenantId) {
        return this.prisma.encounter.findMany({
            where: {
                patientId,
                tenantId,
            },
            orderBy: { startTime: 'desc' },
            include: {
                appointment: {
                    select: {
                        id: true,
                        appointmentType: true,
                        status: true,
                    },
                },
            },
        });
    }
    /**
     * Get today's encounters for a facility
     */
    async getTodayEncounters(facilityId, tenantId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return this.prisma.encounter.findMany({
            where: {
                facilityId,
                tenantId,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { startTime: 'asc' },
            include: {
                patient: {
                    select: {
                        id: true,
                        mrn: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
};
exports.EncounterService = EncounterService;
exports.EncounterService = EncounterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], EncounterService);
//# sourceMappingURL=encounter.service.js.map