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
exports.ClinicalOrderResponseDto = exports.AddOrderResultDto = exports.UpdateClinicalOrderDto = exports.CreateClinicalOrderDto = exports.CodeSystem = exports.ResultStatus = exports.OrderStatus = exports.OrderPriority = exports.OrderType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
// Enum for order type
var OrderType;
(function (OrderType) {
    OrderType["LAB"] = "lab";
    OrderType["IMAGING"] = "imaging";
    OrderType["PROCEDURE"] = "procedure";
})(OrderType || (exports.OrderType = OrderType = {}));
// Enum for order priority
var OrderPriority;
(function (OrderPriority) {
    OrderPriority["STAT"] = "stat";
    OrderPriority["URGENT"] = "urgent";
    OrderPriority["ROUTINE"] = "routine";
})(OrderPriority || (exports.OrderPriority = OrderPriority = {}));
// Enum for order status
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["ORDERED"] = "ordered";
    OrderStatus["IN_PROGRESS"] = "in_progress";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Enum for result status
var ResultStatus;
(function (ResultStatus) {
    ResultStatus["PENDING"] = "pending";
    ResultStatus["PRELIMINARY"] = "preliminary";
    ResultStatus["FINAL"] = "final";
    ResultStatus["AMENDED"] = "amended";
})(ResultStatus || (exports.ResultStatus = ResultStatus = {}));
// Enum for code system
var CodeSystem;
(function (CodeSystem) {
    CodeSystem["LOINC"] = "LOINC";
    CodeSystem["CPT"] = "CPT";
    CodeSystem["SNOMED"] = "SNOMED";
})(CodeSystem || (exports.CodeSystem = CodeSystem = {}));
// DTO for creating a clinical order
class CreateClinicalOrderDto {
    encounterId;
    patientId;
    orderType;
    orderCode;
    codeSystem;
    orderName;
    orderNameAr;
    priority;
    clinicalIndication;
    specialInstructions;
    orderedBy;
}
exports.CreateClinicalOrderDto = CreateClinicalOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order type', enum: OrderType }),
    (0, class_validator_1.IsEnum)(OrderType),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "orderType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order code (LOINC, CPT, SNOMED)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code system', enum: CodeSystem }),
    (0, class_validator_1.IsEnum)(CodeSystem),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "codeSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order name in English' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "orderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order name in Arabic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "orderNameAr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order priority', enum: OrderPriority, default: OrderPriority.ROUTINE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrderPriority),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical indication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "clinicalIndication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who ordered' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateClinicalOrderDto.prototype, "orderedBy", void 0);
// DTO for updating a clinical order
class UpdateClinicalOrderDto {
    priority;
    status;
    clinicalIndication;
    specialInstructions;
}
exports.UpdateClinicalOrderDto = UpdateClinicalOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order priority', enum: OrderPriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrderPriority),
    __metadata("design:type", String)
], UpdateClinicalOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order status', enum: OrderStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrderStatus),
    __metadata("design:type", String)
], UpdateClinicalOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical indication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClinicalOrderDto.prototype, "clinicalIndication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClinicalOrderDto.prototype, "specialInstructions", void 0);
// DTO for adding order results
class AddOrderResultDto {
    resultStatus;
    resultData;
    resultNotes;
    performedBy;
    performedAt;
}
exports.AddOrderResultDto = AddOrderResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Result status', enum: ResultStatus }),
    (0, class_validator_1.IsEnum)(ResultStatus),
    __metadata("design:type", String)
], AddOrderResultDto.prototype, "resultStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Result data as JSON' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AddOrderResultDto.prototype, "resultData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Result notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddOrderResultDto.prototype, "resultNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff ID who performed the procedure' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddOrderResultDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the procedure was performed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddOrderResultDto.prototype, "performedAt", void 0);
// Response DTO
class ClinicalOrderResponseDto {
    id;
    tenantId;
    encounterId;
    patientId;
    orderType;
    orderCode;
    codeSystem;
    orderName;
    orderNameAr;
    priority;
    status;
    clinicalIndication;
    specialInstructions;
    resultStatus;
    resultData;
    resultNotes;
    resultedAt;
    orderedBy;
    orderedAt;
    performedBy;
    performedAt;
    createdAt;
    updatedAt;
}
exports.ClinicalOrderResponseDto = ClinicalOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderType }),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "orderType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CodeSystem }),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "codeSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "orderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "orderNameAr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderPriority }),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderStatus }),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "clinicalIndication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ResultStatus }),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "resultStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ClinicalOrderResponseDto.prototype, "resultData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "resultNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ClinicalOrderResponseDto.prototype, "resultedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "orderedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ClinicalOrderResponseDto.prototype, "orderedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ClinicalOrderResponseDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ClinicalOrderResponseDto.prototype, "performedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ClinicalOrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ClinicalOrderResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=clinical-order.dto.js.map