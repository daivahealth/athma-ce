"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterController = void 0;
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
const encounter_service_1 = require("./encounter.service");
const encounter_dto_1 = require("./dto/encounter.dto");
let EncounterController = (() => {
    let _classDecorators = [(0, common_1.Controller)('encounters')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createEncounter_decorators;
    let _getEncounters_decorators;
    let _searchEncounters_decorators;
    let _getEncounterStats_decorators;
    let _getEncounter_decorators;
    let _updateEncounter_decorators;
    let _deleteEncounter_decorators;
    let _startEncounter_decorators;
    let _completeEncounter_decorators;
    let _cancelEncounter_decorators;
    let _getClinicalNotes_decorators;
    let _createClinicalNote_decorators;
    let _updateClinicalNote_decorators;
    let _deleteClinicalNote_decorators;
    let _signClinicalNote_decorators;
    let _getVitals_decorators;
    let _recordVitals_decorators;
    let _updateVitals_decorators;
    let _getOrders_decorators;
    let _createOrder_decorators;
    let _updateOrder_decorators;
    let _cancelOrder_decorators;
    var EncounterController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createEncounter_decorators = [(0, common_1.Post)()];
            _getEncounters_decorators = [(0, common_1.Get)()];
            _searchEncounters_decorators = [(0, common_1.Get)('search')];
            _getEncounterStats_decorators = [(0, common_1.Get)('stats')];
            _getEncounter_decorators = [(0, common_1.Get)(':id')];
            _updateEncounter_decorators = [(0, common_1.Put)(':id')];
            _deleteEncounter_decorators = [(0, common_1.Delete)(':id')];
            _startEncounter_decorators = [(0, common_1.Post)(':id/start')];
            _completeEncounter_decorators = [(0, common_1.Post)(':id/complete')];
            _cancelEncounter_decorators = [(0, common_1.Post)(':id/cancel')];
            _getClinicalNotes_decorators = [(0, common_1.Get)(':id/notes')];
            _createClinicalNote_decorators = [(0, common_1.Post)(':id/notes')];
            _updateClinicalNote_decorators = [(0, common_1.Put)('notes/:noteId')];
            _deleteClinicalNote_decorators = [(0, common_1.Delete)('notes/:noteId')];
            _signClinicalNote_decorators = [(0, common_1.Post)('notes/:noteId/sign')];
            _getVitals_decorators = [(0, common_1.Get)(':id/vitals')];
            _recordVitals_decorators = [(0, common_1.Post)(':id/vitals')];
            _updateVitals_decorators = [(0, common_1.Put)('vitals/:vitalId')];
            _getOrders_decorators = [(0, common_1.Get)(':id/orders')];
            _createOrder_decorators = [(0, common_1.Post)(':id/orders')];
            _updateOrder_decorators = [(0, common_1.Put)('orders/:orderId')];
            _cancelOrder_decorators = [(0, common_1.Post)('orders/:orderId/cancel')];
            __esDecorate(this, null, _createEncounter_decorators, { kind: "method", name: "createEncounter", static: false, private: false, access: { has: obj => "createEncounter" in obj, get: obj => obj.createEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getEncounters_decorators, { kind: "method", name: "getEncounters", static: false, private: false, access: { has: obj => "getEncounters" in obj, get: obj => obj.getEncounters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchEncounters_decorators, { kind: "method", name: "searchEncounters", static: false, private: false, access: { has: obj => "searchEncounters" in obj, get: obj => obj.searchEncounters }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getEncounterStats_decorators, { kind: "method", name: "getEncounterStats", static: false, private: false, access: { has: obj => "getEncounterStats" in obj, get: obj => obj.getEncounterStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getEncounter_decorators, { kind: "method", name: "getEncounter", static: false, private: false, access: { has: obj => "getEncounter" in obj, get: obj => obj.getEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateEncounter_decorators, { kind: "method", name: "updateEncounter", static: false, private: false, access: { has: obj => "updateEncounter" in obj, get: obj => obj.updateEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteEncounter_decorators, { kind: "method", name: "deleteEncounter", static: false, private: false, access: { has: obj => "deleteEncounter" in obj, get: obj => obj.deleteEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _startEncounter_decorators, { kind: "method", name: "startEncounter", static: false, private: false, access: { has: obj => "startEncounter" in obj, get: obj => obj.startEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _completeEncounter_decorators, { kind: "method", name: "completeEncounter", static: false, private: false, access: { has: obj => "completeEncounter" in obj, get: obj => obj.completeEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelEncounter_decorators, { kind: "method", name: "cancelEncounter", static: false, private: false, access: { has: obj => "cancelEncounter" in obj, get: obj => obj.cancelEncounter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getClinicalNotes_decorators, { kind: "method", name: "getClinicalNotes", static: false, private: false, access: { has: obj => "getClinicalNotes" in obj, get: obj => obj.getClinicalNotes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createClinicalNote_decorators, { kind: "method", name: "createClinicalNote", static: false, private: false, access: { has: obj => "createClinicalNote" in obj, get: obj => obj.createClinicalNote }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateClinicalNote_decorators, { kind: "method", name: "updateClinicalNote", static: false, private: false, access: { has: obj => "updateClinicalNote" in obj, get: obj => obj.updateClinicalNote }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteClinicalNote_decorators, { kind: "method", name: "deleteClinicalNote", static: false, private: false, access: { has: obj => "deleteClinicalNote" in obj, get: obj => obj.deleteClinicalNote }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _signClinicalNote_decorators, { kind: "method", name: "signClinicalNote", static: false, private: false, access: { has: obj => "signClinicalNote" in obj, get: obj => obj.signClinicalNote }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getVitals_decorators, { kind: "method", name: "getVitals", static: false, private: false, access: { has: obj => "getVitals" in obj, get: obj => obj.getVitals }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _recordVitals_decorators, { kind: "method", name: "recordVitals", static: false, private: false, access: { has: obj => "recordVitals" in obj, get: obj => obj.recordVitals }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateVitals_decorators, { kind: "method", name: "updateVitals", static: false, private: false, access: { has: obj => "updateVitals" in obj, get: obj => obj.updateVitals }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getOrders_decorators, { kind: "method", name: "getOrders", static: false, private: false, access: { has: obj => "getOrders" in obj, get: obj => obj.getOrders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createOrder_decorators, { kind: "method", name: "createOrder", static: false, private: false, access: { has: obj => "createOrder" in obj, get: obj => obj.createOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateOrder_decorators, { kind: "method", name: "updateOrder", static: false, private: false, access: { has: obj => "updateOrder" in obj, get: obj => obj.updateOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelOrder_decorators, { kind: "method", name: "cancelOrder", static: false, private: false, access: { has: obj => "cancelOrder" in obj, get: obj => obj.cancelOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EncounterController = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        encounterService = __runInitializers(this, _instanceExtraInitializers);
        constructor(encounterService) {
            this.encounterService = encounterService;
        }
        async createEncounter(createEncounterDto) {
            return this.encounterService.createEncounter(createEncounterDto);
        }
        async getEncounters(query) {
            return this.encounterService.getEncounters(query);
        }
        async searchEncounters(searchDto) {
            return this.encounterService.searchEncounters(searchDto);
        }
        async getEncounterStats(query) {
            return this.encounterService.getEncounterStats(query);
        }
        async getEncounter(id) {
            return this.encounterService.getEncounterById(id);
        }
        async updateEncounter(id, updateEncounterDto) {
            return this.encounterService.updateEncounter(id, updateEncounterDto);
        }
        async deleteEncounter(id) {
            await this.encounterService.deleteEncounter(id);
            return { message: 'Encounter deleted successfully' };
        }
        async startEncounter(id) {
            return this.encounterService.startEncounter(id);
        }
        async completeEncounter(id) {
            return this.encounterService.completeEncounter(id);
        }
        async cancelEncounter(id, body) {
            return this.encounterService.cancelEncounter(id, body.reason);
        }
        // Clinical Notes
        async getClinicalNotes(id) {
            return this.encounterService.getClinicalNotes(id);
        }
        async createClinicalNote(id, createNoteDto) {
            return this.encounterService.createClinicalNote({
                ...createNoteDto,
                encounterId: id,
            });
        }
        async updateClinicalNote(noteId, updateNoteDto) {
            return this.encounterService.updateClinicalNote(noteId, updateNoteDto);
        }
        async deleteClinicalNote(noteId) {
            await this.encounterService.deleteClinicalNote(noteId);
            return { message: 'Clinical note deleted successfully' };
        }
        async signClinicalNote(noteId, body) {
            return this.encounterService.signClinicalNote(noteId, body.signedBy);
        }
        // Vitals
        async getVitals(id) {
            return this.encounterService.getVitals(id);
        }
        async recordVitals(id, createVitalsDto) {
            return this.encounterService.recordVitals({
                ...createVitalsDto,
                encounterId: id,
            });
        }
        async updateVitals(vitalId, updates) {
            return this.encounterService.updateVitals(vitalId, updates);
        }
        // Orders
        async getOrders(id) {
            return this.encounterService.getOrders(id);
        }
        async createOrder(id, createOrderDto) {
            return this.encounterService.createOrder({
                ...createOrderDto,
                encounterId: id,
            });
        }
        async updateOrder(orderId, updates) {
            return this.encounterService.updateOrder(orderId, updates);
        }
        async cancelOrder(orderId, body) {
            return this.encounterService.cancelOrder(orderId, body.reason);
        }
    };
    return EncounterController = _classThis;
})();
exports.EncounterController = EncounterController;
//# sourceMappingURL=encounter.controller.js.map
//# sourceMappingURL=encounter.controller.js.map