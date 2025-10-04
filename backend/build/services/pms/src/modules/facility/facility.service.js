var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';
let FacilityService = class FacilityService {
    facilityRepository;
    constructor(facilityRepository) {
        this.facilityRepository = facilityRepository;
    }
    async createFacility(createFacilityDto) {
        return this.facilityRepository.create(createFacilityDto);
    }
    async getFacilities(query) {
        return this.facilityRepository.findMany(query);
    }
    async getFacilityById(id) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new NotFoundException('Facility not found');
        }
        return facility;
    }
    async updateFacility(id, updateFacilityDto) {
        const existingFacility = await this.facilityRepository.findById(id);
        if (!existingFacility) {
            throw new NotFoundException('Facility not found');
        }
        await this.facilityRepository.update(id, updateFacilityDto);
        return this.facilityRepository.findById(id);
    }
    async deleteFacility(id) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new NotFoundException('Facility not found');
        }
        await this.facilityRepository.delete(id);
    }
    async getFacilitySpaces(id, query) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new NotFoundException('Facility not found');
        }
        return this.facilityRepository.getSpaces(id, query);
    }
    async getFacilityStaff(id, query) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new NotFoundException('Facility not found');
        }
        return this.facilityRepository.getStaff(id, query);
    }
    async getFacilitySchedule(id, query) {
        const facility = await this.facilityRepository.findById(id);
        if (!facility) {
            throw new NotFoundException('Facility not found');
        }
        return this.facilityRepository.getSchedule(id, query);
    }
};
FacilityService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [FacilityRepository])
], FacilityService);
export { FacilityService };
//# sourceMappingURL=facility.service.js.map