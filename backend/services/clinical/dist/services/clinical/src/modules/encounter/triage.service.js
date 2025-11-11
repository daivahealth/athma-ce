"use strict";
/**
 * Triage Service
 *
 * Business logic for triage management
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
exports.TriageService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let TriageService = class TriageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new triage record
     */
    async createTriage(dto, context) {
        const { tenantId } = context;
        // Verify encounter exists
        const encounter = await this.prisma.encounter.findFirst({
            where: {
                id: dto.encounterId,
                tenantId,
            },
        });
        if (!encounter) {
            throw new common_1.NotFoundException(`Encounter with ID ${dto.encounterId} not found`);
        }
        // Check if triage already exists for this encounter
        const existingTriage = await this.prisma.triage.findUnique({
            where: { encounterId: dto.encounterId },
        });
        if (existingTriage) {
            throw new common_1.ConflictException(`Triage already exists for encounter ${dto.encounterId}. Use update instead.`);
        }
        // Verify patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: dto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${dto.patientId} not found`);
        }
        // Build triage data
        const triageData = {
            tenantId,
            encounterId: dto.encounterId,
            patientId: dto.patientId,
            triageStaffId: dto.triageStaffId,
            triageLevel: dto.triageLevel,
            chiefComplaintsAndHPI: dto.chiefComplaintsAndHPI,
            vitalSigns: dto.vitalSigns || {},
            allergies: dto.allergies || [],
            currentMedications: dto.currentMedications || [],
        };
        // Add optional fields
        if (dto.painScore !== undefined)
            triageData.painScore = dto.painScore;
        if (dto.triageNotes)
            triageData.triageNotes = dto.triageNotes;
        // Create triage
        const triage = await this.prisma.triage.create({
            data: triageData,
            include: {
                encounter: {
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
                    },
                },
            },
        });
        // Optionally update encounter status to 'triaged' if not already
        if (encounter.status === 'arrived') {
            await this.prisma.encounter.update({
                where: { id: dto.encounterId },
                data: { status: 'triaged' },
            });
        }
        return triage;
    }
    /**
     * Get triage by encounter ID
     */
    async getTriageByEncounterId(encounterId, tenantId) {
        const triage = await this.prisma.triage.findFirst({
            where: {
                encounterId,
                tenantId,
            },
            include: {
                encounter: {
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
                    },
                },
            },
        });
        if (!triage) {
            throw new common_1.NotFoundException(`Triage not found for encounter ${encounterId}`);
        }
        return triage;
    }
    /**
     * Get triage by ID
     */
    async getTriageById(id, tenantId) {
        const triage = await this.prisma.triage.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                encounter: {
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
                    },
                },
            },
        });
        if (!triage) {
            throw new common_1.NotFoundException(`Triage with ID ${id} not found`);
        }
        return triage;
    }
    /**
     * Update triage
     */
    async updateTriage(id, dto, context) {
        const { tenantId } = context;
        // Verify triage exists
        const existing = await this.prisma.triage.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Triage with ID ${id} not found`);
        }
        // Prepare update data
        const updateData = {};
        if (dto.triageStaffId)
            updateData.triageStaffId = dto.triageStaffId;
        if (dto.triageLevel !== undefined)
            updateData.triageLevel = dto.triageLevel;
        if (dto.chiefComplaintsAndHPI !== undefined) {
            updateData.chiefComplaintsAndHPI = dto.chiefComplaintsAndHPI;
        }
        if (dto.vitalSigns !== undefined)
            updateData.vitalSigns = dto.vitalSigns;
        if (dto.painScore !== undefined)
            updateData.painScore = dto.painScore;
        if (dto.allergies !== undefined)
            updateData.allergies = dto.allergies;
        if (dto.currentMedications !== undefined) {
            updateData.currentMedications = dto.currentMedications;
        }
        if (dto.triageNotes !== undefined)
            updateData.triageNotes = dto.triageNotes;
        const updated = await this.prisma.triage.update({
            where: { id },
            data: updateData,
            include: {
                encounter: {
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
                    },
                },
            },
        });
        return updated;
    }
    /**
     * Delete triage
     */
    async deleteTriage(id, tenantId) {
        const triage = await this.prisma.triage.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        if (!triage) {
            throw new common_1.NotFoundException(`Triage with ID ${id} not found`);
        }
        await this.prisma.triage.delete({
            where: { id },
        });
        return { message: 'Triage deleted successfully' };
    }
    /**
     * Get all triages by patient ID
     */
    async getPatientTriages(patientId, tenantId) {
        return this.prisma.triage.findMany({
            where: {
                patientId,
                tenantId,
            },
            orderBy: { triageTime: 'desc' },
            include: {
                encounter: {
                    select: {
                        id: true,
                        status: true,
                        startTime: true,
                        encounterClass: true,
                    },
                },
            },
        });
    }
    /**
     * Get triages by triage level (for prioritization)
     */
    async getTriagesByLevel(triageLevel, tenantId) {
        return this.prisma.triage.findMany({
            where: {
                triageLevel,
                tenantId,
            },
            orderBy: { triageTime: 'asc' }, // Oldest first for urgent cases
            include: {
                encounter: {
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
                    },
                },
            },
        });
    }
};
exports.TriageService = TriageService;
exports.TriageService = TriageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], TriageService);
//# sourceMappingURL=triage.service.js.map