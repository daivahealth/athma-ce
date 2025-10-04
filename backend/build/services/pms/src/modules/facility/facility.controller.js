var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Body, Param, Query, } from '@nestjs/common';
import { FacilityService } from './facility.service';
let FacilityController = class FacilityController {
    facilityService;
    constructor(facilityService) {
        this.facilityService = facilityService;
    }
    async createFacility(createFacilityDto) {
        return this.facilityService.createFacility(createFacilityDto);
    }
    async getFacilities(query) {
        return this.facilityService.getFacilities(query);
    }
    async getFacility(id) {
        return this.facilityService.getFacilityById(id);
    }
    async updateFacility(id, updateFacilityDto) {
        return this.facilityService.updateFacility(id, updateFacilityDto);
    }
    async deleteFacility(id) {
        return this.facilityService.deleteFacility(id);
    }
    async getFacilitySpaces(id, query) {
        return this.facilityService.getFacilitySpaces(id, query);
    }
    async getFacilityStaff(id, query) {
        return this.facilityService.getFacilityStaff(id, query);
    }
    async getFacilitySchedule(id, query) {
        return this.facilityService.getFacilitySchedule(id, query);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "createFacility", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacilities", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacility", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "updateFacility", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "deleteFacility", null);
__decorate([
    Get(':id/spaces'),
    __param(0, Param('id')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacilitySpaces", null);
__decorate([
    Get(':id/staff'),
    __param(0, Param('id')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacilityStaff", null);
__decorate([
    Get(':id/schedule'),
    __param(0, Param('id')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacilitySchedule", null);
FacilityController = __decorate([
    Controller('facilities'),
    __metadata("design:paramtypes", [FacilityService])
], FacilityController);
export { FacilityController };
//# sourceMappingURL=facility.controller.js.map