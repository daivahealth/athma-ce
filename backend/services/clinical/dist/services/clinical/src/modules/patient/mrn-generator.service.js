"use strict";
/**
 * MRN (Medical Record Number) Generator Service
 *
 * Generates unique medical record numbers based on configurable formats.
 * Supports various formats through configuration:
 * - {YEAR} - 4-digit year
 * - {YY} - 2-digit year
 * - {MONTH} - 2-digit month
 * - {FACILITY} - Facility code
 * - {SEQ} - Sequential number
 * - {RANDOM} - Random alphanumeric
 *
 * Examples:
 * - PAT-{YEAR}-{SEQ:6} -> PAT-2025-000123
 * - {FACILITY}-{YY}{MONTH}-{SEQ:5} -> FAC01-2510-00456
 * - MRN{YEAR}{RANDOM:4} -> MRN2025AB3D
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
exports.MrnGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const config_1 = require("../../config");
let MrnGeneratorService = class MrnGeneratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Generate a new MRN based on configuration
     */
    async generateMrn(context) {
        // Get MRN format from configuration
        const format = await this.getMrnFormat(context);
        // Generate MRN based on format
        let mrn = await this.applyFormat(format, context);
        // Ensure uniqueness
        let attempt = 0;
        const maxAttempts = 10;
        while (attempt < maxAttempts) {
            const exists = await this.mrnExists(mrn, context.tenantId);
            if (!exists) {
                return mrn;
            }
            // If MRN exists, regenerate (mainly for random components)
            attempt++;
            mrn = await this.applyFormat(format, context);
        }
        throw new Error(`Failed to generate unique MRN after ${maxAttempts} attempts`);
    }
    /**
     * Get MRN format from configuration
     */
    async getMrnFormat(context) {
        try {
            const format = await config_1.configClient.get('clinical.mrn_format', {
                tenantId: context.tenantId,
                facilityId: context.facilityId,
            });
            return format || 'PAT-{YEAR}-{SEQ:6}'; // Default format
        }
        catch (error) {
            console.warn('Could not fetch MRN format from config, using default', error);
            return 'PAT-{YEAR}-{SEQ:6}'; // Default format
        }
    }
    /**
     * Apply format template to generate MRN
     */
    async applyFormat(format, context) {
        let mrn = format;
        const now = new Date();
        // {YEAR} - 4-digit year
        mrn = mrn.replace('{YEAR}', now.getFullYear().toString());
        // {YY} - 2-digit year
        mrn = mrn.replace('{YY}', now.getFullYear().toString().slice(-2));
        // {MONTH} - 2-digit month
        mrn = mrn.replace('{MONTH}', (now.getMonth() + 1).toString().padStart(2, '0'));
        // {DAY} - 2-digit day
        mrn = mrn.replace('{DAY}', now.getDate().toString().padStart(2, '0'));
        // {FACILITY} - Facility code
        if (mrn.includes('{FACILITY}')) {
            const facilityCode = context.facilityCode || context.facilityId.slice(0, 6);
            mrn = mrn.replace('{FACILITY}', facilityCode);
        }
        // {SEQ:n} - Sequential number with n digits
        const seqMatch = /\{SEQ:(\d+)\}/.exec(mrn);
        if (seqMatch && seqMatch[1]) {
            const digits = parseInt(seqMatch[1], 10);
            const sequence = await this.getNextSequence(context.tenantId, context.facilityId);
            mrn = mrn.replace(seqMatch[0], sequence.toString().padStart(digits, '0'));
        }
        // {RANDOM:n} - Random alphanumeric with n characters
        const randomMatch = /\{RANDOM:(\d+)\}/.exec(mrn);
        if (randomMatch && randomMatch[1]) {
            const length = parseInt(randomMatch[1], 10);
            const random = this.generateRandom(length);
            mrn = mrn.replace(randomMatch[0], random);
        }
        return mrn;
    }
    /**
     * Get next sequence number for tenant/facility
     */
    async getNextSequence(tenantId, facilityId) {
        // Count existing patients for this tenant/facility
        // In production, you might want a separate sequence table
        const count = await this.prisma.patient.count({
            where: {
                tenantId,
                createdAtFacility: facilityId,
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
     * Check if MRN already exists
     */
    async mrnExists(mrn, tenantId) {
        const existing = await this.prisma.patient.findFirst({
            where: {
                mrn,
                tenantId,
            },
        });
        return !!existing;
    }
    /**
     * Validate MRN format string
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
exports.MrnGeneratorService = MrnGeneratorService;
exports.MrnGeneratorService = MrnGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], MrnGeneratorService);
//# sourceMappingURL=mrn-generator.service.js.map