import { UserFacilityRepository } from './user-facility.repository';
import { AssignFacilityDto } from './dto/assign-facility.dto';
import { SetDefaultFacilityDto } from './dto/set-default-facility.dto';
import { PrismaService } from '@zeal/database-foundation';
export declare class UserFacilityService {
    private readonly userFacilityRepo;
    private readonly prisma;
    constructor(userFacilityRepo: UserFacilityRepository, prisma: PrismaService);
    /**
     * Get all facilities for a user
     */
    getUserFacilities(userId: string): Promise<{
        defaultFacility: {
            id: string;
            name: string;
            facilityType: string;
            accessLevel: string;
        } | null;
        facilities: {
            id: string;
            name: string;
            facilityType: string;
            city: string | null;
            emirate: string | null;
            accessLevel: string;
            isDefault: boolean;
            grantedAt: Date;
        }[];
    }>;
    /**
     * Assign facility access to user
     */
    assignFacility(userId: string, dto: AssignFacilityDto, grantedBy?: string): Promise<{
        success: boolean;
        facilityAccess: {
            facilityId: string;
            facilityName: any;
            accessLevel: string;
            isDefault: boolean;
            grantedAt: Date;
        };
    }>;
    /**
     * Set default facility for user
     */
    setDefaultFacility(userId: string, dto: SetDefaultFacilityDto): Promise<{
        success: boolean;
        defaultFacility: {
            id: string;
            name: string;
            facilityType: string;
        };
    }>;
    /**
     * Revoke facility access for user
     */
    revokeFacility(userId: string, facilityId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Check if user has access to facility
     */
    hasAccessToFacility(userId: string, facilityId: string): Promise<boolean>;
    /**
     * Get all users with access to a facility
     */
    getFacilityUsers(facilityId: string): Promise<{
        facilityId: string;
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            accessLevel: string;
            isDefault: boolean;
            grantedAt: Date;
        }[];
    }>;
}
//# sourceMappingURL=user-facility.service.d.ts.map