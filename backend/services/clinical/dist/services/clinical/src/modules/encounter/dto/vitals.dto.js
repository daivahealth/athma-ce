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
exports.VitalsResponseDto = exports.UpdateVitalsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
/**
 * DTO for updating vital signs
 */
class UpdateVitalsDto {
    // Temperature
    temperature;
    temperatureUnit;
    // Blood Pressure
    systolicBP;
    diastolicBP;
    // Heart Rate
    heartRate;
    // Respiratory Rate
    respiratoryRate;
    // Oxygen Saturation
    oxygenSaturation;
    // Weight
    weight;
    weightUnit;
    // Height
    height;
    heightUnit;
    // BMI (can be calculated or manually entered)
    bmi;
    // Pain Scale
    painScale;
    // Blood Glucose
    bloodGlucose;
    bloodGlucoseUnit;
    // Head Circumference (for pediatric)
    headCircumference;
    // Notes
    notes;
    // Recording metadata
    recordedAt;
    recordedBy;
}
exports.UpdateVitalsDto = UpdateVitalsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Body temperature in Celsius', example: 37.2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(45),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Temperature unit', example: 'celsius', enum: ['celsius', 'fahrenheit'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "temperatureUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Systolic blood pressure (mmHg)', example: 120 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "systolicBP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diastolic blood pressure (mmHg)', example: 80 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(150),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "diastolicBP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Heart rate (beats per minute)', example: 72 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Respiratory rate (breaths per minute)', example: 16 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Oxygen saturation (%)', example: 98 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Weight in kilograms', example: 70.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Weight unit', example: 'kg', enum: ['kg', 'lbs'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "weightUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Height in centimeters', example: 175 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Height unit', example: 'cm', enum: ['cm', 'in'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "heightUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Body Mass Index', example: 23.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "bmi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pain scale (0-10)', example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "painScale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Blood glucose level (mg/dL)', example: 95 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(600),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "bloodGlucose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Blood glucose unit', example: 'mg/dL', enum: ['mg/dL', 'mmol/L'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "bloodGlucoseUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Head circumference in cm (pediatric)', example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(70),
    __metadata("design:type", Number)
], UpdateVitalsDto.prototype, "headCircumference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional vitals notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date and time vitals were recorded' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "recordedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff ID who recorded vitals' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVitalsDto.prototype, "recordedBy", void 0);
/**
 * Response DTO for vitals
 */
class VitalsResponseDto {
    temperature;
    temperatureUnit;
    systolicBP;
    diastolicBP;
    heartRate;
    respiratoryRate;
    oxygenSaturation;
    weight;
    weightUnit;
    height;
    heightUnit;
    bmi;
    painScale;
    bloodGlucose;
    bloodGlucoseUnit;
    headCircumference;
    notes;
    recordedAt;
    recordedBy;
}
exports.VitalsResponseDto = VitalsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "temperatureUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "systolicBP", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "diastolicBP", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "weightUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "heightUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "bmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "painScale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "bloodGlucose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "bloodGlucoseUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VitalsResponseDto.prototype, "headCircumference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], VitalsResponseDto.prototype, "recordedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VitalsResponseDto.prototype, "recordedBy", void 0);
//# sourceMappingURL=vitals.dto.js.map