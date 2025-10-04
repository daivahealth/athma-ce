import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async createTenant(dto: CreateTenantDto) {
    const collision = await this.tenantRepository.findByNameOrDomain(dto.name, dto.domain);
    if (collision) {
      throw new ConflictException('Tenant with this name or domain already exists');
    }
    return this.tenantRepository.create(dto);
  }

  getTenants() {
    return this.tenantRepository.findMany();
  }

  async getTenant(id: string) {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async updateTenant(id: string, dto: UpdateTenantDto) {
    const current = await this.getTenant(id);
    if (dto.name || dto.domain) {
      const targetName = dto.name ?? current.name;
      const targetDomain = dto.domain ?? current.domain;
      const collision = await this.tenantRepository.findByNameOrDomain(targetName, targetDomain);
      if (collision && collision.id !== id) {
        throw new ConflictException('Tenant with this name or domain already exists');
      }
    }
    return this.tenantRepository.update(id, dto);
  }

  async deleteTenant(id: string) {
    await this.getTenant(id);
    await this.tenantRepository.delete(id);
  }
}
