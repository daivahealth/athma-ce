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
exports.CreateStaffDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateStaffDto {
    tenantId;
    prefix;
    firstName;
    lastName;
    middleName;
    dateOfBirth;
    gender;
    phoneNumber;
    email;
    employeeId;
    staffCode;
    staffType;
    licenseNumber;
    licenseExpiry;
    qualification;
    languages;
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant UUID',
        example: '223e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name prefix (Dr., Mr., Ms., etc.)',
        example: 'Dr.',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "prefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff first name',
        example: 'Ahmed',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff last name',
        example: 'Hassan',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff middle name',
        example: 'Mohamed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth (ISO 8601 format)',
        example: '1985-03-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gender (male, female, other)',
        example: 'male',
        enum: ['male', 'female', 'other'],
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact phone number',
        example: '+971-50-1234567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'ahmed.hassan@hospital.ae',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique employee identifier',
        example: 'EMP001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff code (unique identifier within tenant)',
        example: 'DOC001',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "staffCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of staff (physician, nurse, technician, administrative)',
        example: 'physician',
        enum: ['physician', 'nurse', 'technician', 'administrative', 'support'],
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "staffType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Professional license number (e.g., DHA license)',
        example: 'DHA-12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'License expiry date (ISO 8601 format)',
        example: '2026-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Educational qualification or degree',
        example: 'MBBS, MD Cardiology',
        maxLength: 150,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "qualification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Languages spoken by the staff member (ISO 639-1 codes)',
        example: ['en', 'ar'],
        type: [String],
        maxItems: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "languages", void 0);
//# sourceMappingURL=create-staff.dto.js.map