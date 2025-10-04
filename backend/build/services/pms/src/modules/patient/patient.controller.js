var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, } from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto, PatientSearchDto, } from './dto/patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
let PatientController = class PatientController {
    patientService;
    constructor(patientService) {
        this.patientService = patientService;
    }
    async createPatient(createPatientDto) {
        console.log('Controller received patient data:', JSON.stringify(createPatientDto, null, 2));
        console.log('createPatientDto type:', typeof createPatientDto);
        try {
            const result = await this.patientService.createPatient(createPatientDto);
            console.log('Controller success, returning:', result?.id);
            return result;
        }
        catch (error) {
            console.error('Controller error:', {
                message: error.message,
                stack: error.stack,
                input: createPatientDto,
            });
            throw error;
        }
    }
    async getPatients() {
        try {
            const query = {
                page: 1,
                limit: 10,
                sortBy: 'lastName',
                sortOrder: 'asc',
            };
            console.log('Calling patientService.getPatients with:', query);
            const result = await this.patientService.getPatients(query);
            console.log('Service returned:', result);
            return result;
        }
        catch (error) {
            console.error('Error in getPatients controller:', error);
            return {
                statusCode: 500,
                message: 'Internal server error',
                error: error.message,
                stack: error.stack
            };
        }
    }
    async searchPatients(searchDto) {
        return this.patientService.searchPatients(searchDto);
    }
    async getPatient(id) {
        return this.patientService.getPatientById(id);
    }
    async updatePatient(id, updatePatientDto) {
        return this.patientService.updatePatient(id, updatePatientDto);
    }
    async deletePatient(id) {
        return this.patientService.deletePatient(id);
    }
    async getPatientAppointments(id, query) {
        return this.patientService.getPatientAppointments(id, query);
    }
    async getPatientEncounters(id, query) {
        return this.patientService.getPatientEncounters(id, query);
    }
    async getPatientMedicalHistory(id) {
        return this.patientService.getPatientMedicalHistory(id);
    }
    async mergePatients(primaryPatientId, body) {
        return this.patientService.mergePatients(primaryPatientId, body.secondaryPatientId);
    }
    async findDuplicatePatients(id) {
        return this.patientService.findDuplicatePatients(id);
    }
    async updatePatientConsent(id, consentDto) {
        return this.patientService.updatePatientConsent(id, consentDto);
    }
    async getPatientTranslations(id) {
        return this.patientService.getPatientTranslations(id);
    }
    async updatePatientTranslations(id, translations) {
        return this.patientService.updatePatientTranslations(id, translations);
    }
};
__decorate([
    Post(),
    Permissions('patients.create'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "createPatient", null);
__decorate([
    Get(),
    Permissions('patients.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatients", null);
__decorate([
    Get('search'),
    Permissions('patients.read'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "searchPatients", null);
__decorate([
    Get(':id'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatient", null);
__decorate([
    Put(':id'),
    Permissions('patients.update'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "updatePatient", null);
__decorate([
    Delete(':id'),
    Permissions('patients.delete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "deletePatient", null);
__decorate([
    Get(':id/appointments'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientAppointments", null);
__decorate([
    Get(':id/encounters'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientEncounters", null);
__decorate([
    Get(':id/medical-history'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientMedicalHistory", null);
__decorate([
    Post(':id/merge'),
    Permissions('patients.update'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "mergePatients", null);
__decorate([
    Get(':id/duplicates'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "findDuplicatePatients", null);
__decorate([
    Post(':id/consent'),
    Permissions('patients.update'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "updatePatientConsent", null);
__decorate([
    Get(':id/translations'),
    Permissions('patients.read'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientTranslations", null);
__decorate([
    Post(':id/translations'),
    Permissions('patients.update'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "updatePatientTranslations", null);
PatientController = __decorate([
    UseGuards(JwtAuthGuard, PermissionsGuard),
    Controller('patients'),
    __metadata("design:paramtypes", [PatientService])
], PatientController);
export { PatientController };
//# sourceMappingURL=patient.controller.js.map