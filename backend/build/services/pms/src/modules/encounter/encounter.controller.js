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
import { Controller, Get, Post, Put, Delete, Body, Param, Query, } from '@nestjs/common';
import { EncounterService } from './encounter.service';
import { CreateEncounterDto, UpdateEncounterDto, EncounterQueryDto, EncounterSearchDto, UpdateClinicalNoteDto, } from './dto/encounter.dto';
let EncounterController = class EncounterController {
    encounterService;
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
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "createEncounter", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getEncounters", null);
__decorate([
    Get('search'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "searchEncounters", null);
__decorate([
    Get('stats'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getEncounterStats", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getEncounter", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateEncounter", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "deleteEncounter", null);
__decorate([
    Post(':id/start'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "startEncounter", null);
__decorate([
    Post(':id/complete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "completeEncounter", null);
__decorate([
    Post(':id/cancel'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "cancelEncounter", null);
__decorate([
    Get(':id/notes'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getClinicalNotes", null);
__decorate([
    Post(':id/notes'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "createClinicalNote", null);
__decorate([
    Put('notes/:noteId'),
    __param(0, Param('noteId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateClinicalNote", null);
__decorate([
    Delete('notes/:noteId'),
    __param(0, Param('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "deleteClinicalNote", null);
__decorate([
    Post('notes/:noteId/sign'),
    __param(0, Param('noteId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "signClinicalNote", null);
__decorate([
    Get(':id/vitals'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getVitals", null);
__decorate([
    Post(':id/vitals'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "recordVitals", null);
__decorate([
    Put('vitals/:vitalId'),
    __param(0, Param('vitalId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateVitals", null);
__decorate([
    Get(':id/orders'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "getOrders", null);
__decorate([
    Post(':id/orders'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "createOrder", null);
__decorate([
    Put('orders/:orderId'),
    __param(0, Param('orderId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "updateOrder", null);
__decorate([
    Post('orders/:orderId/cancel'),
    __param(0, Param('orderId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EncounterController.prototype, "cancelOrder", null);
EncounterController = __decorate([
    Controller('encounters'),
    __metadata("design:paramtypes", [EncounterService])
], EncounterController);
export { EncounterController };
//# sourceMappingURL=encounter.controller.js.map