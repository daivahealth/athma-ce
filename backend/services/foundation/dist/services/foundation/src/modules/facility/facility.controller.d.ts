import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { SpecialtyService } from '../specialty/specialty.service';
export declare class FacilityController {
    private readonly facilityService;
    private readonly specialtyService;
    constructor(facilityService: FacilityService, specialtyService: SpecialtyService);
    create(dto: CreateFacilityDto): import("@zeal/database-foundation").Prisma.Prisma__FacilityClient<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityType: string;
        licenseNumber: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        emirate: string | null;
        postalCode: string | null;
        phoneNumber: string | null;
        email: string | null;
        website: string | null;
        tenantId: string;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    list(tenantId?: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityType: string;
        licenseNumber: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        emirate: string | null;
        postalCode: string | null;
        phoneNumber: string | null;
        email: string | null;
        website: string | null;
        tenantId: string;
    }[]>;
    get(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityType: string;
        licenseNumber: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        emirate: string | null;
        postalCode: string | null;
        phoneNumber: string | null;
        email: string | null;
        website: string | null;
        tenantId: string;
    }>;
    update(id: string, dto: UpdateFacilityDto): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        facilityType: string;
        licenseNumber: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        emirate: string | null;
        postalCode: string | null;
        phoneNumber: string | null;
        email: string | null;
        website: string | null;
        tenantId: string;
    }>;
    remove(id: string): Promise<void>;
    getFacilitySpecialties(facilityId: string, locale?: string): Promise<{
        specialty: {
            id: any;
            code: any;
            name: any;
            localizedName: string;
            authorityCodes: any;
        };
        staffCount: any;
        staff: any;
    }[]>;
}
//# sourceMappingURL=facility.controller.d.ts.map