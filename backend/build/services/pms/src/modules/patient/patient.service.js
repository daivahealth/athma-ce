var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import { PrismaService } from '@zeal/shared-database';
import { RequestContext } from '@zeal/shared-utils';
let PatientService = class PatientService {
    patientRepository;
    prisma;
    constructor(patientRepository, prisma) {
        this.patientRepository = patientRepository;
        this.prisma = prisma;
    }
    async createPatient(createPatientDto) {
        console.log('PatientService.createPatient() called with:', JSON.stringify(createPatientDto, null, 2));
        try {
            return this.prisma.runWithRequestContext(async (tx) => {
                const tenantId = createPatientDto.tenantId ?? (await this.resolveTenantContext());
                const payload = {
                    ...createPatientDto,
                    tenantId,
                    nationality: createPatientDto.nationality ?? 'UAE',
                    preferredLanguage: createPatientDto.preferredLanguage ?? 'en',
                };
                console.log('Service defaults applied:', JSON.stringify(payload, null, 2));
                console.log(`Checking if patient exists with Emirates ID: ${payload.emiratesId}, Tenant: ${payload.tenantId}`);
                const existingPatient = await this.patientRepository.findByEmiratesIdAndTenant(payload.emiratesId, payload.tenantId, tx);
                if (existingPatient) {
                    console.log('Conflict: Patient already exists');
                    throw new ConflictException('Patient with with Emirates ID already exists');
                }
                console.log('Emirates ID checksum validation...');
                this.validateEmiratesIdChecksum(payload.emiratesId);
                console.log('Calling repository create...');
                const patient = await this.patientRepository.create(payload, tx);
                console.log('Patient created, fetching with translations...');
                return this.patientRepository.findByIdWithTranslations(patient.id, tx);
            });
        }
        catch (error) {
            console.error('PatientService.createPatient() error:', {
                message: error.message,
                stack: error.stack,
                input: createPatientDto,
            });
            throw error;
        }
    }
    async getPatients(query) {
        return this.prisma.runWithRequestContext((tx) => this.patientRepository.findMany(query, tx));
    }
    async searchPatients(searchDto) {
        return this.prisma.runWithRequestContext((tx) => this.patientRepository.search(searchDto, tx));
    }
    async getPatientById(id) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findByIdWithTranslations(id, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            return patient;
        });
    }
    async updatePatient(id, updatePatientDto) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const existingPatient = await this.patientRepository.findById(id, tx);
            if (!existingPatient) {
                throw new NotFoundException('Patient not found');
            }
            if (updatePatientDto.emiratesId && updatePatientDto.emiratesId !== existingPatient.emiratesId) {
                const conflictPatient = await this.patientRepository.findByEmiratesId(updatePatientDto.emiratesId, tx);
                if (conflictPatient && conflictPatient.id !== id) {
                    throw new ConflictException('Patient with this Emirates ID already exists');
                }
                this.validateEmiratesIdChecksum(updatePatientDto.emiratesId);
            }
            await this.patientRepository.update(id, updatePatientDto, tx);
            return this.patientRepository.findByIdWithTranslations(id, tx);
        });
    }
    async deletePatient(id) {
        await this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findById(id, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            await this.patientRepository.delete(id, tx);
        });
    }
    async getPatientAppointments(patientId, query) {
        return this.prisma.runWithRequestContext((tx) => this.patientRepository.getPatientAppointments(patientId, query, tx));
    }
    async getPatientEncounters(patientId, query) {
        return this.prisma.runWithRequestContext((tx) => this.patientRepository.getPatientEncounters(patientId, query, tx));
    }
    async getPatientMedicalHistory(patientId) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findById(patientId, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            const [appointments, encounters, diagnoses, medications, allergies, immunizations, vitals] = await Promise.all([
                this.patientRepository.getPatientAppointments(patientId, { limit: 100 }, tx),
                this.patientRepository.getPatientEncounters(patientId, { limit: 100 }, tx),
                this.patientRepository.getPatientDiagnoses(patientId, tx),
                this.patientRepository.getPatientMedications(patientId, tx),
                this.patientRepository.getPatientAllergies(patientId, tx),
                this.patientRepository.getPatientImmunizations(patientId, tx),
                this.patientRepository.getPatientVitals(patientId, tx),
            ]);
            const summary = this.generateMedicalHistorySummary({
                appointments,
                encounters,
                diagnoses,
                medications,
                allergies,
                immunizations,
            });
            return {
                patientId,
                appointments,
                encounters,
                diagnoses,
                medications,
                allergies,
                immunizations,
                vitals,
                summary,
            };
        });
    }
    async mergePatients(primaryPatientId, secondaryPatientId) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const primaryPatient = await this.patientRepository.findById(primaryPatientId, tx);
            const secondaryPatient = await this.patientRepository.findById(secondaryPatientId, tx);
            if (!primaryPatient || !secondaryPatient) {
                throw new NotFoundException('One or both patients not found');
            }
            if (primaryPatient.tenantId !== secondaryPatient.tenantId) {
                throw new BadRequestException('Cannot merge patients from different tenants');
            }
            await this.patientRepository.mergePatients(primaryPatientId, secondaryPatientId, tx);
            return this.patientRepository.findByIdWithTranslations(primaryPatientId, tx);
        });
    }
    async findDuplicatePatients(patientId) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findById(patientId, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            return this.patientRepository.findDuplicates(patient, tx);
        });
    }
    async updatePatientConsent(patientId, consentDto) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findById(patientId, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            return this.patientRepository.updateConsent(patientId, consentDto, tx);
        });
    }
    async getPatientTranslations(patientId) {
        return this.prisma.runWithRequestContext((tx) => this.patientRepository.getTranslations(patientId, tx));
    }
    async updatePatientTranslations(patientId, translations) {
        return this.prisma.runWithRequestContext(async (tx) => {
            const patient = await this.patientRepository.findById(patientId, tx);
            if (!patient) {
                throw new NotFoundException('Patient not found');
            }
            return this.patientRepository.updateTranslations(patientId, translations, tx);
        });
    }
    async resolveTenantContext() {
        const tenantId = RequestContext.getTenantId();
        if (!tenantId) {
            throw new BadRequestException('Tenant context not available');
        }
        return tenantId;
    }
    validateEmiratesIdChecksum(emiratesId) {
        // Remove hyphens and get the check digit
        const cleanId = emiratesId.replace(/-/g, '');
        const checkDigit = parseInt(cleanId.slice(-1));
        const idWithoutCheck = cleanId.slice(0, -1);
        // Calculate checksum using UAE Emirates ID algorithm
        let sum = 0;
        const weights = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1];
        for (let i = 0; i < idWithoutCheck.length; i++) {
            const weight = weights[i] ?? 1; // Default to 1 if weight is undefined
            const digit = idWithoutCheck[i] || '0'; // Default to '0' if digit is undefined
            sum += parseInt(digit) * weight;
        }
        const calculatedCheck = (10 - (sum % 10)) % 10;
        if (calculatedCheck !== checkDigit) {
            throw new BadRequestException('Invalid Emirates ID checksum');
        }
    }
    generateMedicalHistorySummary(data) {
        const { appointments, encounters, diagnoses, medications, allergies } = data;
        const totalVisits = appointments?.length || 0;
        const lastVisit = appointments?.length > 0 ? appointments[0].createdAt : null;
        // Extract unique primary diagnoses
        const primaryDiagnoses = Array.from(new Set(diagnoses?.map((d) => d.primaryDiagnosis).filter(Boolean) || []));
        // Get current medications
        const currentMedications = medications?.filter((m) => m.status === 'active')
            .map((m) => m.medicationName) || [];
        // Get known allergies
        const knownAllergies = allergies?.map((a) => a.allergen) || [];
        return {
            totalVisits,
            lastVisit,
            primaryDiagnoses,
            currentMedications,
            knownAllergies,
        };
    }
};
PatientService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PatientRepository,
        PrismaService])
], PatientService);
export { PatientService };
//# sourceMappingURL=patient.service.js.map