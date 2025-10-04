export let StaffService: {
    new (staffRepository: any): {
        staffRepository: any;
        createStaff(createStaffDto: any): Promise<any>;
        getStaff(query: any): Promise<any>;
        getStaffById(id: any): Promise<any>;
        updateStaff(id: any, updateStaffDto: any): Promise<any>;
        deleteStaff(id: any): Promise<void>;
        getStaffAvailability(id: any, query: any): Promise<any>;
        getStaffSchedule(id: any, query: any): Promise<any>;
    };
};
//# sourceMappingURL=staff.service.d.ts.map