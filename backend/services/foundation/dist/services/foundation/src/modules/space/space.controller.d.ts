import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpaceController {
    private readonly spaceService;
    constructor(spaceService: SpaceService);
    create(dto: CreateSpaceDto): import("@zeal/database-foundation").Prisma.Prisma__SpaceClient<{
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
    list(facilityId?: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
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
    get(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }>;
    update(id: string, dto: UpdateSpaceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
    }>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=space.controller.d.ts.map