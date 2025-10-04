"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatsDto = exports.ChangePasswordDto = exports.UserSearchDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
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
let CreateUserDto = (() => {
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    return class CreateUserDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tenantId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsUUID)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'User email', example: 'john.doe@example.com' }), (0, class_validator_1.IsEmail)()];
            _firstName_decorators = [(0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _lastName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _password_decorators = [(0, swagger_1.ApiProperty)({ description: 'Password', example: 'SecurePassword123!' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8), (0, class_validator_1.MaxLength)(128)];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'User role', example: 'physician' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsEnum)(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])];
            _permissions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        tenantId = __runInitializers(this, _tenantId_initializers, void 0);
        email = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        firstName = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
        lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
        password = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _password_initializers, void 0));
        role = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _role_initializers, void 0));
        permissions = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
        constructor() {
            __runInitializers(this, _permissions_extraInitializers);
        }
    };
})();
exports.CreateUserDto = CreateUserDto;
let UpdateUserDto = (() => {
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    return class UpdateUserDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'First name', example: 'John' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _lastName_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last name', example: 'Doe' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _role_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User role', example: 'physician' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsEnum)(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User status', enum: ['active', 'inactive', 'suspended'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'inactive', 'suspended'])];
            _permissions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        firstName = __runInitializers(this, _firstName_initializers, void 0);
        lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
        role = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _role_initializers, void 0));
        status = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        permissions = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
        constructor() {
            __runInitializers(this, _permissions_extraInitializers);
        }
    };
})();
exports.UpdateUserDto = UpdateUserDto;
let UserSearchDto = (() => {
    let _query_decorators;
    let _query_initializers = [];
    let _query_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return class UserSearchDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query for name or email' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _role_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by role', enum: ['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsEnum)(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'inactive', 'suspended'])];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: obj => "query" in obj, get: obj => obj.query, set: (obj, value) => { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        query = __runInitializers(this, _query_initializers, void 0);
        role = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _role_initializers, void 0));
        status = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        constructor() {
            __runInitializers(this, _status_extraInitializers);
        }
    };
})();
exports.UserSearchDto = UserSearchDto;
let ChangePasswordDto = (() => {
    let _currentPassword_decorators;
    let _currentPassword_initializers = [];
    let _currentPassword_extraInitializers = [];
    let _newPassword_decorators;
    let _newPassword_initializers = [];
    let _newPassword_extraInitializers = [];
    return class ChangePasswordDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currentPassword_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current password' }), (0, class_validator_1.IsString)()];
            _newPassword_decorators = [(0, swagger_1.ApiProperty)({ description: 'New password' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8), (0, class_validator_1.MaxLength)(128)];
            __esDecorate(null, null, _currentPassword_decorators, { kind: "field", name: "currentPassword", static: false, private: false, access: { has: obj => "currentPassword" in obj, get: obj => obj.currentPassword, set: (obj, value) => { obj.currentPassword = value; } }, metadata: _metadata }, _currentPassword_initializers, _currentPassword_extraInitializers);
            __esDecorate(null, null, _newPassword_decorators, { kind: "field", name: "newPassword", static: false, private: false, access: { has: obj => "newPassword" in obj, get: obj => obj.newPassword, set: (obj, value) => { obj.newPassword = value; } }, metadata: _metadata }, _newPassword_initializers, _newPassword_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        currentPassword = __runInitializers(this, _currentPassword_initializers, void 0);
        newPassword = (__runInitializers(this, _currentPassword_extraInitializers), __runInitializers(this, _newPassword_initializers, void 0));
        constructor() {
            __runInitializers(this, _newPassword_extraInitializers);
        }
    };
})();
exports.ChangePasswordDto = ChangePasswordDto;
let UserStatsDto = (() => {
    let _totalUsers_decorators;
    let _totalUsers_initializers = [];
    let _totalUsers_extraInitializers = [];
    let _activeUsers_decorators;
    let _activeUsers_initializers = [];
    let _activeUsers_extraInitializers = [];
    let _inactiveUsers_decorators;
    let _inactiveUsers_initializers = [];
    let _inactiveUsers_extraInitializers = [];
    let _usersByRole_decorators;
    let _usersByRole_initializers = [];
    let _usersByRole_extraInitializers = [];
    let _recentLogins_decorators;
    let _recentLogins_initializers = [];
    let _recentLogins_extraInitializers = [];
    return class UserStatsDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalUsers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of users' })];
            _activeUsers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of active users' })];
            _inactiveUsers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of inactive users' })];
            _usersByRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Users by role' })];
            _recentLogins_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of recent logins (last 7 days)' })];
            __esDecorate(null, null, _totalUsers_decorators, { kind: "field", name: "totalUsers", static: false, private: false, access: { has: obj => "totalUsers" in obj, get: obj => obj.totalUsers, set: (obj, value) => { obj.totalUsers = value; } }, metadata: _metadata }, _totalUsers_initializers, _totalUsers_extraInitializers);
            __esDecorate(null, null, _activeUsers_decorators, { kind: "field", name: "activeUsers", static: false, private: false, access: { has: obj => "activeUsers" in obj, get: obj => obj.activeUsers, set: (obj, value) => { obj.activeUsers = value; } }, metadata: _metadata }, _activeUsers_initializers, _activeUsers_extraInitializers);
            __esDecorate(null, null, _inactiveUsers_decorators, { kind: "field", name: "inactiveUsers", static: false, private: false, access: { has: obj => "inactiveUsers" in obj, get: obj => obj.inactiveUsers, set: (obj, value) => { obj.inactiveUsers = value; } }, metadata: _metadata }, _inactiveUsers_initializers, _inactiveUsers_extraInitializers);
            __esDecorate(null, null, _usersByRole_decorators, { kind: "field", name: "usersByRole", static: false, private: false, access: { has: obj => "usersByRole" in obj, get: obj => obj.usersByRole, set: (obj, value) => { obj.usersByRole = value; } }, metadata: _metadata }, _usersByRole_initializers, _usersByRole_extraInitializers);
            __esDecorate(null, null, _recentLogins_decorators, { kind: "field", name: "recentLogins", static: false, private: false, access: { has: obj => "recentLogins" in obj, get: obj => obj.recentLogins, set: (obj, value) => { obj.recentLogins = value; } }, metadata: _metadata }, _recentLogins_initializers, _recentLogins_extraInitializers);
            if (_metadata)
                Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        totalUsers = __runInitializers(this, _totalUsers_initializers, void 0);
        activeUsers = (__runInitializers(this, _totalUsers_extraInitializers), __runInitializers(this, _activeUsers_initializers, void 0));
        inactiveUsers = (__runInitializers(this, _activeUsers_extraInitializers), __runInitializers(this, _inactiveUsers_initializers, void 0));
        usersByRole = (__runInitializers(this, _inactiveUsers_extraInitializers), __runInitializers(this, _usersByRole_initializers, void 0));
        recentLogins = (__runInitializers(this, _usersByRole_extraInitializers), __runInitializers(this, _recentLogins_initializers, void 0));
        constructor() {
            __runInitializers(this, _recentLogins_extraInitializers);
        }
    };
})();
exports.UserStatsDto = UserStatsDto;
//# sourceMappingURL=user.dto.js.map
//# sourceMappingURL=user.dto.js.map