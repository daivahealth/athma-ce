"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterService = void 0;
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
const encounter_repository_1 = require("./encounter.repository");
const encounter_dto_1 = require("./dto/encounter.dto");
let EncounterService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EncounterService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EncounterService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        encounterRepository;
        constructor(encounterRepository) {
            this.encounterRepository = encounterRepository;
        }
        async createEncounter(createEncounterDto) {
            // Validate encounter data
            this.validateEncounterData(createEncounterDto);
            // Check if patient exists
            const patient = await this.encounterRepository.findPatient(createEncounterDto.patientId);
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found');
            }
            // Check if staff exists
            const staff = await this.encounterRepository.findStaff(createEncounterDto.primaryStaffId);
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            // Check if appointment exists (if provided)
            if (createEncounterDto.appointmentId) {
                const appointment = await this.encounterRepository.findAppointment(createEncounterDto.appointmentId);
                if (!appointment) {
                    throw new common_1.NotFoundException('Appointment not found');
                }
                // Check if appointment is not already linked to another encounter
                const existingEncounter = await this.encounterRepository.findByAppointmentId(createEncounterDto.appointmentId);
                if (existingEncounter) {
                    throw new common_1.ConflictException('Appointment is already linked to another encounter');
                }
            }
            // Create encounter
            const encounter = await this.encounterRepository.create(createEncounterDto);
            // Update appointment status if linked
            if (createEncounterDto.appointmentId) {
                await this.encounterRepository.updateAppointmentStatus(createEncounterDto.appointmentId, 'in_progress');
            }
            return this.encounterRepository.findByIdWithDetails(encounter.id);
        }
        async getEncounters(query) {
            return this.encounterRepository.findMany(query);
        }
        async searchEncounters(searchDto) {
            return this.encounterRepository.search(searchDto);
        }
        async getEncounterById(id) {
            const encounter = await this.encounterRepository.findByIdWithDetails(id);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            return encounter;
        }
        async updateEncounter(id, updateEncounterDto) {
            const existingEncounter = await this.encounterRepository.findById(id);
            if (!existingEncounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            // Validate staff if being updated
            if (updateEncounterDto.primaryStaffId) {
                const staff = await this.encounterRepository.findStaff(updateEncounterDto.primaryStaffId);
                if (!staff) {
                    throw new common_1.NotFoundException('Staff member not found');
                }
            }
            await this.encounterRepository.update(id, updateEncounterDto);
            return this.encounterRepository.findByIdWithDetails(id);
        }
        async deleteEncounter(id) {
            const encounter = await this.encounterRepository.findById(id);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            // Check if encounter can be deleted
            if (encounter.status === 'finished') {
                throw new common_1.BadRequestException('Cannot delete finished encounter');
            }
            // Update linked appointment status if exists
            if (encounter.appointmentId) {
                await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'confirmed');
            }
            await this.encounterRepository.delete(id);
        }
        async startEncounter(id) {
            const encounter = await this.encounterRepository.findById(id);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            if (encounter.status !== 'planned') {
                throw new common_1.BadRequestException('Encounter must be in planned status to start');
            }
            await this.encounterRepository.update(id, {
                status: 'in_progress',
                startTime: new Date(),
            });
            return this.encounterRepository.findByIdWithDetails(id);
        }
        async completeEncounter(id) {
            const encounter = await this.encounterRepository.findById(id);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            if (!['in_progress', 'onleave'].includes(encounter.status)) {
                throw new common_1.BadRequestException('Encounter must be in progress or on leave to complete');
            }
            await this.encounterRepository.update(id, {
                status: 'finished',
                endTime: new Date(),
            });
            // Update linked appointment status if exists
            if (encounter.appointmentId) {
                await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'completed');
            }
            return this.encounterRepository.findByIdWithDetails(id);
        }
        async cancelEncounter(id, reason) {
            const encounter = await this.encounterRepository.findById(id);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            if (encounter.status === 'finished') {
                throw new common_1.BadRequestException('Cannot cancel finished encounter');
            }
            await this.encounterRepository.update(id, {
                status: 'cancelled',
                notes: encounter.notes ? `${encounter.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`,
            });
            // Update linked appointment status if exists
            if (encounter.appointmentId) {
                await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'cancelled');
            }
            return this.encounterRepository.findByIdWithDetails(id);
        }
        // Clinical Notes Management
        async getClinicalNotes(encounterId) {
            return this.encounterRepository.getClinicalNotes(encounterId);
        }
        async createClinicalNote(createNoteDto) {
            // Validate encounter exists
            const encounter = await this.encounterRepository.findById(createNoteDto.encounterId);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            // Validate author exists
            const author = await this.encounterRepository.findStaff(createNoteDto.authorStaffId);
            if (!author) {
                throw new common_1.NotFoundException('Author not found');
            }
            return this.encounterRepository.createClinicalNote(createNoteDto);
        }
        async updateClinicalNote(noteId, updateNoteDto) {
            const note = await this.encounterRepository.findClinicalNote(noteId);
            if (!note) {
                throw new common_1.NotFoundException('Clinical note not found');
            }
            if (note.isSigned) {
                throw new common_1.BadRequestException('Cannot update signed note');
            }
            return this.encounterRepository.updateClinicalNote(noteId, updateNoteDto);
        }
        async deleteClinicalNote(noteId) {
            const note = await this.encounterRepository.findClinicalNote(noteId);
            if (!note) {
                throw new common_1.NotFoundException('Clinical note not found');
            }
            if (note.isSigned) {
                throw new common_1.BadRequestException('Cannot delete signed note');
            }
            await this.encounterRepository.deleteClinicalNote(noteId);
        }
        async signClinicalNote(noteId, signedBy) {
            const note = await this.encounterRepository.findClinicalNote(noteId);
            if (!note) {
                throw new common_1.NotFoundException('Clinical note not found');
            }
            if (note.isSigned) {
                throw new common_1.BadRequestException('Note is already signed');
            }
            return this.encounterRepository.updateClinicalNote(noteId, {
                isSigned: true,
                signedAt: new Date(),
                signedBy,
            });
        }
        // Vitals Management
        async getVitals(encounterId) {
            return this.encounterRepository.getVitals(encounterId);
        }
        async recordVitals(createVitalsDto) {
            // Validate encounter exists
            const encounter = await this.encounterRepository.findById(createVitalsDto.encounterId);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            // Validate recorded by exists
            const recorder = await this.encounterRepository.findStaff(createVitalsDto.recordedBy);
            if (!recorder) {
                throw new common_1.NotFoundException('Recorder not found');
            }
            // Calculate BMI if height and weight are provided
            if (createVitalsDto.height && createVitalsDto.weight) {
                const heightInMeters = createVitalsDto.height / 100;
                createVitalsDto.bmi = createVitalsDto.weight / (heightInMeters * heightInMeters);
            }
            return this.encounterRepository.createVitals(createVitalsDto);
        }
        async updateVitals(vitalId, updates) {
            const vital = await this.encounterRepository.findVital(vitalId);
            if (!vital) {
                throw new common_1.NotFoundException('Vital signs not found');
            }
            // Recalculate BMI if height or weight changed
            if (updates.height || updates.weight) {
                const height = updates.height || vital.height;
                const weight = updates.weight || vital.weight;
                if (height && weight) {
                    const heightInMeters = height / 100;
                    updates.bmi = weight / (heightInMeters * heightInMeters);
                }
            }
            return this.encounterRepository.updateVitals(vitalId, updates);
        }
        // Orders Management
        async getOrders(encounterId) {
            return this.encounterRepository.getOrders(encounterId);
        }
        async createOrder(createOrderDto) {
            // Validate encounter exists
            const encounter = await this.encounterRepository.findById(createOrderDto.encounterId);
            if (!encounter) {
                throw new common_1.NotFoundException('Encounter not found');
            }
            // Validate requested by exists
            const requester = await this.encounterRepository.findStaff(createOrderDto.requestedBy);
            if (!requester) {
                throw new common_1.NotFoundException('Requester not found');
            }
            return this.encounterRepository.createOrder(createOrderDto);
        }
        async updateOrder(orderId, updates) {
            const order = await this.encounterRepository.findOrder(orderId);
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            return this.encounterRepository.updateOrder(orderId, updates);
        }
        async cancelOrder(orderId, reason) {
            const order = await this.encounterRepository.findOrder(orderId);
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.status === 'completed') {
                throw new common_1.BadRequestException('Cannot cancel completed order');
            }
            return this.encounterRepository.updateOrder(orderId, {
                status: 'cancelled',
                notes: order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`,
            });
        }
        async getEncounterStats(query) {
            return this.encounterRepository.getEncounterStats(query);
        }
        validateEncounterData(data) {
            if (data.endTime && new Date(data.startTime) >= new Date(data.endTime)) {
                throw new common_1.BadRequestException('End time must be after start time');
            }
            if (new Date(data.startTime) > new Date()) {
                throw new common_1.BadRequestException('Cannot create encounter in the future');
            }
            // Validate vital signs ranges
            if (data.vitalSigns) {
                this.validateVitalSigns(data.vitalSigns);
            }
        }
        validateVitalSigns(vitals) {
            if (vitals.temperature && (vitals.temperature < 30 || vitals.temperature > 45)) {
                throw new common_1.BadRequestException('Temperature must be between 30°C and 45°C');
            }
            if (vitals.bloodPressure) {
                if (vitals.bloodPressure.systolic < 50 || vitals.bloodPressure.systolic > 250) {
                    throw new common_1.BadRequestException('Systolic blood pressure must be between 50 and 250 mmHg');
                }
                if (vitals.bloodPressure.diastolic < 30 || vitals.bloodPressure.diastolic > 150) {
                    throw new common_1.BadRequestException('Diastolic blood pressure must be between 30 and 150 mmHg');
                }
                if (vitals.bloodPressure.systolic <= vitals.bloodPressure.diastolic) {
                    throw new common_1.BadRequestException('Systolic pressure must be higher than diastolic pressure');
                }
            }
            if (vitals.heartRate && (vitals.heartRate < 30 || vitals.heartRate > 250)) {
                throw new common_1.BadRequestException('Heart rate must be between 30 and 250 bpm');
            }
            if (vitals.respiratoryRate && (vitals.respiratoryRate < 5 || vitals.respiratoryRate > 60)) {
                throw new common_1.BadRequestException('Respiratory rate must be between 5 and 60 breaths per minute');
            }
            if (vitals.oxygenSaturation && (vitals.oxygenSaturation < 70 || vitals.oxygenSaturation > 100)) {
                throw new common_1.BadRequestException('Oxygen saturation must be between 70% and 100%');
            }
            if (vitals.painScore && (vitals.painScore < 0 || vitals.painScore > 10)) {
                throw new common_1.BadRequestException('Pain score must be between 0 and 10');
            }
        }
    };
    return EncounterService = _classThis;
})();
exports.EncounterService = EncounterService;
//# sourceMappingURL=encounter.service.js.map
//# sourceMappingURL=encounter.service.js.map