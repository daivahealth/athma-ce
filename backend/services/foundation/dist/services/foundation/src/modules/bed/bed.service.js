"use strict";
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
exports.BedService = void 0;
const common_1 = require("@nestjs/common");
const bed_repository_1 = require("./bed.repository");
const database_foundation_1 = require("@zeal/database-foundation");
const database_clinical_1 = require("@zeal/database-clinical");
const ward_repository_1 = require("../ward/ward.repository");
let BedService = class BedService {
    bedRepo;
    wardRepo;
    foundationPrisma;
    clinicalPrisma;
    constructor(bedRepo, wardRepo, foundationPrisma, clinicalPrisma) {
        this.bedRepo = bedRepo;
        this.wardRepo = wardRepo;
        this.foundationPrisma = foundationPrisma;
        this.clinicalPrisma = clinicalPrisma;
    }
    async create(wardId, createBedDto) {
        // Verify ward exists
        const ward = await this.foundationPrisma.ward.findUnique({
            where: { id: wardId },
            select: {
                id: true,
                status: true,
                department: {
                    select: {
                        facility: {
                            select: {
                                tenantId: true,
                            },
                        },
                    },
                },
            },
        });
        if (!ward) {
            throw new common_1.NotFoundException(`Ward with ID ${wardId} not found`);
        }
        if (ward.status !== 'active') {
            throw new common_1.BadRequestException('Cannot create bed for inactive ward');
        }
        // Check if bed number already exists for this ward
        const bedNumberExists = await this.bedRepo.checkBedNumberExists(wardId, createBedDto.bedNumber);
        if (bedNumberExists) {
            throw new common_1.BadRequestException(`Bed number '${createBedDto.bedNumber}' already exists for this ward`);
        }
        // Create bed
        const bed = await this.bedRepo.create(wardId, createBedDto);
        // Update ward bed counts
        await this.wardRepo.updateBedCounts(wardId);
        return bed;
    }
    async findAll(wardId, status) {
        // Verify ward exists
        const ward = await this.foundationPrisma.ward.findUnique({
            where: { id: wardId },
            select: { id: true },
        });
        if (!ward) {
            throw new common_1.NotFoundException(`Ward with ID ${wardId} not found`);
        }
        const beds = await this.bedRepo.findAll(wardId, status);
        return this.hydrateBedsWithPatients(beds);
    }
    async findOne(id) {
        const bed = await this.bedRepo.findOne(id);
        if (!bed) {
            throw new common_1.NotFoundException(`Bed with ID ${id} not found`);
        }
        const [hydrated] = await this.hydrateBedsWithPatients([bed]);
        return hydrated;
    }
    async update(id, updateBedDto) {
        const existing = await this.bedRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Bed with ID ${id} not found`);
        }
        // Check if bed number is being changed and if it already exists
        if (updateBedDto.bedNumber && updateBedDto.bedNumber !== existing.bedNumber) {
            const bedNumberExists = await this.bedRepo.checkBedNumberExists(existing.wardId, updateBedDto.bedNumber, id);
            if (bedNumberExists) {
                throw new common_1.BadRequestException(`Bed number '${updateBedDto.bedNumber}' already exists for this ward`);
            }
        }
        return this.bedRepo.update(id, updateBedDto);
    }
    async remove(id) {
        const existing = await this.bedRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Bed with ID ${id} not found`);
        }
        // Cannot delete occupied bed
        if (existing.status === 'occupied') {
            throw new common_1.BadRequestException('Cannot delete occupied bed. Release the patient first.');
        }
        const wardId = existing.wardId;
        // Delete bed
        await this.bedRepo.remove(id);
        // Update ward bed counts
        await this.wardRepo.updateBedCounts(wardId);
        return { success: true, message: 'Bed deleted successfully' };
    }
    async assignPatient(bedId, assignBedDto) {
        const bed = await this.bedRepo.findOne(bedId);
        if (!bed) {
            throw new common_1.NotFoundException(`Bed with ID ${bedId} not found`);
        }
        if (bed.status === 'occupied') {
            throw new common_1.BadRequestException('Bed is already occupied');
        }
        if (bed.status === 'maintenance') {
            throw new common_1.BadRequestException('Bed is under maintenance');
        }
        // Verify patient exists and belongs to same tenant
        const patient = await this.clinicalPrisma.patient.findUnique({
            where: { id: assignBedDto.patientId },
            select: { id: true, tenantId: true, status: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${assignBedDto.patientId} not found`);
        }
        const tenantId = bed.ward.department.facility.tenantId;
        if (patient.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Patient must belong to the same tenant as the facility');
        }
        if (patient.status !== 'active') {
            throw new common_1.BadRequestException('Cannot assign inactive patient to bed');
        }
        // Check if patient is already assigned to another bed
        const existingAssignment = await this.foundationPrisma.bed.findFirst({
            where: {
                currentPatientId: assignBedDto.patientId,
                status: 'occupied',
            },
            select: {
                id: true,
                bedNumber: true,
                ward: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (existingAssignment) {
            throw new common_1.BadRequestException(`Patient is already assigned to bed ${existingAssignment.bedNumber} in ${existingAssignment.ward.name}`);
        }
        // Assign patient to bed
        const assignedBed = await this.bedRepo.assignPatient(bedId, assignBedDto.patientId);
        const currentPatient = await this.clinicalPrisma.patient.findUnique({
            where: { id: assignBedDto.patientId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                emiratesId: true,
                dateOfBirth: true,
                gender: true,
            },
        });
        // Update ward bed counts
        await this.wardRepo.updateBedCounts(bed.wardId);
        return {
            success: true,
            message: 'Patient assigned to bed successfully',
            bed: {
                id: assignedBed.id,
                bedNumber: assignedBed.bedNumber,
                bedType: assignedBed.bedType,
                status: assignedBed.status,
                assignedAt: assignedBed.assignedAt,
                patient: currentPatient,
                ward: {
                    id: assignedBed.ward.id,
                    name: assignedBed.ward.name,
                },
            },
        };
    }
    async releasePatient(bedId, releaseBedDto) {
        const bed = await this.bedRepo.findOne(bedId);
        if (!bed) {
            throw new common_1.NotFoundException(`Bed with ID ${bedId} not found`);
        }
        if (bed.status !== 'occupied') {
            throw new common_1.BadRequestException('Bed is not occupied');
        }
        if (!bed.currentPatientId) {
            throw new common_1.BadRequestException('No patient assigned to this bed');
        }
        const patientId = bed.currentPatientId;
        const wardId = bed.wardId;
        // Release bed
        const releasedBed = await this.bedRepo.releasePatient(bedId);
        // Update ward bed counts
        await this.wardRepo.updateBedCounts(wardId);
        return {
            success: true,
            message: 'Patient released from bed successfully',
            bed: {
                id: releasedBed.id,
                bedNumber: releasedBed.bedNumber,
                status: releasedBed.status,
                releasedPatientId: patientId,
                ward: {
                    id: releasedBed.ward.id,
                    name: releasedBed.ward.name,
                },
            },
        };
    }
    async findAvailable(wardId) {
        return this.bedRepo.findAvailable(wardId);
    }
    async hydrateBedsWithPatients(beds) {
        const patientIds = Array.from(new Set(beds.map((bed) => bed.currentPatientId).filter(Boolean)));
        if (patientIds.length === 0) {
            return beds.map((bed) => ({ ...bed, currentPatient: null }));
        }
        const patients = await this.clinicalPrisma.patient.findMany({
            where: {
                id: { in: patientIds },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                emiratesId: true,
                dateOfBirth: true,
                gender: true,
            },
        });
        const patientById = new Map(patients.map((patient) => [patient.id, patient]));
        return beds.map((bed) => ({
            ...bed,
            currentPatient: bed.currentPatientId ? patientById.get(bed.currentPatientId) ?? null : null,
        }));
    }
};
exports.BedService = BedService;
exports.BedService = BedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bed_repository_1.BedRepository,
        ward_repository_1.WardRepository,
        database_foundation_1.PrismaService,
        database_clinical_1.PrismaService])
], BedService);
//# sourceMappingURL=bed.service.js.map