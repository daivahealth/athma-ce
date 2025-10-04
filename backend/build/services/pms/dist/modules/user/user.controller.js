"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./dto/user.dto");
const contracts_1 = require("@zeal/contracts");
const client_1 = require("@prisma/client");
let UserController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Users'), (0, common_1.Controller)('users')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _getUsersByRole_decorators;
    let _getUserStats_decorators;
    let _findOne_decorators;
    let _findByEmail_decorators;
    let _update_decorators;
    let _changePassword_decorators;
    let _remove_decorators;
    let _checkExists_decorators;
    let _checkEmailExists_decorators;
    var UserController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'User with this email already exists in tenant' })];
            _findAll_decorators = [(0, common_1.Get)('tenant/:tenantId'), (0, swagger_1.ApiOperation)({ summary: 'Get all users for a tenant with pagination and search' }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'Tenant ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' })];
            _getUsersByRole_decorators = [(0, common_1.Get)('tenant/:tenantId/role/:role'), (0, swagger_1.ApiOperation)({ summary: 'Get users by role for a tenant' }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'Tenant ID' }), (0, swagger_1.ApiParam)({ name: 'role', description: 'User role' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' })];
            _getUserStats_decorators = [(0, common_1.Get)('tenant/:tenantId/stats'), (0, swagger_1.ApiOperation)({ summary: 'Get user statistics for a tenant' }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'Tenant ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User statistics retrieved successfully' })];
            _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })];
            _findByEmail_decorators = [(0, common_1.Get)('email/:tenantId/:email'), (0, swagger_1.ApiOperation)({ summary: 'Get user by email and tenant' }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'Tenant ID' }), (0, swagger_1.ApiParam)({ name: 'email', description: 'User email' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })];
            _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update user' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })];
            _changePassword_decorators = [(0, common_1.Put)(':id/password'), (0, swagger_1.ApiOperation)({ summary: 'Change user password' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Current password is incorrect' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })];
            _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete user (soft delete)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })];
            _checkExists_decorators = [(0, common_1.Get)(':id/exists'), (0, swagger_1.ApiOperation)({ summary: 'Check if user exists' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User existence checked' })];
            _checkEmailExists_decorators = [(0, common_1.Get)('email/:tenantId/:email/exists'), (0, swagger_1.ApiOperation)({ summary: 'Check if email exists in tenant' }), (0, swagger_1.ApiParam)({ name: 'tenantId', description: 'Tenant ID' }), (0, swagger_1.ApiParam)({ name: 'email', description: 'User email' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email existence checked' })];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getUsersByRole_decorators, { kind: "method", name: "getUsersByRole", static: false, private: false, access: { has: obj => "getUsersByRole" in obj, get: obj => obj.getUsersByRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getUserStats_decorators, { kind: "method", name: "getUserStats", static: false, private: false, access: { has: obj => "getUserStats" in obj, get: obj => obj.getUserStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findByEmail_decorators, { kind: "method", name: "findByEmail", static: false, private: false, access: { has: obj => "findByEmail" in obj, get: obj => obj.findByEmail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _changePassword_decorators, { kind: "method", name: "changePassword", static: false, private: false, access: { has: obj => "changePassword" in obj, get: obj => obj.changePassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkExists_decorators, { kind: "method", name: "checkExists", static: false, private: false, access: { has: obj => "checkExists" in obj, get: obj => obj.checkExists }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkEmailExists_decorators, { kind: "method", name: "checkEmailExists", static: false, private: false, access: { has: obj => "checkEmailExists" in obj, get: obj => obj.checkEmailExists }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserController = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        userService = __runInitializers(this, _instanceExtraInitializers);
        constructor(userService) {
            this.userService = userService;
        }
        async create(createUserDto) {
            const user = await this.userService.createUser(createUserDto);
            return {
                data: user,
                message: 'User created successfully'
            };
        }
        async findAll(tenantId, searchDto, pagination) {
            const { users, total } = await this.userService.searchUsers(tenantId, searchDto, pagination);
            return {
                data: users,
                pagination: {
                    total,
                    page: pagination.page || 1,
                    limit: pagination.limit || 20,
                    totalPages: Math.ceil(total / (pagination.limit || 20)),
                },
            };
        }
        async getUsersByRole(tenantId, role) {
            const users = await this.userService.getUsersByRole(tenantId, role);
            return {
                data: users,
                message: 'Users retrieved successfully'
            };
        }
        async getUserStats(tenantId) {
            const stats = await this.userService.getUserStats(tenantId);
            return {
                data: stats,
                message: 'User statistics retrieved successfully'
            };
        }
        async findOne(id) {
            const user = await this.userService.getUserById(id);
            return {
                data: user,
                message: 'User retrieved successfully'
            };
        }
        async findByEmail(tenantId, email) {
            const user = await this.userService.getUserByEmail(tenantId, email);
            return {
                data: user,
                message: 'User retrieved successfully'
            };
        }
        async update(id, updateUserDto) {
            const user = await this.userService.updateUser(id, updateUserDto);
            return {
                data: user,
                message: 'User updated successfully'
            };
        }
        async changePassword(id, changePasswordDto) {
            await this.userService.changePassword(id, changePasswordDto);
            return {
                data: undefined,
                message: 'Password changed successfully'
            };
        }
        async remove(id) {
            await this.userService.deleteUser(id);
        }
        async checkExists(id) {
            const exists = await this.userService.userExists(id);
            return {
                data: { exists },
                message: 'User existence checked'
            };
        }
        async checkEmailExists(tenantId, email) {
            const exists = await this.userService.emailExistsInTenant(tenantId, email);
            return {
                data: { exists },
                message: 'Email existence checked'
            };
        }
    };
    return UserController = _classThis;
})();
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
//# sourceMappingURL=user.controller.js.map