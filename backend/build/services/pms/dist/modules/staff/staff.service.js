"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
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
const staff_repository_1 = require("./staff.repository");
let StaffService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StaffService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StaffService = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        staffRepository;
        constructor(staffRepository) {
            this.staffRepository = staffRepository;
        }
        async createStaff(createStaffDto) {
            // Check if employee ID already exists
            const existingStaff = await this.staffRepository.findByEmployeeId(createStaffDto.employeeId);
            if (existingStaff) {
                throw new common_1.ConflictException('Staff member with this employee ID already exists');
            }
            return this.staffRepository.create(createStaffDto);
        }
        async getStaff(query) {
            return this.staffRepository.findMany(query);
        }
        async getStaffById(id) {
            const staff = await this.staffRepository.findById(id);
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            return staff;
        }
        async updateStaff(id, updateStaffDto) {
            const existingStaff = await this.staffRepository.findById(id);
            if (!existingStaff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            // Check for employee ID conflicts if being updated
            if (updateStaffDto.employeeId && updateStaffDto.employeeId !== existingStaff.employeeId) {
                const conflictStaff = await this.staffRepository.findByEmployeeId(updateStaffDto.employeeId);
                if (conflictStaff && conflictStaff.id !== id) {
                    throw new common_1.ConflictException('Staff member with this employee ID already exists');
                }
            }
            await this.staffRepository.update(id, updateStaffDto);
            return this.staffRepository.findById(id);
        }
        async deleteStaff(id) {
            const staff = await this.staffRepository.findById(id);
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            await this.staffRepository.delete(id);
        }
        async getStaffAvailability(id, query) {
            const staff = await this.staffRepository.findById(id);
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            return this.staffRepository.getAvailability(id, query);
        }
        async getStaffSchedule(id, query) {
            const staff = await this.staffRepository.findById(id);
            if (!staff) {
                throw new common_1.NotFoundException('Staff member not found');
            }
            return this.staffRepository.getSchedule(id, query);
        }
    };
    return StaffService = _classThis;
})();
exports.StaffService = StaffService;
//# sourceMappingURL=staff.service.js.map
//# sourceMappingURL=staff.service.js.map