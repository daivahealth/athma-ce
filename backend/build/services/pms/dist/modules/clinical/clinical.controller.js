"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalController = void 0;
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
const clinical_service_1 = require("./clinical.service");
let ClinicalController = (() => {
    let _classDecorators = [(0, common_1.Controller)('clinical')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getTemplates_decorators;
    let _createTemplate_decorators;
    let _getMedications_decorators;
    let _searchMedications_decorators;
    let _getDiagnoses_decorators;
    let _searchDiagnoses_decorators;
    var ClinicalController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getTemplates_decorators = [(0, common_1.Get)('templates')];
            _createTemplate_decorators = [(0, common_1.Post)('templates')];
            _getMedications_decorators = [(0, common_1.Get)('medications')];
            _searchMedications_decorators = [(0, common_1.Get)('medications/search')];
            _getDiagnoses_decorators = [(0, common_1.Get)('diagnoses')];
            _searchDiagnoses_decorators = [(0, common_1.Get)('diagnoses/search')];
            __esDecorate(this, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: obj => "getTemplates" in obj, get: obj => obj.getTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createTemplate_decorators, { kind: "method", name: "createTemplate", static: false, private: false, access: { has: obj => "createTemplate" in obj, get: obj => obj.createTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getMedications_decorators, { kind: "method", name: "getMedications", static: false, private: false, access: { has: obj => "getMedications" in obj, get: obj => obj.getMedications }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchMedications_decorators, { kind: "method", name: "searchMedications", static: false, private: false, access: { has: obj => "searchMedications" in obj, get: obj => obj.searchMedications }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getDiagnoses_decorators, { kind: "method", name: "getDiagnoses", static: false, private: false, access: { has: obj => "getDiagnoses" in obj, get: obj => obj.getDiagnoses }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _searchDiagnoses_decorators, { kind: "method", name: "searchDiagnoses", static: false, private: false, access: { has: obj => "searchDiagnoses" in obj, get: obj => obj.searchDiagnoses }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClinicalController = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        clinicalService = __runInitializers(this, _instanceExtraInitializers);
        constructor(clinicalService) {
            this.clinicalService = clinicalService;
        }
        async getTemplates(query) {
            return this.clinicalService.getTemplates(query);
        }
        async createTemplate(templateDto) {
            return this.clinicalService.createTemplate(templateDto);
        }
        async getMedications(query) {
            return this.clinicalService.getMedications(query);
        }
        async searchMedications(query) {
            return this.clinicalService.searchMedications(query);
        }
        async getDiagnoses(query) {
            return this.clinicalService.getDiagnoses(query);
        }
        async searchDiagnoses(query) {
            return this.clinicalService.searchDiagnoses(query);
        }
    };
    return ClinicalController = _classThis;
})();
exports.ClinicalController = ClinicalController;
//# sourceMappingURL=clinical.controller.js.map
//# sourceMappingURL=clinical.controller.js.map