import { StaffRepository } from './staff.repository';
export declare class StaffService {
    private readonly staffRepository;
    constructor(staffRepository: StaffRepository);
    createStaff(createStaffDto: any): Promise<any>;
    getStaff(query: any): Promise<any>;
    getStaffById(id: string): Promise<any>;
    updateStaff(id: string, updateStaffDto: any): Promise<any>;
    deleteStaff(id: string): Promise<void>;
    getStaffAvailability(id: string, query: any): Promise<any>;
    getStaffSchedule(id: string, query: any): Promise<any>;
}
//# sourceMappingURL=staff.service.d.ts.map