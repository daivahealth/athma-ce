import { FacilityService } from './facility.service';
export declare class FacilityController {
    private readonly facilityService;
    constructor(facilityService: FacilityService);
    createFacility(createFacilityDto: any): Promise<any>;
    getFacilities(query: any): Promise<any>;
    getFacility(id: string): Promise<any>;
    updateFacility(id: string, updateFacilityDto: any): Promise<any>;
    deleteFacility(id: string): Promise<void>;
    getFacilitySpaces(id: string, query: any): Promise<any>;
    getFacilityStaff(id: string, query: any): Promise<any>;
    getFacilitySchedule(id: string, query: any): Promise<any>;
}
//# sourceMappingURL=facility.controller.d.ts.map