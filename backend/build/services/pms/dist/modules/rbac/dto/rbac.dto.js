"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacStatsDto = exports.AssignRoleDto = exports.CreatePermissionDto = exports.UpdateRoleDto = exports.CreateRoleDto = void 0;
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
let CreateRoleDto = (() => {
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isSystem_decorators;
    let _isSystem_initializers = [];
    let _isSystem_extraInitializers = [];
    return class CreateRoleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tenantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsUUID)()];
            _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role code', example: 'physician' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(50)];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role name', example: 'Physician' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Role description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _isSystem_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is system role', default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isSystem_decorators, { kind: "field", name: "isSystem", static: false, private: false, access: { has: obj => "isSystem" in obj, get: obj => obj.isSystem, set: (obj, value) => { obj.isSystem = value; } }, metadata: _metadata }, _isSystem_initializers, _isSystem_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        tenantId = __runInitializers(this, _tenantId_initializers, void 0);
        code = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _code_initializers, void 0));
        name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        isSystem = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isSystem_initializers, void 0));
        constructor() {
            __runInitializers(this, _isSystem_extraInitializers);
        }
    };
})();
exports.CreateRoleDto = CreateRoleDto;
let UpdateRoleDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return class UpdateRoleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Role name', example: 'Physician' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Role description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        constructor() {
            __runInitializers(this, _description_extraInitializers);
        }
    };
})();
exports.UpdateRoleDto = UpdateRoleDto;
let CreatePermissionDto = (() => {
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _resource_decorators;
    let _resource_initializers = [];
    let _resource_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    return class CreatePermissionDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Permission code', example: 'patients.read' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(100)];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Permission name', example: 'Read Patients' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(150)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Permission description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _resource_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Resource', example: 'patients' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _action_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Action', example: 'read' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _resource_decorators, { kind: "field", name: "resource", static: false, private: false, access: { has: obj => "resource" in obj, get: obj => obj.resource, set: (obj, value) => { obj.resource = value; } }, metadata: _metadata }, _resource_initializers, _resource_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        code = __runInitializers(this, _code_initializers, void 0);
        name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        resource = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _resource_initializers, void 0));
        action = (__runInitializers(this, _resource_extraInitializers), __runInitializers(this, _action_initializers, void 0));
        constructor() {
            __runInitializers(this, _action_extraInitializers);
        }
    };
})();
exports.CreatePermissionDto = CreatePermissionDto;
let AssignRoleDto = (() => {
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _roleId_decorators;
    let _roleId_initializers = [];
    let _roleId_extraInitializers = [];
    let _assignedBy_decorators;
    let _assignedBy_initializers = [];
    let _assignedBy_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    return class AssignRoleDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsUUID)()];
            _roleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsUUID)()];
            _assignedBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assigned by user ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _expiresAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: obj => "roleId" in obj, get: obj => obj.roleId, set: (obj, value) => { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _roleId_extraInitializers);
            __esDecorate(null, null, _assignedBy_decorators, { kind: "field", name: "assignedBy", static: false, private: false, access: { has: obj => "assignedBy" in obj, get: obj => obj.assignedBy, set: (obj, value) => { obj.assignedBy = value; } }, metadata: _metadata }, _assignedBy_initializers, _assignedBy_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        userId = __runInitializers(this, _userId_initializers, void 0);
        roleId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _roleId_initializers, void 0));
        assignedBy = (__runInitializers(this, _roleId_extraInitializers), __runInitializers(this, _assignedBy_initializers, void 0));
        expiresAt = (__runInitializers(this, _assignedBy_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _expiresAt_extraInitializers);
        }
    };
})();
exports.AssignRoleDto = AssignRoleDto;
let RbacStatsDto = (() => {
    let _totalRoles_decorators;
    let _totalRoles_initializers = [];
    let _totalRoles_extraInitializers = [];
    let _systemRoles_decorators;
    let _systemRoles_initializers = [];
    let _systemRoles_extraInitializers = [];
    let _customRoles_decorators;
    let _customRoles_initializers = [];
    let _customRoles_extraInitializers = [];
    let _totalPermissions_decorators;
    let _totalPermissions_initializers = [];
    let _totalPermissions_extraInitializers = [];
    let _totalRoleAssignments_decorators;
    let _totalRoleAssignments_initializers = [];
    let _totalRoleAssignments_extraInitializers = [];
    let _activeRoleAssignments_decorators;
    let _activeRoleAssignments_initializers = [];
    let _activeRoleAssignments_extraInitializers = [];
    return class RbacStatsDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of roles' })];
            _systemRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of system roles' })];
            _customRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of custom roles' })];
            _totalPermissions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of permissions' })];
            _totalRoleAssignments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of role assignments' })];
            _activeRoleAssignments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of active role assignments' })];
            __esDecorate(null, null, _totalRoles_decorators, { kind: "field", name: "totalRoles", static: false, private: false, access: { has: obj => "totalRoles" in obj, get: obj => obj.totalRoles, set: (obj, value) => { obj.totalRoles = value; } }, metadata: _metadata }, _totalRoles_initializers, _totalRoles_extraInitializers);
            __esDecorate(null, null, _systemRoles_decorators, { kind: "field", name: "systemRoles", static: false, private: false, access: { has: obj => "systemRoles" in obj, get: obj => obj.systemRoles, set: (obj, value) => { obj.systemRoles = value; } }, metadata: _metadata }, _systemRoles_initializers, _systemRoles_extraInitializers);
            __esDecorate(null, null, _customRoles_decorators, { kind: "field", name: "customRoles", static: false, private: false, access: { has: obj => "customRoles" in obj, get: obj => obj.customRoles, set: (obj, value) => { obj.customRoles = value; } }, metadata: _metadata }, _customRoles_initializers, _customRoles_extraInitializers);
            __esDecorate(null, null, _totalPermissions_decorators, { kind: "field", name: "totalPermissions", static: false, private: false, access: { has: obj => "totalPermissions" in obj, get: obj => obj.totalPermissions, set: (obj, value) => { obj.totalPermissions = value; } }, metadata: _metadata }, _totalPermissions_initializers, _totalPermissions_extraInitializers);
            __esDecorate(null, null, _totalRoleAssignments_decorators, { kind: "field", name: "totalRoleAssignments", static: false, private: false, access: { has: obj => "totalRoleAssignments" in obj, get: obj => obj.totalRoleAssignments, set: (obj, value) => { obj.totalRoleAssignments = value; } }, metadata: _metadata }, _totalRoleAssignments_initializers, _totalRoleAssignments_extraInitializers);
            __esDecorate(null, null, _activeRoleAssignments_decorators, { kind: "field", name: "activeRoleAssignments", static: false, private: false, access: { has: obj => "activeRoleAssignments" in obj, get: obj => obj.activeRoleAssignments, set: (obj, value) => { obj.activeRoleAssignments = value; } }, metadata: _metadata }, _activeRoleAssignments_initializers, _activeRoleAssignments_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        totalRoles = __runInitializers(this, _totalRoles_initializers, void 0);
        systemRoles = (__runInitializers(this, _totalRoles_extraInitializers), __runInitializers(this, _systemRoles_initializers, void 0));
        customRoles = (__runInitializers(this, _systemRoles_extraInitializers), __runInitializers(this, _customRoles_initializers, void 0));
        totalPermissions = (__runInitializers(this, _customRoles_extraInitializers), __runInitializers(this, _totalPermissions_initializers, void 0));
        totalRoleAssignments = (__runInitializers(this, _totalPermissions_extraInitializers), __runInitializers(this, _totalRoleAssignments_initializers, void 0));
        activeRoleAssignments = (__runInitializers(this, _totalRoleAssignments_extraInitializers), __runInitializers(this, _activeRoleAssignments_initializers, void 0));
        constructor() {
            __runInitializers(this, _activeRoleAssignments_extraInitializers);
        }
    };
})();
exports.RbacStatsDto = RbacStatsDto;
//# sourceMappingURL=rbac.dto.js.map
//# sourceMappingURL=rbac.dto.js.map