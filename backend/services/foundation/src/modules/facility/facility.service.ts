import { Injectable, NotFoundException } from '@nestjs/common';
import { FacilityRepository } from './facility.repository';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilityService {
  constructor(private readonly facilityRepository: FacilityRepository) {}

  create(dto: CreateFacilityDto) {
    return this.facilityRepository.create(dto);
  }

  list(tenantId: string) {
    return this.facilityRepository.findMany(tenantId);
  }

  async get(id: string) {
    const facility = await this.facilityRepository.findById(id);
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }
    return facility;
  }

  async update(id: string, dto: UpdateFacilityDto) {
    await this.get(id);
    return this.facilityRepository.update(id, dto);
  }

  async archive(id: string) {
    await this.get(id);
    await this.facilityRepository.delete(id);
  }
}
