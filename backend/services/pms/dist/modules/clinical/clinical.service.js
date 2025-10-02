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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
let ClinicalService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClinicalService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClinicalService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        async getTemplates(query) {
            // Mock implementation - would query from database
            return {
                data: [
                    {
                        id: '1',
                        name: 'SOAP Note Template',
                        type: 'soap',
                        content: 'Subjective: \nObjective: \nAssessment: \nPlan: ',
                    },
                    {
                        id: '2',
                        name: 'Progress Note Template',
                        type: 'progress',
                        content: 'Progress: \nAssessment: \nPlan: ',
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 2,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }
        async createTemplate(templateDto) {
            // Mock implementation - would create in database
            return {
                id: '3',
                ...templateDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }
        async getMedications(query) {
            // Mock implementation - would query from medication master table
            return {
                data: [
                    {
                        id: '1',
                        name: 'Paracetamol',
                        genericName: 'Acetaminophen',
                        dosageForm: 'tablet',
                        strength: '500mg',
                        manufacturer: 'Generic',
                    },
                    {
                        id: '2',
                        name: 'Ibuprofen',
                        genericName: 'Ibuprofen',
                        dosageForm: 'tablet',
                        strength: '400mg',
                        manufacturer: 'Generic',
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 2,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }
        async searchMedications(query) {
            // Mock implementation - would search medication database
            return [
                {
                    id: '1',
                    name: 'Paracetamol',
                    genericName: 'Acetaminophen',
                    dosageForm: 'tablet',
                    strength: '500mg',
                    manufacturer: 'Generic',
                    matchScore: 0.95,
                },
            ];
        }
        async getDiagnoses(query) {
            // Mock implementation - would query from ICD-10 database
            return {
                data: [
                    {
                        id: '1',
                        code: 'Z00.00',
                        description: 'Encounter for general adult medical examination without abnormal findings',
                        category: 'Z00-Z13',
                    },
                    {
                        id: '2',
                        code: 'I10',
                        description: 'Essential hypertension',
                        category: 'I10-I16',
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 2,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }
        async searchDiagnoses(query) {
            // Mock implementation - would search ICD-10 database
            return [
                {
                    id: '1',
                    code: 'Z00.00',
                    description: 'Encounter for general adult medical examination without abnormal findings',
                    category: 'Z00-Z13',
                    matchScore: 0.9,
                },
            ];
        }
    };
    return ClinicalService = _classThis;
})();
export { ClinicalService };
//# sourceMappingURL=clinical.service.js.map