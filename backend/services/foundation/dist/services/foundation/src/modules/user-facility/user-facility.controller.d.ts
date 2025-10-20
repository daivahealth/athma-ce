import { UserFacilityService } from './user-facility.service';
import { AssignFacilityDto } from './dto/assign-facility.dto';
import { SetDefaultFacilityDto } from './dto/set-default-facility.dto';
export declare class UserFacilityController {
    private readonly userFacilityService;
    constructor(userFacilityService: UserFacilityService);
    getUserFacilities(userId: string, tenantId?: string): Promise<{
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
    assignFacility(userId: string, dto: AssignFacilityDto, req: any): Promise<{
        success: boolean;
        facilityAccess: {
            facilityId: string;
            facilityName: any;
            accessLevel: string;
            isDefault: boolean;
            grantedAt: Date;
        };
    }>;
    setDefaultFacility(userId: string, dto: SetDefaultFacilityDto): Promise<{
        success: boolean;
        defaultFacility: {
            id: string;
            name: string;
            facilityType: string;
        };
    }>;
    revokeFacility(userId: string, facilityId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkAccess(userId: string, facilityId: string): Promise<{
        userId: string;
        facilityId: string;
        hasAccess: boolean;
    }>;
}
export declare class FacilityUsersController {
    private readonly userFacilityService;
    constructor(userFacilityService: UserFacilityService);
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
//# sourceMappingURL=user-facility.controller.d.ts.map