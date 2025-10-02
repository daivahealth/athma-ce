import { FacilityRepository } from './facility.repository';
export declare class FacilityService {
    private readonly facilityRepository;
    constructor(facilityRepository: FacilityRepository);
    createFacility(createFacilityDto: any): Promise<any>;
    getFacilities(query: any): Promise<any>;
    getFacilityById(id: string): Promise<any>;
    updateFacility(id: string, updateFacilityDto: any): Promise<any>;
    deleteFacility(id: string): Promise<void>;
    getFacilitySpaces(id: string, query: any): Promise<any>;
    getFacilityStaff(id: string, query: any): Promise<any>;
    getFacilitySchedule(id: string, query: any): Promise<any>;
}
//# sourceMappingURL=facility.service.d.ts.map