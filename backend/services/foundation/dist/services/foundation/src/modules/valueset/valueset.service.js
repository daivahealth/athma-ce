"use strict";
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
exports.ValueSetService = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let ValueSetService = class ValueSetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Get all valuesets with optional filtering
     */
    async findAll(query) {
        const where = {};
        if (query.category) {
            where.category = query.category;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.search) {
            where.OR = [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const valueSets = await this.prisma.valueSet.findMany({
            where,
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                category: true,
                version: true,
                status: true,
                isSystem: true,
                isExtensible: true,
                source: true,
                _count: {
                    select: { concepts: true },
                },
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
        return valueSets.map((vs) => ({
            ...vs,
            conceptCount: vs._count.concepts,
            _count: undefined,
        }));
    }
    /**
     * Get a specific valueset by code
     */
    async findOne(code) {
        const valueSet = await this.prisma.valueSet.findUnique({
            where: { code },
            include: {
                _count: {
                    select: { concepts: true },
                },
            },
        });
        if (!valueSet) {
            throw new common_1.NotFoundException(`ValueSet with code '${code}' not found`);
        }
        return {
            ...valueSet,
            conceptCount: valueSet._count.concepts,
            _count: undefined,
        };
    }
    /**
     * Get concepts for a valueset with optional language and tenant overrides
     */
    async getConcepts(code, options) {
        // Fetch valueset and concepts in parallel for better performance
        const [valueSet, concepts] = await Promise.all([
            this.prisma.valueSet.findUnique({
                where: { code },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    description: true,
                    category: true,
                    version: true,
                    status: true,
                    source: true,
                },
            }),
            this.prisma.valueSetConcept.findMany({
                where: {
                    valueSetCode: code,
                    ...(options.includeInactive ? {} : { status: 'active' }),
                },
                include: {
                    translations: options.language
                        ? {
                            where: { languageCode: options.language },
                        }
                        : false,
                    tenantOverrides: options.tenantId
                        ? {
                            where: { tenantId: options.tenantId },
                        }
                        : false,
                },
                orderBy: [{ sortOrder: 'asc' }, { display: 'asc' }],
            }),
        ]);
        if (!valueSet) {
            throw new common_1.NotFoundException(`ValueSet with code '${code}' not found`);
        }
        // Transform concepts to include localized display
        const transformedConcepts = concepts.map((concept) => {
            let displayText = concept.display;
            let definitionText = concept.definition;
            // Apply translation if available
            if (concept.translations && concept.translations.length > 0 && concept.translations[0]) {
                displayText = concept.translations[0].display;
                definitionText = concept.translations[0].definition || concept.definition;
            }
            // Apply tenant override if available
            if (concept.tenantOverrides && concept.tenantOverrides.length > 0) {
                const override = concept.tenantOverrides[0];
                if (override && override.customDisplay) {
                    displayText = override.customDisplay;
                }
            }
            return {
                id: concept.id,
                code: concept.code,
                display: displayText,
                definition: definitionText,
                systemCode: concept.systemCode,
                parentId: concept.parentId,
                sortOrder: concept.sortOrder,
                isDefault: concept.isDefault,
                status: concept.status,
                metadata: concept.metadata,
            };
        });
        return {
            valueSet: {
                id: valueSet.id,
                code: valueSet.code,
                name: valueSet.name,
                description: valueSet.description,
                category: valueSet.category,
                version: valueSet.version,
                status: valueSet.status,
                source: valueSet.source,
            },
            concepts: transformedConcepts,
            language: options.language || 'en',
            totalCount: transformedConcepts.length,
        };
    }
    /**
     * Search concepts across all valuesets
     */
    async searchConcepts(searchTerm, valueSetCode, language) {
        const where = {
            OR: [
                { code: { contains: searchTerm, mode: 'insensitive' } },
                { display: { contains: searchTerm, mode: 'insensitive' } },
                { definition: { contains: searchTerm, mode: 'insensitive' } },
            ],
            status: 'active',
        };
        if (valueSetCode) {
            where.valueSetCode = valueSetCode;
        }
        const concepts = await this.prisma.valueSetConcept.findMany({
            where,
            include: {
                valueSet: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
                translations: language
                    ? {
                        where: { languageCode: language },
                    }
                    : false,
            },
            take: 50, // Limit results
            orderBy: { display: 'asc' },
        });
        return concepts.map((concept) => ({
            id: concept.id,
            code: concept.code,
            display: concept.translations?.[0]?.display || concept.display,
            valueSet: concept.valueSet.code,
            valueSetName: concept.valueSet.name,
        }));
    }
    /**
     * Get valuesets by category
     */
    async findByCategory(category) {
        return this.findAll({ category });
    }
    /**
     * Get all available categories
     */
    async getCategories() {
        const categories = await this.prisma.valueSet.findMany({
            where: {
                category: { not: null },
                status: 'active',
            },
            select: {
                category: true,
            },
            distinct: ['category'],
            orderBy: { category: 'asc' },
        });
        return categories
            .map((c) => c.category)
            .filter((c) => c !== null);
    }
};
exports.ValueSetService = ValueSetService;
exports.ValueSetService = ValueSetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], ValueSetService);
//# sourceMappingURL=valueset.service.js.map