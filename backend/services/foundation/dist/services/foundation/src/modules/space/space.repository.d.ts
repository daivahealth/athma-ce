import { PrismaService } from '@zeal/database-foundation';
export declare class SpaceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        facilityId: string;
        name: string;
        spaceNumber?: string;
        spaceType?: string;
        capacity?: number;
        isActive?: boolean;
    }): import("@zeal/database-foundation").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findMany(facilityId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }[]>;
    findById(id: string): import("@zeal/database-foundation").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        name: string;
        spaceNumber: string;
        spaceType: string;
        capacity: number;
        isActive: boolean;
    }>): import("@zeal/database-foundation").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    delete(id: string): import("@zeal/database-foundation").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    private readonly selectFields;
}
//# sourceMappingURL=space.repository.d.ts.map