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
exports.FacilityService = void 0;
const common_1 = require("@nestjs/common");
const facility_repository_1 = require("./facility.repository");
let FacilityService = class FacilityService {
    facilityRepository;
    constructor(facilityRepository) {
        this.facilityRepository = facilityRepository;
    }
    create(dto) {
        return this.facilityRepository.create(dto);
    }
    list(tenantId) {
        return this.facilityRepository.findMany(tenantId);
    }
    async get(id) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new common_1.NotFoundException('Facility not found');
        }
        return facility;
    }
    async update(id, dto) {
        await this.get(id);
        return this.facilityRepository.update(id, dto);
    }
    async archive(id) {
        await this.get(id);
        await this.facilityRepository.delete(id);
    }
};
exports.FacilityService = FacilityService;
exports.FacilityService = FacilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [facility_repository_1.FacilityRepository])
], FacilityService);
//# sourceMappingURL=facility.service.js.map