import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateAdministrativeServiceDto, UpdateAdministrativeServiceDto, QueryAdministrativeServicesDto } from '../dto/administrative-service.dto';

@Injectable()
export class AdministrativeServiceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new administrative service
   */
  async create(tenantId: string, dto: CreateAdministrativeServiceDto) {
    // Check if service code already exists for this tenant
    if (dto.serviceCode) {
      const existing = await this.prisma.administrativeService.findFirst({
        where: {
          tenantId,
          serviceCode: dto.serviceCode,
        },
      });

      if (existing) {
        throw new BadRequestException(`Service with code ${dto.serviceCode} already exists`);
      }
    }

    const service = await this.prisma.administrativeService.create({
      data: {
        ...dto,
        tenantId,
      },
    });

    return service;
  }

  /**
   * Find all services with optional filtering
   */
  async findAll(tenantId: string, query: QueryAdministrativeServicesDto) {
    const where: any = {
      tenantId,
    };

    if (query.search) {
      where.OR = [
        { serviceName: { contains: query.search, mode: 'insensitive' } },
        { serviceCode: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.serviceCategory) {
      where.serviceCategory = query.serviceCategory;
    }

    if (query.serviceType) {
      where.serviceType = query.serviceType;
    }

    if (query.department) {
      where.department = query.department;
    }

    if (query.careSetting) {
      where.careSetting = query.careSetting;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.requiresStaff !== undefined) {
      where.requiresStaff = query.requiresStaff;
    }

    if (query.requiresRoom !== undefined) {
      where.requiresRoom = query.requiresRoom;
    }

    const services = await this.prisma.administrativeService.findMany({
      where,
      orderBy: {
        serviceName: 'asc',
      },
    });

    return services;
  }

  /**
   * Find service by ID
   */
  async findOne(tenantId: string, id: string) {
    const service = await this.prisma.administrativeService.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  /**
   * Find service by code
   */
  async findByCode(tenantId: string, serviceCode: string) {
    const service = await this.prisma.administrativeService.findFirst({
      where: {
        serviceCode,
        tenantId,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with code ${serviceCode} not found`);
    }

    return service;
  }

  /**
   * Update service
   */
  async update(tenantId: string, id: string, dto: UpdateAdministrativeServiceDto) {
    const service = await this.findOne(tenantId, id);

    // Check if service code is being updated and conflicts with another service
    if (dto.serviceCode && dto.serviceCode !== service.serviceCode) {
      const existing = await this.prisma.administrativeService.findFirst({
        where: {
          tenantId,
          serviceCode: dto.serviceCode,
          id: { not: id },
        },
      });

      if (existing) {
        throw new BadRequestException(`Service with code ${dto.serviceCode} already exists`);
      }
    }

    const updated = await this.prisma.administrativeService.update({
      where: { id },
      data: dto,
    });

    return updated;
  }

  /**
   * Delete service
   */
  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await this.prisma.administrativeService.delete({
      where: { id },
    });

    return { message: 'Service deleted successfully' };
  }

  /**
   * Get service categories
   */
  async getServiceCategories() {
    return [
      { code: 'registration', name: 'Registration' },
      { code: 'consultation', name: 'Consultation' },
      { code: 'admission', name: 'Admission' },
      { code: 'room_charge', name: 'Room Charge' },
      { code: 'administrative', name: 'Administrative' },
      { code: 'nursing', name: 'Nursing' },
      { code: 'therapy', name: 'Therapy' },
      { code: 'emergency', name: 'Emergency' },
      { code: 'facility', name: 'Facility' },
      { code: 'other', name: 'Other' },
    ];
  }

  /**
   * Get service types
   */
  async getServiceTypes() {
    return [
      { code: 'new_patient', name: 'New Patient' },
      { code: 'follow_up', name: 'Follow Up' },
      { code: 'emergency', name: 'Emergency' },
      { code: 'routine', name: 'Routine' },
      { code: 'specialist', name: 'Specialist' },
      { code: 'telephonic', name: 'Telephonic' },
      { code: 'video', name: 'Video Consultation' },
      { code: 'home_visit', name: 'Home Visit' },
    ];
  }
}
