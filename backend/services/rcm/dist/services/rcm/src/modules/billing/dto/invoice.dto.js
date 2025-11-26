"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordPaymentDto = exports.UpdateInvoiceStatusDto = exports.UpdateInvoiceDto = exports.CreateInvoiceDto = exports.InvoiceLineDto = exports.InvoiceStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["UNPAID"] = "unpaid";
    InvoiceStatus["PARTIAL"] = "partial";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
class InvoiceLineDto {
    chargeId;
    lineNumber;
    description;
    quantity;
    unitPrice;
    lineAmount;
    lineDiscount;
}
exports.InvoiceLineDto = InvoiceLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Charge ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceLineDto.prototype, "chargeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Line number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "lineNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Line description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceLineDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Line amount (quantity * unit_price - line_discount)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "lineAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Line discount', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "lineDiscount", void 0);
class CreateInvoiceDto {
    patientId;
    encounterId;
    mrn;
    patientDisplayName;
    invoiceNumber;
    invoiceDate;
    dueDate;
    grossAmount;
    totalDiscounts;
    netAmount;
    amountPaid;
    balanceDue;
    status;
    currency;
    invoiceLines;
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID (from Clinical DB)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Encounter ID (from Clinical DB)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient MRN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "mrn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient display name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "patientDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Invoice date', default: 'CURRENT_DATE' }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Due date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross amount (sum of charges)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "grossAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total discounts', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "totalDiscounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Net amount (gross - discounts)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "netAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Amount paid', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "amountPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Balance due (net_amount - amount_paid)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "balanceDue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: InvoiceStatus, description: 'Invoice status', default: 'unpaid' }),
    (0, class_validator_1.IsEnum)(InvoiceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency', default: 'AED' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice lines', type: [InvoiceLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceLineDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "invoiceLines", void 0);
class UpdateInvoiceDto extends (0, swagger_1.PartialType)(CreateInvoiceDto) {
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
class UpdateInvoiceStatusDto {
    status;
}
exports.UpdateInvoiceStatusDto = UpdateInvoiceStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: InvoiceStatus, description: 'New invoice status' }),
    (0, class_validator_1.IsEnum)(InvoiceStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateInvoiceStatusDto.prototype, "status", void 0);
class RecordPaymentDto {
    amount;
    reference;
}
exports.RecordPaymentDto = RecordPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RecordPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment reference' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "reference", void 0);
//# sourceMappingURL=invoice.dto.js.map