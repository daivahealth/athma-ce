export declare enum OrderType {
    LAB = "lab",
    IMAGING = "imaging",
    PROCEDURE = "procedure"
}
export declare enum OrderPriority {
    STAT = "stat",
    URGENT = "urgent",
    ROUTINE = "routine"
}
export declare enum OrderStatus {
    ORDERED = "ordered",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum ResultStatus {
    PENDING = "pending",
    PRELIMINARY = "preliminary",
    FINAL = "final",
    AMENDED = "amended"
}
export declare enum CodeSystem {
    LOINC = "LOINC",
    CPT = "CPT",
    SNOMED = "SNOMED"
}
export declare class CreateClinicalOrderDto {
    encounterId: string;
    patientId: string;
    orderType: OrderType;
    orderCode: string;
    codeSystem: CodeSystem;
    orderName: string;
    orderNameAr?: string;
    priority?: OrderPriority;
    clinicalIndication?: string;
    specialInstructions?: string;
    orderedBy: string;
}
export declare class UpdateClinicalOrderDto {
    priority?: OrderPriority;
    status?: OrderStatus;
    clinicalIndication?: string;
    specialInstructions?: string;
}
export declare class AddOrderResultDto {
    resultStatus: ResultStatus;
    resultData: Record<string, any>;
    resultNotes?: string;
    performedBy?: string;
    performedAt?: string;
}
export declare class ClinicalOrderResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    orderType: OrderType;
    orderCode: string;
    codeSystem: CodeSystem;
    orderName: string;
    orderNameAr?: string;
    priority: OrderPriority;
    status: OrderStatus;
    clinicalIndication?: string;
    specialInstructions?: string;
    resultStatus?: ResultStatus;
    resultData?: Record<string, any>;
    resultNotes?: string;
    resultedAt?: Date;
    orderedBy: string;
    orderedAt: Date;
    performedBy?: string;
    performedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=clinical-order.dto.d.ts.map