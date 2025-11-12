"use strict";
/**
 * Encounter Number Generator Service
 *
 * Generates unique encounter numbers based on configurable formats.
 * Supports various formats through configuration:
 * - {YEAR} - 4-digit year
 * - {YY} - 2-digit year
 * - {MONTH} - 2-digit month
 * - {DAY} - 2-digit day
 * - {FACILITY} - Facility code
 * - {SEQ:n} - Sequential number with n digits
 * - {RANDOM:n} - Random alphanumeric with n characters
 *
 * Examples:
 * - ENC-{YEAR}-{SEQ:6} -> ENC-2025-000123
 * - {FACILITY}-{YY}{MONTH}-{SEQ:5} -> FAC01-2510-00456
 * - ENC{YEAR}{RANDOM:4} -> ENC2025AB3D
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterNumberGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const config_1 = require("../../config");
let EncounterNumberGeneratorService = class EncounterNumberGeneratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Generate a new encounter number based on configuration
     */
    async generateEncounterNumber(context) {
        // Get encounter number format from configuration
        const format = await this.getEncounterNumberFormat(context);
        // Generate encounter number based on format
        let encounterNumber = await this.applyFormat(format, context);
        // Ensure uniqueness
        let attempt = 0;
        const maxAttempts = 10;
        while (attempt < maxAttempts) {
            const exists = await this.encounterNumberExists(encounterNumber, context.tenantId);
            if (!exists) {
                return encounterNumber;
            }
            // If encounter number exists, regenerate (mainly for random components)
            attempt++;
            encounterNumber = await this.applyFormat(format, context);
        }
        throw new Error(`Failed to generate unique encounter number after ${maxAttempts} attempts`);
    }
    /**
     * Get encounter number format from configuration
     */
    async getEncounterNumberFormat(context) {
        try {
            const format = await config_1.configClient.get('clinical.encounter_number_format', {
                tenantId: context.tenantId,
                facilityId: context.facilityId,
            });
            return format || 'ENC-{YEAR}-{SEQ:6}'; // Default format
        }
        catch (error) {
            console.warn('Could not fetch encounter number format from config, using default', error);
            return 'ENC-{YEAR}-{SEQ:6}'; // Default format
        }
    }
    /**
     * Apply format template to generate encounter number
     */
    async applyFormat(format, context) {
        let encounterNumber = format;
        const now = new Date();
        // {YEAR} - 4-digit year
        encounterNumber = encounterNumber.replace('{YEAR}', now.getFullYear().toString());
        // {YY} - 2-digit year
        encounterNumber = encounterNumber.replace('{YY}', now.getFullYear().toString().slice(-2));
        // {MONTH} - 2-digit month
        encounterNumber = encounterNumber.replace('{MONTH}', (now.getMonth() + 1).toString().padStart(2, '0'));
        // {DAY} - 2-digit day
        encounterNumber = encounterNumber.replace('{DAY}', now.getDate().toString().padStart(2, '0'));
        // {FACILITY} - Facility code
        if (encounterNumber.includes('{FACILITY}')) {
            const facilityCode = context.facilityCode || context.facilityId.slice(0, 6);
            encounterNumber = encounterNumber.replace('{FACILITY}', facilityCode);
        }
        // {SEQ:n} - Sequential number with n digits
        const seqMatch = /\{SEQ:(\d+)\}/.exec(encounterNumber);
        if (seqMatch && seqMatch[1]) {
            const digits = parseInt(seqMatch[1], 10);
            const sequence = await this.getNextSequence(context.tenantId, context.facilityId);
            encounterNumber = encounterNumber.replace(seqMatch[0], sequence.toString().padStart(digits, '0'));
        }
        // {RANDOM:n} - Random alphanumeric with n characters
        const randomMatch = /\{RANDOM:(\d+)\}/.exec(encounterNumber);
        if (randomMatch && randomMatch[1]) {
            const length = parseInt(randomMatch[1], 10);
            const random = this.generateRandom(length);
            encounterNumber = encounterNumber.replace(randomMatch[0], random);
        }
        return encounterNumber;
    }
    /**
     * Get next sequence number for tenant/facility
     */
    async getNextSequence(tenantId, facilityId) {
        // Count existing encounters for this tenant/facility
        // In production, you might want a separate sequence table
        const count = await this.prisma.encounter.count({
            where: {
                tenantId,
                facilityId,
            },
        });
        return count + 1;
    }
    /**
     * Generate random alphanumeric string
     */
    generateRandom(length) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar characters
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    /**
     * Check if encounter number already exists
     */
    async encounterNumberExists(encounterNumber, tenantId) {
        const existing = await this.prisma.encounter.findFirst({
            where: {
                encounterNumber,
                tenantId,
            },
        });
        return !!existing;
    }
    /**
     * Validate encounter number format string
     */
    validateFormat(format) {
        const errors = [];
        // Check for valid placeholders
        const validPlaceholders = [
            '{YEAR}',
            '{YY}',
            '{MONTH}',
            '{DAY}',
            '{FACILITY}',
            /\{SEQ:\d+\}/,
            /\{RANDOM:\d+\}/,
        ];
        const placeholders = format.match(/\{[A-Z]+(?::\d+)?\}/g) || [];
        for (const placeholder of placeholders) {
            const isValid = validPlaceholders.some((valid) => {
                if (typeof valid === 'string') {
                    return valid === placeholder;
                }
                else {
                    return valid.test(placeholder);
                }
            });
            if (!isValid) {
                errors.push(`Invalid placeholder: ${placeholder}`);
            }
        }
        // Warn if no sequence or random component (might not be unique)
        if (!format.includes('{SEQ') && !format.includes('{RANDOM')) {
            errors.push('Warning: Format does not include {SEQ:n} or {RANDOM:n}. Uniqueness may not be guaranteed.');
        }
        return {
            valid: errors.length === 0 || errors.every((e) => e.startsWith('Warning')),
            errors,
        };
    }
};
exports.EncounterNumberGeneratorService = EncounterNumberGeneratorService;
exports.EncounterNumberGeneratorService = EncounterNumberGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], EncounterNumberGeneratorService);
//# sourceMappingURL=encounter-number-generator.service.js.map