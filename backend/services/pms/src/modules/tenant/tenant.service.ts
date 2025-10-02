import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto } from './dto/tenant.dto';
import { Tenant, Prisma } from '@prisma/client';
import { PaginationParams } from '@zeal/contracts';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new tenant
   */
  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name, domain, settings } = createTenantDto;

    // Validate domain format
    if (!this.isValidDomain(domain)) {
      throw new BadRequestException('Invalid domain format');
    }

    // Check for existing tenant with same name or domain
    const existingTenant = await this.prisma.tenant.findFirst({
      where: {
        OR: [
          { name },
          { domain }
        ]
      }
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this name or domain already exists');
    }

    return this.prisma.tenant.create({
      data: {
        name,
        domain,
        settings: settings || {},
        status: 'active'
      }
    });
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            facilities: true,
            staff: true,
            appointments: true
          }
        }
      }
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  /**
   * Get tenant by domain
   */
  async getTenantByDomain(domain: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { domain },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            facilities: true,
            staff: true,
            appointments: true
          }
        }
      }
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with domain ${domain} not found`);
    }

    return tenant;
  }

  /**
   * Search tenants with pagination
   */
  async searchTenants(
    searchDto: TenantSearchDto,
    pagination: PaginationParams
  ): Promise<{ tenants: Tenant[]; total: number }> {
    const { query, status } = searchDto;
    const { page = 1, limit = 20 } = pagination;

    const where: Prisma.TenantWhereInput = {
      AND: [
        ...(query
          ? [
              {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { domain: { contains: query, mode: 'insensitive' } }
                ]
              }
            ]
          : []),
        ...(status ? [{ status }] : [])
      ]
    };

    const [tenants, total] = await this.prisma.$transaction([
      this.prisma.tenant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              users: true,
              patients: true,
              facilities: true,
              staff: true,
              appointments: true
            }
          }
        }
      }),
      this.prisma.tenant.count({ where })
    ]);

    return { tenants, total };
  }

  /**
   * Update tenant
   */
  async updateTenant(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const { name, domain, status, settings } = updateTenantDto;

    // Check if tenant exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { id }
    });

    if (!existingTenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    // Check for conflicts if name or domain is being updated
    if (name || domain) {
      const conflictTenant = await this.prisma.tenant.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(name ? [{ name }] : []),
                ...(domain ? [{ domain }] : [])
              ]
            }
          ]
        }
      });

      if (conflictTenant) {
        throw new ConflictException('Tenant with this name or domain already exists');
      }
    }

    // Validate domain format if provided
    if (domain && !this.isValidDomain(domain)) {
      throw new BadRequestException('Invalid domain format');
    }

    return this.prisma.tenant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(status && { status }),
        ...(settings && { settings })
      }
    });
  }

  /**
   * Delete tenant (soft delete by setting status to inactive)
   */
  async deleteTenant(id: string): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id }
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    // Check if tenant has active users or data
    const activeData = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            facilities: true,
            staff: true,
            appointments: true
          }
        }
      }
    });

    if (activeData._count.users > 0 || activeData._count.patients > 0) {
      throw new BadRequestException('Cannot delete tenant with active users or patient data');
    }

    // Soft delete by setting status to inactive
    await this.prisma.tenant.update({
      where: { id },
      data: { status: 'inactive' }
    });
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats(id: string): Promise<{
    totalUsers: number;
    totalPatients: number;
    totalFacilities: number;
    totalStaff: number;
    totalAppointments: number;
    activeAppointments: number;
  }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            facilities: true,
            staff: true,
            appointments: true
          }
        }
      }
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    const activeAppointments = await this.prisma.appointment.count({
      where: {
        tenantId: id,
        status: { in: ['scheduled', 'confirmed'] }
      }
    });

    return {
      totalUsers: tenant._count.users,
      totalPatients: tenant._count.patients,
      totalFacilities: tenant._count.facilities,
      totalStaff: tenant._count.staff,
      totalAppointments: tenant._count.appointments,
      activeAppointments
    };
  }

  /**
   * Validate domain format
   */
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
    return domainRegex.test(domain) && domain.length <= 253;
  }

  /**
   * Get all active tenants
   */
  async getActiveTenants(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        domain: true,
        status: true,
        createdAt: true
      }
    });
  }

  /**
   * Check if tenant exists
   */
  async tenantExists(id: string): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!tenant;
  }
}
