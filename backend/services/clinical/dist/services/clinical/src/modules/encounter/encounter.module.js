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
let EncounterModule = class EncounterModule {
};
exports.EncounterModule = EncounterModule;
exports.EncounterModule = EncounterModule = __decorate([
    (0, common_1.Module)({
        imports: [database_clinical_1.ClinicalDatabaseModule],
        controllers: [encounter_controller_1.EncounterController],
        providers: [encounter_service_1.EncounterService],
        exports: [encounter_service_1.EncounterService],
    })
], EncounterModule);
//# sourceMappingURL=encounter.module.js.map