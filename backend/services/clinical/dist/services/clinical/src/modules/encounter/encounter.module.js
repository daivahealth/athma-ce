"use strict";
/**
 * Encounter Module
 *
 * Manages clinical encounters
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterModule = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const encounter_controller_1 = require("./encounter.controller");
const encounter_service_1 = require("./encounter.service");
const encounter_number_generator_service_1 = require("./encounter-number-generator.service");
const triage_controller_1 = require("./triage.controller");
const triage_service_1 = require("./triage.service");
let EncounterModule = class EncounterModule {
};
exports.EncounterModule = EncounterModule;
exports.EncounterModule = EncounterModule = __decorate([
    (0, common_1.Module)({
        imports: [database_clinical_1.ClinicalDatabaseModule],
        controllers: [encounter_controller_1.EncounterController, triage_controller_1.TriageController],
        providers: [encounter_service_1.EncounterService, encounter_number_generator_service_1.EncounterNumberGeneratorService, triage_service_1.TriageService],
        exports: [encounter_service_1.EncounterService, encounter_number_generator_service_1.EncounterNumberGeneratorService, triage_service_1.TriageService],
    })
], EncounterModule);
//# sourceMappingURL=encounter.module.js.map