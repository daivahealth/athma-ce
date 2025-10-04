export let FacilityService: {
    new (facilityRepository: any): {
        facilityRepository: any;
        createFacility(createFacilityDto: any): Promise<any>;
        getFacilities(query: any): Promise<any>;
        getFacilityById(id: any): Promise<any>;
        updateFacility(id: any, updateFacilityDto: any): Promise<any>;
        deleteFacility(id: any): Promise<void>;
        getFacilitySpaces(id: any, query: any): Promise<any>;
        getFacilityStaff(id: any, query: any): Promise<any>;
        getFacilitySchedule(id: any, query: any): Promise<any>;
    };
};
//# sourceMappingURL=facility.service.d.ts.map