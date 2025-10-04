import { PrismaService } from '@zeal/shared-database';
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
    }): import(".prisma/client").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMany(facilityId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        name: string;
        spaceNumber: string;
        spaceType: string;
        capacity: number;
        isActive: boolean;
    }>): import(".prisma/client").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__SpaceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private readonly selectFields;
}
//# sourceMappingURL=space.repository.d.ts.map