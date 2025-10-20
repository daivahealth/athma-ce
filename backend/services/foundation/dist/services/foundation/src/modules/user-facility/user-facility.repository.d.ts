import { PrismaService } from '@zeal/database-foundation';
export declare class UserFacilityRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Get all facilities for a user (excluding revoked access)
     */
    getUserFacilities(userId: string): Promise<({
        facility: {
            id: string;
            name: string;
            status: string;
            facilityType: string;
            city: string | null;
            emirate: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    })[]>;
    /**
     * Get user's default facility
     */
    getDefaultFacility(userId: string): Promise<({
        facility: {
            id: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            facilityType: string;
            licenseNumber: string | null;
            addressLine1: string | null;
            addressLine2: string | null;
            city: string | null;
            emirate: string | null;
            postalCode: string | null;
            country: string;
            latitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            longitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            googlePlaceId: string | null;
            phoneNumber: string | null;
            email: string | null;
            website: string | null;
            buildingNumber: string | null;
            floorNumbers: string[];
            totalFloors: number | null;
            capacity: number | null;
            operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    }) | null>;
    /**
     * Check if user has access to a facility
     */
    hasAccessToFacility(userId: string, facilityId: string): Promise<boolean>;
    /**
     * Assign facility access to user
     */
    assignFacility(data: {
        userId: string;
        facilityId: string;
        accessLevel: string;
        grantedBy?: string;
        setAsDefault?: boolean;
    }): Promise<{
        facility: {
            id: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            facilityType: string;
            licenseNumber: string | null;
            addressLine1: string | null;
            addressLine2: string | null;
            city: string | null;
            emirate: string | null;
            postalCode: string | null;
            country: string;
            latitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            longitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            googlePlaceId: string | null;
            phoneNumber: string | null;
            email: string | null;
            website: string | null;
            buildingNumber: string | null;
            floorNumbers: string[];
            totalFloors: number | null;
            capacity: number | null;
            operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    }>;
    /**
     * Set a facility as default for user
     */
    setDefaultFacility(userId: string, facilityId: string): Promise<({
        facility: {
            id: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            facilityType: string;
            licenseNumber: string | null;
            addressLine1: string | null;
            addressLine2: string | null;
            city: string | null;
            emirate: string | null;
            postalCode: string | null;
            country: string;
            latitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            longitude: import("@zeal/database-foundation/generated/runtime/library").Decimal | null;
            googlePlaceId: string | null;
            phoneNumber: string | null;
            email: string | null;
            website: string | null;
            buildingNumber: string | null;
            floorNumbers: string[];
            totalFloors: number | null;
            capacity: number | null;
            operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    }) | null>;
    /**
     * Revoke facility access for user
     */
    revokeFacility(userId: string, facilityId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    }>;
    /**
     * Get all users with access to a facility
     */
    getFacilityUsers(facilityId: string): Promise<({
        user: {
            id: string;
            status: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        userId: string;
        isDefault: boolean;
        accessLevel: string;
        grantedAt: Date;
        grantedBy: string | null;
        revokedAt: Date | null;
    })[]>;
}
//# sourceMappingURL=user-facility.repository.d.ts.map