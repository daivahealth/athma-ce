import { Injectable, NotFoundException } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';

@Injectable()
export class FacilityService {
  constructor(private readonly facilityRepository: FacilityRepository) {}

  async createFacility(createFacilityDto: any): Promise<any> {
    return this.facilityRepository.create(createFacilityDto);
  }

  async getFacilities(query: any): Promise<any> {
    return this.facilityRepository.findMany(query);
  }

  async getFacilityById(id: string): Promise<any> {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }
    return facility;
  }

  async updateFacility(id: string, updateFacilityDto: any): Promise<any> {
    const existingFacility = await this.facilityRepository.findById(id);
    if (!existingFacility) {
      throw new NotFoundException('Facility not found');
    }

    await this.facilityRepository.update(id, updateFacilityDto);
    return this.facilityRepository.findById(id);
  }

  async deleteFacility(id: string): Promise<void> {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    await this.facilityRepository.delete(id);
  }

  async getFacilitySpaces(id: string, query: any): Promise<any> {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return this.facilityRepository.getSpaces(id, query);
  }

  async getFacilityStaff(id: string, query: any): Promise<any> {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return this.facilityRepository.getStaff(id, query);
  }

  async getFacilitySchedule(id: string, query: any): Promise<any> {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return this.facilityRepository.getSchedule(id, query);
  }
}



