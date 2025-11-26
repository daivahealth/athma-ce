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
exports.AllocateReceiptDto = exports.UpdateReceiptDto = exports.CreateReceiptDto = exports.ReceiptAllocationDto = exports.PaymentMethod = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
class ReceiptAllocationDto {
    invoiceId;
    allocatedAmount;
}
exports.ReceiptAllocationDto = ReceiptAllocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiptAllocationDto.prototype, "invoiceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount to allocate to this invoice' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ReceiptAllocationDto.prototype, "allocatedAmount", void 0);
class CreateReceiptDto {
    patientId;
    invoiceId;
    mrn;
    patientDisplayName;
    receiptNumber;
    receiptDate;
    amount;
    currency;
    paymentMethod;
    txnReference;
    notes;
    allocations;
}
exports.CreateReceiptDto = CreateReceiptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Invoice ID (null for advance payment)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "invoiceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient MRN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "mrn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient display name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "patientDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Receipt number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "receiptNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt date', default: 'now()' }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateReceiptDto.prototype, "receiptDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount received' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReceiptDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency', default: 'AED' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentMethod, description: 'Payment method' }),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction reference' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "txnReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt allocations to invoices', type: [ReceiptAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReceiptAllocationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReceiptDto.prototype, "allocations", void 0);
class UpdateReceiptDto extends (0, swagger_1.PartialType)(CreateReceiptDto) {
}
exports.UpdateReceiptDto = UpdateReceiptDto;
class AllocateReceiptDto {
    allocations;
}
exports.AllocateReceiptDto = AllocateReceiptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Allocations to invoices', type: [ReceiptAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReceiptAllocationDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AllocateReceiptDto.prototype, "allocations", void 0);
//# sourceMappingURL=receipt.dto.js.map