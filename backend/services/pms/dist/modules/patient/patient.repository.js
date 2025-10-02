var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
import { PaginatedResult } from '@zeal/contracts';
let PatientRepository = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatientRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PatientRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async create(data) {
            return this.prisma.patient.create({
                data: {
                    ...data,
                    dateOfBirth: new Date(data.dateOfBirth),
                },
            });
        }
        async findById(id) {
            return this.prisma.patient.findUnique({
                where: { id },
            });
        }
        async findByIdWithTranslations(id) {
            return this.prisma.patient.findUnique({
                where: { id },
                include: {
                    translations: true,
                },
            });
        }
        async findByEmiratesId(emiratesId) {
            return this.prisma.patient.findUnique({
                where: { emiratesId },
            });
        }
        async findMany(query) {
            const { page, limit, search, gender, status, emirate, ageRange, dateRange, sortBy, sortOrder } = query;
            const skip = (page - 1) * limit;
            // Build where clause
            const where = {};
            if (search) {
                where.OR = [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { emiratesId: { contains: search } },
                    { phoneNumber: { contains: search } },
                    { email: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (gender) {
                where.gender = gender;
            }
            if (status) {
                where.status = status;
            }
            if (emirate) {
                where.emirate = emirate;
            }
            if (ageRange) {
                const currentDate = new Date();
                if (ageRange.min !== undefined) {
                    const maxBirthDate = new Date(currentDate.getFullYear() - ageRange.min, currentDate.getMonth(), currentDate.getDate());
                    where.dateOfBirth = { ...where.dateOfBirth, lte: maxBirthDate };
                }
                if (ageRange.max !== undefined) {
                    const minBirthDate = new Date(currentDate.getFullYear() - ageRange.max - 1, currentDate.getMonth(), currentDate.getDate());
                    where.dateOfBirth = { ...where.dateOfBirth, gte: minBirthDate };
                }
            }
            if (dateRange) {
                if (dateRange.from || dateRange.to) {
                    where.createdAt = {};
                    if (dateRange.from) {
                        where.createdAt.gte = new Date(dateRange.from);
                    }
                    if (dateRange.to) {
                        where.createdAt.lte = new Date(dateRange.to);
                    }
                }
            }
            // Build orderBy clause
            const orderBy = {};
            orderBy[sortBy] = sortOrder;
            const [patients, total] = await Promise.all([
                this.prisma.patient.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limit,
                    include: {
                        translations: true,
                    },
                }),
                this.prisma.patient.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: patients,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        }
        async search(searchDto) {
            const { q, fields = ['firstName', 'lastName', 'emiratesId'], limit } = searchDto;
            const searchConditions = fields.map(field => {
                switch (field) {
                    case 'firstName':
                        return { firstName: { contains: q, mode: 'insensitive' } };
                    case 'lastName':
                        return { lastName: { contains: q, mode: 'insensitive' } };
                    case 'emiratesId':
                        return { emiratesId: { contains: q } };
                    case 'phoneNumber':
                        return { phoneNumber: { contains: q } };
                    case 'email':
                        return { email: { contains: q, mode: 'insensitive' } };
                    default:
                        return {};
                }
            }).filter(condition => Object.keys(condition).length > 0);
            const patients = await this.prisma.patient.findMany({
                where: {
                    OR: searchConditions,
                },
                take: limit,
                select: {
                    id: true,
                    emiratesId: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    gender: true,
                    phoneNumber: true,
                    email: true,
                },
            });
            // Calculate match scores (simplified implementation)
            return patients.map(patient => ({
                ...patient,
                matchScore: this.calculateMatchScore(patient, q, fields),
                matchReason: this.getMatchReason(patient, q, fields),
            }));
        }
        async update(id, data) {
            const updateData = { ...data };
            if (data.dateOfBirth) {
                updateData.dateOfBirth = new Date(data.dateOfBirth);
            }
            return this.prisma.patient.update({
                where: { id },
                data: updateData,
            });
        }
        async delete(id) {
            await this.prisma.patient.update({
                where: { id },
                data: { status: 'deleted' },
            });
        }
        async getPatientAppointments(patientId, query) {
            const { limit = 20, page = 1 } = query;
            const skip = (page - 1) * limit;
            const [appointments, total] = await Promise.all([
                this.prisma.appointment.findMany({
                    where: { patientId },
                    orderBy: { startTime: 'desc' },
                    skip,
                    take: limit,
                    include: {
                        staff: true,
                        facility: true,
                        space: true,
                    },
                }),
                this.prisma.appointment.count({ where: { patientId } }),
            ]);
            return {
                data: appointments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1,
                },
            };
        }
        async getPatientEncounters(patientId, query) {
            const { limit = 20, page = 1 } = query;
            const skip = (page - 1) * limit;
            const [encounters, total] = await Promise.all([
                this.prisma.encounter.findMany({
                    where: { patientId },
                    orderBy: { startTime: 'desc' },
                    skip,
                    take: limit,
                    include: {
                        primaryStaff: true,
                        appointment: true,
                        clinicalNotes: true,
                        vitals: true,
                    },
                }),
                this.prisma.encounter.count({ where: { patientId } }),
            ]);
            return {
                data: encounters,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1,
                },
            };
        }
        async getPatientDiagnoses(patientId) {
            // This would query from clinical notes or a separate diagnoses table
            // For now, return empty array as diagnoses table is not in the current schema
            return [];
        }
        async getPatientMedications(patientId) {
            // This would query from prescriptions or medication orders
            // For now, return empty array as medication tables are not in the current schema
            return [];
        }
        async getPatientAllergies(patientId) {
            // This would query from allergies table
            // For now, return empty array as allergies table is not in the current schema
            return [];
        }
        async getPatientImmunizations(patientId) {
            // This would query from immunizations table
            // For now, return empty array as immunizations table is not in the current schema
            return [];
        }
        async getPatientVitals(patientId) {
            const encounters = await this.prisma.encounter.findMany({
                where: { patientId },
                include: {
                    vitals: true,
                },
            });
            return encounters.flatMap(encounter => encounter.vitals);
        }
        async mergePatients(primaryPatientId, secondaryPatientId) {
            await this.prisma.$transaction(async (tx) => {
                // Update all related records to point to primary patient
                await tx.appointment.updateMany({
                    where: { patientId: secondaryPatientId },
                    data: { patientId: primaryPatientId },
                });
                await tx.encounter.updateMany({
                    where: { patientId: secondaryPatientId },
                    data: { patientId: primaryPatientId },
                });
                // Update translations
                await tx.translation.updateMany({
                    where: {
                        entityType: 'patient',
                        entityId: secondaryPatientId,
                    },
                    data: { entityId: primaryPatientId },
                });
                // Delete secondary patient
                await tx.patient.delete({
                    where: { id: secondaryPatientId },
                });
            });
        }
        async findDuplicates(patient) {
            // Simple duplicate detection based on name and date of birth
            const potentialDuplicates = await this.prisma.patient.findMany({
                where: {
                    AND: [
                        { id: { not: patient.id } },
                        { firstName: { equals: patient.firstName, mode: 'insensitive' } },
                        { lastName: { equals: patient.lastName, mode: 'insensitive' } },
                        { dateOfBirth: patient.dateOfBirth },
                    ],
                },
                select: {
                    id: true,
                    emiratesId: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    gender: true,
                    phoneNumber: true,
                    email: true,
                },
            });
            return potentialDuplicates.map(dup => ({
                ...dup,
                matchScore: this.calculateDuplicateScore(patient, dup),
            }));
        }
        async updateConsent(patientId, consentDto) {
            return this.prisma.patientConsent.upsert({
                where: {
                    patientId_consentType: {
                        patientId,
                        consentType: consentDto.consentType,
                    },
                },
                update: consentDto,
                create: {
                    patientId,
                    ...consentDto,
                },
            });
        }
        async getTranslations(patientId) {
            return this.prisma.translation.findMany({
                where: {
                    entityType: 'patient',
                    entityId: patientId,
                },
            });
        }
        async updateTranslations(patientId, translations) {
            await this.prisma.$transaction(async (tx) => {
                // Delete existing translations
                await tx.translation.deleteMany({
                    where: {
                        entityType: 'patient',
                        entityId: patientId,
                    },
                });
                // Create new translations
                await tx.translation.createMany({
                    data: translations.map(translation => ({
                        entityType: 'patient',
                        entityId: patientId,
                        ...translation,
                    })),
                });
            });
            return this.getTranslations(patientId);
        }
        calculateMatchScore(patient, query, fields) {
            let score = 0;
            const queryLower = query.toLowerCase();
            fields.forEach(field => {
                const value = patient[field]?.toLowerCase() || '';
                if (value.includes(queryLower)) {
                    score += 0.3;
                }
                if (value === queryLower) {
                    score += 0.7;
                }
            });
            return Math.min(score, 1);
        }
        getMatchReason(patient, query, fields) {
            const reasons = [];
            const queryLower = query.toLowerCase();
            fields.forEach(field => {
                const value = patient[field]?.toLowerCase() || '';
                if (value.includes(queryLower)) {
                    reasons.push(`${field} contains "${query}"`);
                }
            });
            return reasons.join(', ');
        }
        calculateDuplicateScore(patient1, patient2) {
            let score = 0;
            // Name match (40% weight)
            if (patient1.firstName.toLowerCase() === patient2.firstName.toLowerCase())
                score += 0.2;
            if (patient1.lastName.toLowerCase() === patient2.lastName.toLowerCase())
                score += 0.2;
            // Date of birth match (30% weight)
            if (patient1.dateOfBirth.getTime() === patient2.dateOfBirth.getTime())
                score += 0.3;
            // Gender match (10% weight)
            if (patient1.gender === patient2.gender)
                score += 0.1;
            // Phone/Email match (20% weight)
            if (patient1.phoneNumber && patient2.phoneNumber &&
                patient1.phoneNumber === patient2.phoneNumber)
                score += 0.1;
            if (patient1.email && patient2.email &&
                patient1.email.toLowerCase() === patient2.email.toLowerCase())
                score += 0.1;
            return Math.min(score, 1);
        }
    };
    return PatientRepository = _classThis;
})();
export { PatientRepository };
//# sourceMappingURL=patient.repository.js.map