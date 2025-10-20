export declare enum StaffType {
    DOCTOR = "doctor",
    NURSE = "nurse",
    TECHNICIAN = "technician",
    SUPPORT = "support"
}
export declare class SearchStaffBySpecialtyDto {
    specialtyCode?: string;
    specialtyId?: string;
    staffType?: StaffType;
    primaryOnly?: boolean;
    activeOnly?: boolean;
    facilityId?: string;
    locale?: string;
}
//# sourceMappingURL=search-staff.dto.d.ts.map