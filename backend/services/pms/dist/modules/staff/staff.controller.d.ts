import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    createStaff(createStaffDto: any): Promise<any>;
    getStaff(query: any): Promise<any>;
    getStaffById(id: string): Promise<any>;
    updateStaff(id: string, updateStaffDto: any): Promise<any>;
    deleteStaff(id: string): Promise<void>;
    getStaffAvailability(id: string, query: any): Promise<any>;
    getStaffSchedule(id: string, query: any): Promise<any>;
}
//# sourceMappingURL=staff.controller.d.ts.map