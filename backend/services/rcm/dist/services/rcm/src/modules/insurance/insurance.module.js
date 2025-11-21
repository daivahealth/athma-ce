"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceModule = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
// Services
const payer_service_1 = require("./services/payer.service");
const policy_service_1 = require("./services/policy.service");
// Controllers
const payer_controller_1 = require("./controllers/payer.controller");
const policy_controller_1 = require("./controllers/policy.controller");
let InsuranceModule = class InsuranceModule {
};
exports.InsuranceModule = InsuranceModule;
exports.InsuranceModule = InsuranceModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            payer_controller_1.PayerController,
            policy_controller_1.PolicyController,
        ],
        providers: [
            database_rcm_1.PrismaService,
            payer_service_1.PayerService,
            policy_service_1.PolicyService,
        ],
        exports: [
            payer_service_1.PayerService,
            policy_service_1.PolicyService,
        ],
    })
], InsuranceModule);
//# sourceMappingURL=insurance.module.js.map