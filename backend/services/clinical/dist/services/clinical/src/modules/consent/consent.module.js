"use strict";
/**
 * Consent Module
 *
 * Manages GDPR-compliant patient consent
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentModule = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
// Controllers
const consent_controller_1 = require("./consent.controller");
const consent_template_controller_1 = require("./consent-template.controller");
// Services
const consent_service_1 = require("./consent.service");
const consent_template_service_1 = require("./consent-template.service");
let ConsentModule = class ConsentModule {
};
exports.ConsentModule = ConsentModule;
exports.ConsentModule = ConsentModule = __decorate([
    (0, common_1.Module)({
        imports: [database_clinical_1.ClinicalDatabaseModule],
        controllers: [
            consent_controller_1.ConsentController,
            consent_template_controller_1.ConsentTemplateController,
        ],
        providers: [
            consent_service_1.ConsentService,
            consent_template_service_1.ConsentTemplateService,
        ],
        exports: [
            consent_service_1.ConsentService,
            consent_template_service_1.ConsentTemplateService,
        ],
    })
], ConsentModule);
//# sourceMappingURL=consent.module.js.map