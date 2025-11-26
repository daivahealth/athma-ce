"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
// Services
const billing_item_service_1 = require("./services/billing-item.service");
const charge_service_1 = require("./services/charge.service");
const invoice_service_1 = require("./services/invoice.service");
const receipt_service_1 = require("./services/receipt.service");
const charge_posting_service_1 = require("./services/charge-posting.service");
const fee_schedule_service_1 = require("./services/fee-schedule.service");
// Controllers
const billing_item_controller_1 = require("./controllers/billing-item.controller");
const charge_controller_1 = require("./controllers/charge.controller");
const invoice_controller_1 = require("./controllers/invoice.controller");
const receipt_controller_1 = require("./controllers/receipt.controller");
const charge_posting_rule_controller_1 = require("./controllers/charge-posting-rule.controller");
const fee_schedule_controller_1 = require("./controllers/fee-schedule.controller");
// Medical Coding Integration
const medical_coding_module_1 = require("../medical-coding/medical-coding.module");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [medical_coding_module_1.MedicalCodingModule],
        controllers: [
            billing_item_controller_1.BillingItemController,
            charge_controller_1.ChargeController,
            invoice_controller_1.InvoiceController,
            receipt_controller_1.ReceiptController,
            charge_posting_rule_controller_1.ChargePostingRuleController,
            fee_schedule_controller_1.FeeScheduleController,
        ],
        providers: [
            database_rcm_1.PrismaService,
            billing_item_service_1.BillingItemService,
            charge_service_1.ChargeService,
            invoice_service_1.InvoiceService,
            receipt_service_1.ReceiptService,
            charge_posting_service_1.ChargePostingService,
            fee_schedule_service_1.FeeScheduleService,
        ],
        exports: [
            billing_item_service_1.BillingItemService,
            charge_service_1.ChargeService,
            invoice_service_1.InvoiceService,
            receipt_service_1.ReceiptService,
            charge_posting_service_1.ChargePostingService,
            fee_schedule_service_1.FeeScheduleService,
        ],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map