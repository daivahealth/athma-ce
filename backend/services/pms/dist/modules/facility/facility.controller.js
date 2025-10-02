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
import { FacilityService } from './facility.service';
let FacilityController = (() => {
    let _classDecorators = [Controller('facilities')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createFacility_decorators;
    let _getFacilities_decorators;
    let _getFacility_decorators;
    let _updateFacility_decorators;
    let _deleteFacility_decorators;
    let _getFacilitySpaces_decorators;
    let _getFacilityStaff_decorators;
    let _getFacilitySchedule_decorators;
    var FacilityController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createFacility_decorators = [Post()];
            _getFacilities_decorators = [Get()];
            _getFacility_decorators = [Get(':id')];
            _updateFacility_decorators = [Put(':id')];
            _deleteFacility_decorators = [Delete(':id')];
            _getFacilitySpaces_decorators = [Get(':id/spaces')];
            _getFacilityStaff_decorators = [Get(':id/staff')];
            _getFacilitySchedule_decorators = [Get(':id/schedule')];
            __esDecorate(this, null, _createFacility_decorators, { kind: "method", name: "createFacility", static: false, private: false, access: { has: obj => "createFacility" in obj, get: obj => obj.createFacility }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacilities_decorators, { kind: "method", name: "getFacilities", static: false, private: false, access: { has: obj => "getFacilities" in obj, get: obj => obj.getFacilities }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacility_decorators, { kind: "method", name: "getFacility", static: false, private: false, access: { has: obj => "getFacility" in obj, get: obj => obj.getFacility }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateFacility_decorators, { kind: "method", name: "updateFacility", static: false, private: false, access: { has: obj => "updateFacility" in obj, get: obj => obj.updateFacility }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteFacility_decorators, { kind: "method", name: "deleteFacility", static: false, private: false, access: { has: obj => "deleteFacility" in obj, get: obj => obj.deleteFacility }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacilitySpaces_decorators, { kind: "method", name: "getFacilitySpaces", static: false, private: false, access: { has: obj => "getFacilitySpaces" in obj, get: obj => obj.getFacilitySpaces }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacilityStaff_decorators, { kind: "method", name: "getFacilityStaff", static: false, private: false, access: { has: obj => "getFacilityStaff" in obj, get: obj => obj.getFacilityStaff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFacilitySchedule_decorators, { kind: "method", name: "getFacilitySchedule", static: false, private: false, access: { has: obj => "getFacilitySchedule" in obj, get: obj => obj.getFacilitySchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FacilityController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        facilityService = __runInitializers(this, _instanceExtraInitializers);
        constructor(facilityService) {
            this.facilityService = facilityService;
        }
        async createFacility(createFacilityDto) {
            return this.facilityService.createFacility(createFacilityDto);
        }
        async getFacilities(query) {
            return this.facilityService.getFacilities(query);
        }
        async getFacility(id) {
            return this.facilityService.getFacilityById(id);
        }
        async updateFacility(id, updateFacilityDto) {
            return this.facilityService.updateFacility(id, updateFacilityDto);
        }
        async deleteFacility(id) {
            return this.facilityService.deleteFacility(id);
        }
        async getFacilitySpaces(id, query) {
            return this.facilityService.getFacilitySpaces(id, query);
        }
        async getFacilityStaff(id, query) {
            return this.facilityService.getFacilityStaff(id, query);
        }
        async getFacilitySchedule(id, query) {
            return this.facilityService.getFacilitySchedule(id, query);
        }
    };
    return FacilityController = _classThis;
})();
export { FacilityController };
//# sourceMappingURL=facility.controller.js.map