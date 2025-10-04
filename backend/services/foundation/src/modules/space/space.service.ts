import { Injectable, NotFoundException } from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpaceService {
  constructor(private readonly spaceRepository: SpaceRepository) {}

  create(dto: CreateSpaceDto) {
    return this.spaceRepository.create(dto);
  }

  list(facilityId: string) {
    return this.spaceRepository.findMany(facilityId);
  }

  async get(id: string) {
    const space = await this.spaceRepository.findById(id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

  async update(id: string, dto: UpdateSpaceDto) {
    await this.get(id);
    return this.spaceRepository.update(id, dto);
  }

  async archive(id: string) {
    await this.get(id);
    await this.spaceRepository.delete(id);
  }
}
