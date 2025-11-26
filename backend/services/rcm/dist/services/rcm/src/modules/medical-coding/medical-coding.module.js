"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCodingModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const database_rcm_1 = require("@zeal/database-rcm");
const medical_coding_service_1 = require("./services/medical-coding.service");
const medical_coding_controller_1 = require("./controllers/medical-coding.controller");
let MedicalCodingModule = class MedicalCodingModule {
};
exports.MedicalCodingModule = MedicalCodingModule;
exports.MedicalCodingModule = MedicalCodingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
        ],
        controllers: [medical_coding_controller_1.MedicalCodingController],
        providers: [database_rcm_1.PrismaService, medical_coding_service_1.MedicalCodingService],
        exports: [medical_coding_service_1.MedicalCodingService],
    })
], MedicalCodingModule);
//# sourceMappingURL=medical-coding.module.js.map