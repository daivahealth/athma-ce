export declare enum DepartmentType {
    OPD = "opd",
    IPD = "ipd",
    RADIOLOGY = "radiology",
    LABORATORY = "laboratory",
    SURGERY = "surgery",
    EMERGENCY = "emergency",
    PHARMACY = "pharmacy"
}
export declare class CreateDepartmentDto {
    name: string;
    code?: string;
    departmentType: DepartmentType;
    headOfDepartment?: string;
    floorNumber?: string;
    phoneExtension?: string;
    operatingHours?: Record<string, any>;
    status?: string;
}
//# sourceMappingURL=create-department.dto.d.ts.map