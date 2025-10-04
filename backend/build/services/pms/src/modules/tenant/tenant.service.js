var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
let TenantService = class TenantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new tenant
     */
    async createTenant(createTenantDto) {
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
    async getTenantById(id) {
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
    async getTenantByDomain(domain) {
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
    async searchTenants(searchDto, pagination) {
        const { query, status } = searchDto;
        const { page = 1, limit = 20 } = pagination;
        const where = {
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
    async updateTenant(id, updateTenantDto) {
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
    async deleteTenant(id) {
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
        if (activeData && (activeData._count.users > 0 || activeData._count.patients > 0)) {
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
    async getTenantStats(id) {
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
    isValidDomain(domain) {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
        return domainRegex.test(domain) && domain.length <= 253;
    }
    /**
     * Get all active tenants
     */
    async getActiveTenants() {
        return this.prisma.tenant.findMany({
            where: { status: 'active' },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                domain: true,
                status: true,
                settings: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    /**
     * Check if tenant exists
     */
    async tenantExists(id) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!tenant;
    }
};
TenantService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TenantService);
export { TenantService };
//# sourceMappingURL=tenant.service.js.map