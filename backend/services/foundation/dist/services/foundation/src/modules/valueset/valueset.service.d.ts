import { PrismaService } from '@zeal/database-foundation';
import { QueryValueSetDto, GetConceptsDto } from './dto/query-valueset.dto';
export declare class ValueSetService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Get all valuesets with optional filtering
     */
    findAll(query: QueryValueSetDto): Promise<{
        conceptCount: number;
        _count: undefined;
        id: string;
        name: string;
        status: string;
        code: string;
        description: string | null;
        isSystem: boolean;
        category: string | null;
        version: string | null;
        isExtensible: boolean;
        source: string | null;
    }[]>;
    /**
     * Get a specific valueset by code
     */
    findOne(code: string): Promise<{
        conceptCount: number;
        _count: undefined;
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isSystem: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        sourceUrl: string | null;
        category: string | null;
        version: string | null;
        isExtensible: boolean;
        source: string | null;
    }>;
    /**
     * Get concepts for a valueset with optional language and tenant overrides
     */
    getConcepts(code: string, options: GetConceptsDto): Promise<{
        valueSet: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            category: string | null;
            version: string | null;
            status: string;
            source: string | null;
        };
        concepts: {
            id: string;
            code: string;
            display: string;
            definition: string | null;
            systemCode: string | null;
            parentId: string | null;
            sortOrder: number;
            isDefault: boolean;
            status: string;
            metadata: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        }[];
        language: string;
        totalCount: number;
    }>;
    /**
     * Search concepts across all valuesets
     */
    searchConcepts(searchTerm: string, valueSetCode?: string, language?: string): Promise<{
        id: string;
        code: string;
        display: string;
        valueSet: string;
        valueSetName: string;
    }[]>;
    /**
     * Get valuesets by category
     */
    findByCategory(category: string): Promise<{
        conceptCount: number;
        _count: undefined;
        id: string;
        name: string;
        status: string;
        code: string;
        description: string | null;
        isSystem: boolean;
        category: string | null;
        version: string | null;
        isExtensible: boolean;
        source: string | null;
    }[]>;
    /**
     * Get all available categories
     */
    getCategories(): Promise<string[]>;
}
//# sourceMappingURL=valueset.service.d.ts.map