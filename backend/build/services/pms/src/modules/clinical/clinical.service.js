var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let ClinicalService = class ClinicalService {
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
ClinicalService = __decorate([
    Injectable()
], ClinicalService);
export { ClinicalService };
//# sourceMappingURL=clinical.service.js.map