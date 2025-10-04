"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantStatsDto = exports.TenantSearchDto = exports.UpdateTenantDto = exports.CreateTenantDto = void 0;
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
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
let CreateTenantDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _domain_decorators;
    let _domain_initializers = [];
    let _domain_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    return class CreateTenantDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenant name', example: 'Al Rashid Medical Center' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(255)];
            _domain_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenant domain', example: 'alrashid.zeal.com' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(253), (0, class_validator_1.Matches)(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
                    message: 'Invalid domain format'
                })];
            _settings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: obj => "domain" in obj, get: obj => obj.domain, set: (obj, value) => { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        domain = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _domain_initializers, void 0));
        settings = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
        constructor() {
            __runInitializers(this, _settings_extraInitializers);
        }
    };
})();
exports.CreateTenantDto = CreateTenantDto;
let UpdateTenantDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _domain_decorators;
    let _domain_initializers = [];
    let _domain_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    return class UpdateTenantDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tenant name', example: 'Al Rashid Medical Center' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(255)];
            _domain_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tenant domain', example: 'alrashid.zeal.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(253), (0, class_validator_1.Matches)(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
                    message: 'Invalid domain format'
                })];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tenant status', enum: ['active', 'inactive', 'suspended'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'inactive', 'suspended'])];
            _settings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: obj => "domain" in obj, get: obj => obj.domain, set: (obj, value) => { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        domain = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _domain_initializers, void 0));
        status = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        settings = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
        constructor() {
            __runInitializers(this, _settings_extraInitializers);
        }
    };
})();
exports.UpdateTenantDto = UpdateTenantDto;
let TenantSearchDto = (() => {
    let _query_decorators;
    let _query_initializers = [];
    let _query_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return class TenantSearchDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query for name or domain' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'inactive', 'suspended'])];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: obj => "query" in obj, get: obj => obj.query, set: (obj, value) => { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        query = __runInitializers(this, _query_initializers, void 0);
        status = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        constructor() {
            __runInitializers(this, _status_extraInitializers);
        }
    };
})();
exports.TenantSearchDto = TenantSearchDto;
let TenantStatsDto = (() => {
    let _totalUsers_decorators;
    let _totalUsers_initializers = [];
    let _totalUsers_extraInitializers = [];
    let _totalPatients_decorators;
    let _totalPatients_initializers = [];
    let _totalPatients_extraInitializers = [];
    let _totalFacilities_decorators;
    let _totalFacilities_initializers = [];
    let _totalFacilities_extraInitializers = [];
    let _totalStaff_decorators;
    let _totalStaff_initializers = [];
    let _totalStaff_extraInitializers = [];
    let _totalAppointments_decorators;
    let _totalAppointments_initializers = [];
    let _totalAppointments_extraInitializers = [];
    let _activeAppointments_decorators;
    let _activeAppointments_initializers = [];
    let _activeAppointments_extraInitializers = [];
    return class TenantStatsDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalUsers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of users' })];
            _totalPatients_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of patients' })];
            _totalFacilities_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of facilities' })];
            _totalStaff_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of staff' })];
            _totalAppointments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of appointments' })];
            _activeAppointments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of active appointments' })];
            __esDecorate(null, null, _totalUsers_decorators, { kind: "field", name: "totalUsers", static: false, private: false, access: { has: obj => "totalUsers" in obj, get: obj => obj.totalUsers, set: (obj, value) => { obj.totalUsers = value; } }, metadata: _metadata }, _totalUsers_initializers, _totalUsers_extraInitializers);
            __esDecorate(null, null, _totalPatients_decorators, { kind: "field", name: "totalPatients", static: false, private: false, access: { has: obj => "totalPatients" in obj, get: obj => obj.totalPatients, set: (obj, value) => { obj.totalPatients = value; } }, metadata: _metadata }, _totalPatients_initializers, _totalPatients_extraInitializers);
            __esDecorate(null, null, _totalFacilities_decorators, { kind: "field", name: "totalFacilities", static: false, private: false, access: { has: obj => "totalFacilities" in obj, get: obj => obj.totalFacilities, set: (obj, value) => { obj.totalFacilities = value; } }, metadata: _metadata }, _totalFacilities_initializers, _totalFacilities_extraInitializers);
            __esDecorate(null, null, _totalStaff_decorators, { kind: "field", name: "totalStaff", static: false, private: false, access: { has: obj => "totalStaff" in obj, get: obj => obj.totalStaff, set: (obj, value) => { obj.totalStaff = value; } }, metadata: _metadata }, _totalStaff_initializers, _totalStaff_extraInitializers);
            __esDecorate(null, null, _totalAppointments_decorators, { kind: "field", name: "totalAppointments", static: false, private: false, access: { has: obj => "totalAppointments" in obj, get: obj => obj.totalAppointments, set: (obj, value) => { obj.totalAppointments = value; } }, metadata: _metadata }, _totalAppointments_initializers, _totalAppointments_extraInitializers);
            __esDecorate(null, null, _activeAppointments_decorators, { kind: "field", name: "activeAppointments", static: false, private: false, access: { has: obj => "activeAppointments" in obj, get: obj => obj.activeAppointments, set: (obj, value) => { obj.activeAppointments = value; } }, metadata: _metadata }, _activeAppointments_initializers, _activeAppointments_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        totalUsers = __runInitializers(this, _totalUsers_initializers, void 0);
        totalPatients = (__runInitializers(this, _totalUsers_extraInitializers), __runInitializers(this, _totalPatients_initializers, void 0));
        totalFacilities = (__runInitializers(this, _totalPatients_extraInitializers), __runInitializers(this, _totalFacilities_initializers, void 0));
        totalStaff = (__runInitializers(this, _totalFacilities_extraInitializers), __runInitializers(this, _totalStaff_initializers, void 0));
        totalAppointments = (__runInitializers(this, _totalStaff_extraInitializers), __runInitializers(this, _totalAppointments_initializers, void 0));
        activeAppointments = (__runInitializers(this, _totalAppointments_extraInitializers), __runInitializers(this, _activeAppointments_initializers, void 0));
        constructor() {
            __runInitializers(this, _activeAppointments_extraInitializers);
        }
    };
})();
exports.TenantStatsDto = TenantStatsDto;
//# sourceMappingURL=tenant.dto.js.map
//# sourceMappingURL=tenant.dto.js.map