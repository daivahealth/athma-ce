export let FacilityController: {
    new (facilityService: any): {
        facilityService: any;
        createFacility(createFacilityDto: any): Promise<any>;
        getFacilities(query: any): Promise<any>;
        getFacility(id: any): Promise<any>;
        updateFacility(id: any, updateFacilityDto: any): Promise<any>;
        deleteFacility(id: any): Promise<any>;
        getFacilitySpaces(id: any, query: any): Promise<any>;
        getFacilityStaff(id: any, query: any): Promise<any>;
        getFacilitySchedule(id: any, query: any): Promise<any>;
    };
};
//# sourceMappingURL=facility.controller.d.ts.map