export declare enum BedType {
    STANDARD = "standard",
    ICU = "icu",
    ISOLATION = "isolation",
    PRIVATE = "private",
    SEMI_PRIVATE = "semi_private"
}
export declare enum BedStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance",
    RESERVED = "reserved"
}
export declare class CreateBedDto {
    bedNumber: string;
    bedType: BedType;
    features?: Record<string, any>;
    status?: BedStatus;
}
//# sourceMappingURL=create-bed.dto.d.ts.map