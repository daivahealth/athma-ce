"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
const common_1 = require("@nestjs/common");
const patient_service_1 = require("./patient.service");
const patient_dto_1 = require("./dto/patient.dto");
let PatientController = (() => {
    let _classDecorators = [(0, common_1.Controller)('patients')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createPatient_decorators;
    let _getPatients_decorators;
    let _searchPatients_decorators;
    let _getPatient_decorators;
    let _updatePatient_decorators;
    let _deletePatient_decorators;
    let _getPatientAppointments_decorators;
    let _getPatientEncounters_decorators;
    let _getPatientMedicalHistory_decorators;
    let _mergePatients_decorators;
    let _findDuplicatePatients_decorators;
    let _updatePatientConsent_decorators;
    let _getPatientTranslations_decorators;
    let _updatePatientTranslations_decorators;
    var PatientController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createPatient_decorators = [(0, common_1.Post)()];
            _getPatients_decorators = [(0, common_1.Get)()];
            _searchPatients_decorators = [(0, common_1.Get)('search')];
            _getPatient_decorators = [(0, common_1.Get)(':id')];
            _updatePatient_decorators = [(0, common_1.Put)(':id')];
            _deletePatient_decorators = [(0, common_1.Delete)(':id')];
            _getPatientAppointments_decorators = [(0, common_1.Get)(':id/appointments')];
            _getPatientEncounters_decorators = [(0, common_1.Get)(':id/encounters')];
            _getPatientMedicalHistory_decorators = [(0, common_1.Get)(':id/medical-history')];
            _mergePatients_decorators = [(0, common_1.Post)(':id/merge')];
            _findDuplicatePatients_decorators = [(0, common_1.Get)(':id/duplicates')];
            _updatePatientConsent_decorators = [(0, common_1.Post)(':id/consent')];
            _getPatientTranslations_decorators = [(0, common_1.Get)(':id/translations')];
            _updatePatientTranslations_decorators = [(0, common_1.Post)(':id/translations')];
            __esDecorate(this, null, _createPatient_decorators, { kind: "method", name: "createPatient", static: false, private: false, access: { has: obj => "createPatient" in obj, get: obj => obj.createPatient }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatients_decorators, { kind: "method", name: "getPatients", static: false, private: false, access: { has: obj => "getPatients" in obj, get: obj => obj.getPatients }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchPatients_decorators, { kind: "method", name: "searchPatients", static: false, private: false, access: { has: obj => "searchPatients" in obj, get: obj => obj.searchPatients }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatient_decorators, { kind: "method", name: "getPatient", static: false, private: false, access: { has: obj => "getPatient" in obj, get: obj => obj.getPatient }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updatePatient_decorators, { kind: "method", name: "updatePatient", static: false, private: false, access: { has: obj => "updatePatient" in obj, get: obj => obj.updatePatient }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deletePatient_decorators, { kind: "method", name: "deletePatient", static: false, private: false, access: { has: obj => "deletePatient" in obj, get: obj => obj.deletePatient }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatientAppointments_decorators, { kind: "method", name: "getPatientAppointments", static: false, private: false, access: { has: obj => "getPatientAppointments" in obj, get: obj => obj.getPatientAppointments }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatientEncounters_decorators, { kind: "method", name: "getPatientEncounters", static: false, private: false, access: { has: obj => "getPatientEncounters" in obj, get: obj => obj.getPatientEncounters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatientMedicalHistory_decorators, { kind: "method", name: "getPatientMedicalHistory", static: false, private: false, access: { has: obj => "getPatientMedicalHistory" in obj, get: obj => obj.getPatientMedicalHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _mergePatients_decorators, { kind: "method", name: "mergePatients", static: false, private: false, access: { has: obj => "mergePatients" in obj, get: obj => obj.mergePatients }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findDuplicatePatients_decorators, { kind: "method", name: "findDuplicatePatients", static: false, private: false, access: { has: obj => "findDuplicatePatients" in obj, get: obj => obj.findDuplicatePatients }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updatePatientConsent_decorators, { kind: "method", name: "updatePatientConsent", static: false, private: false, access: { has: obj => "updatePatientConsent" in obj, get: obj => obj.updatePatientConsent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPatientTranslations_decorators, { kind: "method", name: "getPatientTranslations", static: false, private: false, access: { has: obj => "getPatientTranslations" in obj, get: obj => obj.getPatientTranslations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updatePatientTranslations_decorators, { kind: "method", name: "updatePatientTranslations", static: false, private: false, access: { has: obj => "updatePatientTranslations" in obj, get: obj => obj.updatePatientTranslations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PatientController = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        patientService = __runInitializers(this, _instanceExtraInitializers);
        constructor(patientService) {
            this.patientService = patientService;
        }
        async createPatient(createPatientDto) {
            return this.patientService.createPatient(createPatientDto);
        }
        async getPatients(query) {
            return this.patientService.getPatients(query);
        }
        async searchPatients(searchDto) {
            return this.patientService.searchPatients(searchDto);
        }
        async getPatient(id) {
            return this.patientService.getPatientById(id);
        }
        async updatePatient(id, updatePatientDto) {
            return this.patientService.updatePatient(id, updatePatientDto);
        }
        async deletePatient(id) {
            return this.patientService.deletePatient(id);
        }
        async getPatientAppointments(id, query) {
            return this.patientService.getPatientAppointments(id, query);
        }
        async getPatientEncounters(id, query) {
            return this.patientService.getPatientEncounters(id, query);
        }
        async getPatientMedicalHistory(id) {
            return this.patientService.getPatientMedicalHistory(id);
        }
        async mergePatients(primaryPatientId, body) {
            return this.patientService.mergePatients(primaryPatientId, body.secondaryPatientId);
        }
        async findDuplicatePatients(id) {
            return this.patientService.findDuplicatePatients(id);
        }
        async updatePatientConsent(id, consentDto) {
            return this.patientService.updatePatientConsent(id, consentDto);
        }
        async getPatientTranslations(id) {
            return this.patientService.getPatientTranslations(id);
        }
        async updatePatientTranslations(id, translations) {
            return this.patientService.updatePatientTranslations(id, translations);
        }
    };
    return PatientController = _classThis;
})();
exports.PatientController = PatientController;
//# sourceMappingURL=patient.controller.js.map
//# sourceMappingURL=patient.controller.js.map