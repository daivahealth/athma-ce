/**
 * Schedule DTOs
 */
export declare class CreateStaffScheduleDto {
    staffId: string;
    facilityId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    scheduleType?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export declare class UpdateStaffScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    scheduleType?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export declare class CreateEquipmentScheduleDto {
    equipmentId: string;
    facilityId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    maintenanceType?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export declare class UpdateEquipmentScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    maintenanceType?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export declare class CreateSpaceScheduleDto {
    spaceId: string;
    facilityId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    blockReason?: string;
    notes?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
}
export declare class UpdateSpaceScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    blockReason?: string;
    notes?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export declare class CreateResourceBlockDto {
    resourceType: 'staff' | 'equipment' | 'space';
    resourceId: string;
    facilityId?: string;
    blockType: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';
    startDatetime: Date;
    endDatetime: Date;
    isAvailable: boolean;
    reason?: string;
}
export declare class UpdateResourceBlockDto {
    blockType?: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';
    startDatetime?: Date;
    endDatetime?: Date;
    isAvailable?: boolean;
    reason?: string;
}
export declare class RejectResourceBlockDto {
    reason: string;
}
export declare class CreateWeeklyScheduleDto {
    staffId: string;
    days: number[];
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    scheduleType?: string;
    facilityId?: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    notes?: string;
}
//# sourceMappingURL=schedule.dto.d.ts.map