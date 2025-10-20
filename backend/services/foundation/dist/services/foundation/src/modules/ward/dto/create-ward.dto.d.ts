export declare enum WardType {
    GENERAL = "general",
    ICU = "icu",
    NICU = "nicu",
    PICU = "picu",
    ISOLATION = "isolation",
    MATERNITY = "maternity"
}
export declare class CreateWardDto {
    name: string;
    code?: string;
    wardType: WardType;
    floorNumber?: string;
    totalBeds?: number;
    nursingStation?: string;
    status?: string;
}
//# sourceMappingURL=create-ward.dto.d.ts.map