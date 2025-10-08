export declare enum FacilityAccessLevel {
    STANDARD = "standard",
    ADMIN = "admin",
    READ_ONLY = "read_only"
}
export declare class AssignFacilityDto {
    facilityId: string;
    accessLevel?: FacilityAccessLevel;
    setAsDefault?: boolean;
}
//# sourceMappingURL=assign-facility.dto.d.ts.map