"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueSetModule = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
const valueset_controller_1 = require("./valueset.controller");
const valueset_service_1 = require("./valueset.service");
let ValueSetModule = class ValueSetModule {
};
exports.ValueSetModule = ValueSetModule;
exports.ValueSetModule = ValueSetModule = __decorate([
    (0, common_1.Module)({
        imports: [database_foundation_1.FoundationDatabaseModule],
        controllers: [valueset_controller_1.ValueSetController],
        providers: [valueset_service_1.ValueSetService],
        exports: [valueset_service_1.ValueSetService],
    })
], ValueSetModule);
//# sourceMappingURL=valueset.module.js.map