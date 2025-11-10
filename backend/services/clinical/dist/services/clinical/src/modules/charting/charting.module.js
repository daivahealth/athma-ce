"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartingModule = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
// Services
const clinical_notes_service_1 = require("./services/clinical-notes.service");
const diagnosis_service_1 = require("./services/diagnosis.service");
const clinical_orders_service_1 = require("./services/clinical-orders.service");
const prescriptions_service_1 = require("./services/prescriptions.service");
// Controllers
const clinical_notes_controller_1 = require("./controllers/clinical-notes.controller");
const diagnosis_controller_1 = require("./controllers/diagnosis.controller");
const clinical_orders_controller_1 = require("./controllers/clinical-orders.controller");
const prescriptions_controller_1 = require("./controllers/prescriptions.controller");
let ChartingModule = class ChartingModule {
};
exports.ChartingModule = ChartingModule;
exports.ChartingModule = ChartingModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            clinical_notes_controller_1.ClinicalNotesController,
            diagnosis_controller_1.DiagnosisController,
            clinical_orders_controller_1.ClinicalOrdersController,
            prescriptions_controller_1.PrescriptionsController,
        ],
        providers: [
            database_clinical_1.PrismaService,
            clinical_notes_service_1.ClinicalNotesService,
            diagnosis_service_1.DiagnosisService,
            clinical_orders_service_1.ClinicalOrdersService,
            prescriptions_service_1.PrescriptionsService,
        ],
        exports: [
            clinical_notes_service_1.ClinicalNotesService,
            diagnosis_service_1.DiagnosisService,
            clinical_orders_service_1.ClinicalOrdersService,
            prescriptions_service_1.PrescriptionsService,
        ],
    })
], ChartingModule);
//# sourceMappingURL=charting.module.js.map