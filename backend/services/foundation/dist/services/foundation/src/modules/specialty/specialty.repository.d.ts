import { PrismaService } from '@zeal/database-foundation';
export declare class SpecialtyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<({
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            displayName: string;
            specialtyId: string;
            lang: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    })[]>;
    findByCode(code: string): Promise<({
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            displayName: string;
            specialtyId: string;
            lang: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }) | null>;
    findById(id: string): Promise<({
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            displayName: string;
            specialtyId: string;
            lang: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }) | null>;
    findByAuthorityCode(authority: string, authorityCode: string): Promise<({
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            displayName: string;
            specialtyId: string;
            lang: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }) | null>;
    getWithTranslation(id: string, locale: string): Promise<({
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            displayName: string;
            specialtyId: string;
            lang: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }) | null>;
}
//# sourceMappingURL=specialty.repository.d.ts.map