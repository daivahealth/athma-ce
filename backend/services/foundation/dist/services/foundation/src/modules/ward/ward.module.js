"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardModule = void 0;
const common_1 = require("@nestjs/common");
const ward_service_1 = require("./ward.service");
const ward_controller_1 = require("./ward.controller");
const ward_repository_1 = require("./ward.repository");
const database_foundation_1 = require("@zeal/database-foundation");
let WardModule = class WardModule {
};
exports.WardModule = WardModule;
exports.WardModule = WardModule = __decorate([
    (0, common_1.Module)({
        imports: [database_foundation_1.FoundationDatabaseModule],
        controllers: [ward_controller_1.WardController, ward_controller_1.WardStandaloneController],
        providers: [ward_service_1.WardService, ward_repository_1.WardRepository],
        exports: [ward_service_1.WardService, ward_repository_1.WardRepository],
    })
], WardModule);
//# sourceMappingURL=ward.module.js.map