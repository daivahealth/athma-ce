"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedModule = void 0;
const common_1 = require("@nestjs/common");
const bed_service_1 = require("./bed.service");
const bed_controller_1 = require("./bed.controller");
const bed_repository_1 = require("./bed.repository");
const ward_module_1 = require("../ward/ward.module");
const database_foundation_1 = require("@zeal/database-foundation");
const database_clinical_1 = require("@zeal/database-clinical");
let BedModule = class BedModule {
};
exports.BedModule = BedModule;
exports.BedModule = BedModule = __decorate([
    (0, common_1.Module)({
        imports: [database_foundation_1.FoundationDatabaseModule, database_clinical_1.ClinicalDatabaseModule, ward_module_1.WardModule],
        controllers: [bed_controller_1.BedController, bed_controller_1.BedStandaloneController],
        providers: [bed_service_1.BedService, bed_repository_1.BedRepository],
        exports: [bed_service_1.BedService, bed_repository_1.BedRepository],
    })
], BedModule);
//# sourceMappingURL=bed.module.js.map