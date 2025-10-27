"use strict";
/**
 * Patient Module
 *
 * Manages patient records, documents, and history
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModule = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
// Controllers
const patient_controller_1 = require("./patient.controller");
const patient_document_controller_1 = require("./patient-document.controller");
const patient_history_controller_1 = require("./patient-history.controller");
// Services
const patient_service_1 = require("./patient.service");
const patient_document_service_1 = require("./patient-document.service");
const patient_history_service_1 = require("./patient-history.service");
const mrn_generator_service_1 = require("./mrn-generator.service");
let PatientModule = class PatientModule {
};
exports.PatientModule = PatientModule;
exports.PatientModule = PatientModule = __decorate([
    (0, common_1.Module)({
        imports: [database_clinical_1.ClinicalDatabaseModule],
        controllers: [
            patient_controller_1.PatientController,
            patient_document_controller_1.PatientDocumentController,
            patient_history_controller_1.PatientHistoryController,
        ],
        providers: [
            patient_service_1.PatientService,
            patient_document_service_1.PatientDocumentService,
            patient_history_service_1.PatientHistoryService,
            mrn_generator_service_1.MrnGeneratorService,
        ],
        exports: [
            patient_service_1.PatientService,
            patient_document_service_1.PatientDocumentService,
            patient_history_service_1.PatientHistoryService,
            mrn_generator_service_1.MrnGeneratorService,
        ],
    })
], PatientModule);
//# sourceMappingURL=patient.module.js.map