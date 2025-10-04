import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpaceController {
    private readonly spaceService;
    constructor(spaceService: SpaceService);
    create(dto: CreateSpaceDto): import(".prisma/client").Prisma.Prisma__SpaceClient<{
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
    list(facilityId?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    get(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }>;
    update(id: string, dto: UpdateSpaceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        isActive: boolean;
        spaceNumber: string | null;
        spaceType: string;
        capacity: number;
    }>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=space.controller.d.ts.map