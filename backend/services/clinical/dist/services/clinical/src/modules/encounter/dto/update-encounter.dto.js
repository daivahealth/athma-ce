"use strict";
/**
 * DTO for updating an encounter
 */
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
exports.UpdateEncounterDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_encounter_dto_1 = require("./create-encounter.dto");
const class_validator_1 = require("class-validator");
class UpdateEncounterDto extends (0, mapped_types_1.PartialType)(create_encounter_dto_1.CreateEncounterDto) {
    dischargeDisposition;
    followUpInstructions;
}
exports.UpdateEncounterDto = UpdateEncounterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEncounterDto.prototype, "dischargeDisposition", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEncounterDto.prototype, "followUpInstructions", void 0);
//# sourceMappingURL=update-encounter.dto.js.map