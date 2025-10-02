var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { Controller, Get, Post, Put, Delete, Body, Param, Query, } from '@nestjs/common';
import { StaffService } from './staff.service';
let StaffController = (() => {
    let _classDecorators = [Controller('staff')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createStaff_decorators;
    let _getStaff_decorators;
    let _getStaffById_decorators;
    let _updateStaff_decorators;
    let _deleteStaff_decorators;
    let _getStaffAvailability_decorators;
    let _getStaffSchedule_decorators;
    var StaffController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createStaff_decorators = [Post()];
            _getStaff_decorators = [Get()];
            _getStaffById_decorators = [Get(':id')];
            _updateStaff_decorators = [Put(':id')];
            _deleteStaff_decorators = [Delete(':id')];
            _getStaffAvailability_decorators = [Get(':id/availability')];
            _getStaffSchedule_decorators = [Get(':id/schedule')];
            __esDecorate(this, null, _createStaff_decorators, { kind: "method", name: "createStaff", static: false, private: false, access: { has: obj => "createStaff" in obj, get: obj => obj.createStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaff_decorators, { kind: "method", name: "getStaff", static: false, private: false, access: { has: obj => "getStaff" in obj, get: obj => obj.getStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaffById_decorators, { kind: "method", name: "getStaffById", static: false, private: false, access: { has: obj => "getStaffById" in obj, get: obj => obj.getStaffById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateStaff_decorators, { kind: "method", name: "updateStaff", static: false, private: false, access: { has: obj => "updateStaff" in obj, get: obj => obj.updateStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteStaff_decorators, { kind: "method", name: "deleteStaff", static: false, private: false, access: { has: obj => "deleteStaff" in obj, get: obj => obj.deleteStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaffAvailability_decorators, { kind: "method", name: "getStaffAvailability", static: false, private: false, access: { has: obj => "getStaffAvailability" in obj, get: obj => obj.getStaffAvailability }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStaffSchedule_decorators, { kind: "method", name: "getStaffSchedule", static: false, private: false, access: { has: obj => "getStaffSchedule" in obj, get: obj => obj.getStaffSchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StaffController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        staffService = __runInitializers(this, _instanceExtraInitializers);
        constructor(staffService) {
            this.staffService = staffService;
        }
        async createStaff(createStaffDto) {
            return this.staffService.createStaff(createStaffDto);
        }
        async getStaff(query) {
            return this.staffService.getStaff(query);
        }
        async getStaffById(id) {
            return this.staffService.getStaffById(id);
        }
        async updateStaff(id, updateStaffDto) {
            return this.staffService.updateStaff(id, updateStaffDto);
        }
        async deleteStaff(id) {
            return this.staffService.deleteStaff(id);
        }
        async getStaffAvailability(id, query) {
            return this.staffService.getStaffAvailability(id, query);
        }
        async getStaffSchedule(id, query) {
            return this.staffService.getStaffSchedule(id, query);
        }
    };
    return StaffController = _classThis;
})();
export { StaffController };
//# sourceMappingURL=staff.controller.js.map