"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
const common_1 = require("@nestjs/common");
const patient_repository_1 = require("./patient.repository");
const patient_dto_1 = require("./dto/patient.dto");
const contracts_1 = require("@zeal/contracts");
let PatientService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatientService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PatientService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        patientRepository;
        constructor(patientRepository) {
            this.patientRepository = patientRepository;
        }
        async createPatient(createPatientDto) {
            // Check if patient with Emirates ID already exists
            const existingPatient = await this.patientRepository.findByEmiratesId(createPatientDto.emiratesId);
            if (existingPatient) {
                throw new common_1.ConflictException('Patient with this Emirates ID already exists');
            }
            // Validate Emirates ID checksum
            this.validateEmiratesIdChecksum(createPatientDto.emiratesId);
            // Create patient
            const patient = await this.patientRepository.create(createPatientDto);
            return this.patientRepository.findByIdWithTranslations(patient.id);
        }
        async getPatients(query) {
            return this.patientRepository.findMany(query);
        }
        async searchPatients(searchDto) {
            return this.patientRepository.search(searchDto);
        }
        async getPatientById(id) {
            const patient = await this.patientRepository.findByIdWithTranslations(id);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            return patient;
        }
        async updatePatient(id, updatePatientDto) {
            // Check if patient exists
            const existingPatient = await this.patientRepository.findById(id);
            if (!existingPatient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            // If Emirates ID is being updated, check for conflicts
            if (updatePatientDto.emiratesId && updatePatientDto.emiratesId !== existingPatient.emiratesId) {
                const conflictPatient = await this.patientRepository.findByEmiratesId(updatePatientDto.emiratesId);
                if (conflictPatient && conflictPatient.id !== id) {
                    throw new common_1.ConflictException('Patient with this Emirates ID already exists');
                }
                this.validateEmiratesIdChecksum(updatePatientDto.emiratesId);
            }
            await this.patientRepository.update(id, updatePatientDto);
            return this.patientRepository.findByIdWithTranslations(id);
        }
        async deletePatient(id) {
            const patient = await this.patientRepository.findById(id);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            await this.patientRepository.delete(id);
        }
        async getPatientAppointments(patientId, query) {
            return this.patientRepository.getPatientAppointments(patientId, query);
        }
        async getPatientEncounters(patientId, query) {
            return this.patientRepository.getPatientEncounters(patientId, query);
        }
        async getPatientMedicalHistory(patientId) {
            const patient = await this.patientRepository.findById(patientId);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            const [appointments, encounters, diagnoses, medications, allergies, immunizations, vitals] = await Promise.all([
                this.patientRepository.getPatientAppointments(patientId, { limit: 100 }),
                this.patientRepository.getPatientEncounters(patientId, { limit: 100 }),
                this.patientRepository.getPatientDiagnoses(patientId),
                this.patientRepository.getPatientMedications(patientId),
                this.patientRepository.getPatientAllergies(patientId),
                this.patientRepository.getPatientImmunizations(patientId),
                this.patientRepository.getPatientVitals(patientId),
            ]);
            // Generate summary
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
        }
        async mergePatients(primaryPatientId, secondaryPatientId) {
            const primaryPatient = await this.patientRepository.findById(primaryPatientId);
            const secondaryPatient = await this.patientRepository.findById(secondaryPatientId);
            if (!primaryPatient || !secondaryPatient) {
                throw new common_1.NotFoundException('One or both patients not found');
            }
            if (primaryPatient.tenantId !== secondaryPatient.tenantId) {
                throw new common_1.BadRequestException('Cannot merge patients from different tenants');
            }
            // Perform merge operation
            await this.patientRepository.mergePatients(primaryPatientId, secondaryPatientId);
            return this.patientRepository.findByIdWithTranslations(primaryPatientId);
        }
        async findDuplicatePatients(patientId) {
            const patient = await this.patientRepository.findById(patientId);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            return this.patientRepository.findDuplicates(patient);
        }
        async updatePatientConsent(patientId, consentDto) {
            const patient = await this.patientRepository.findById(patientId);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            return this.patientRepository.updateConsent(patientId, consentDto);
        }
        async getPatientTranslations(patientId) {
            return this.patientRepository.getTranslations(patientId);
        }
        async updatePatientTranslations(patientId, translations) {
            const patient = await this.patientRepository.findById(patientId);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            return this.patientRepository.updateTranslations(patientId, translations);
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
                sum += parseInt(idWithoutCheck[i]) * weights[i];
            }
            const calculatedCheck = (10 - (sum % 10)) % 10;
            if (calculatedCheck !== checkDigit) {
                throw new common_1.BadRequestException('Invalid Emirates ID checksum');
            }
        }
        generateMedicalHistorySummary(data) {
            const { appointments, encounters, diagnoses, medications, allergies } = data;
            const totalVisits = appointments?.length || 0;
            const lastVisit = appointments?.length > 0 ? appointments[0].createdAt : null;
            // Extract unique primary diagnoses
            const primaryDiagnoses = [...new Set(diagnoses?.map((d) => d.primaryDiagnosis).filter(Boolean) || [])];
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
    return PatientService = _classThis;
})();
exports.PatientService = PatientService;
//# sourceMappingURL=patient.service.js.map
//# sourceMappingURL=patient.service.js.map