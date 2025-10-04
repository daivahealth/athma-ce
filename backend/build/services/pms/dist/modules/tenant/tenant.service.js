"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
const tenant_dto_1 = require("./dto/tenant.dto");
const client_1 = require("@prisma/client");
const contracts_1 = require("@zeal/contracts");
let TenantService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TenantService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TenantService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
                throw new common_1.BadRequestException('Invalid domain format');
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
                throw new common_1.ConflictException('Tenant with this name or domain already exists');
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
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
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
                throw new common_1.NotFoundException(`Tenant with domain ${domain} not found`);
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
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
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
                    throw new common_1.ConflictException('Tenant with this name or domain already exists');
                }
            }
            // Validate domain format if provided
            if (domain && !this.isValidDomain(domain)) {
                throw new common_1.BadRequestException('Invalid domain format');
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
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
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
                throw new common_1.BadRequestException('Cannot delete tenant with active users or patient data');
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
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
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
                    createdAt: true
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
    return TenantService = _classThis;
})();
exports.TenantService = TenantService;
//# sourceMappingURL=tenant.service.js.map
//# sourceMappingURL=tenant.service.js.map