/**
 * DTO for searching encounters
 */
import { EncounterStatus, EncounterClass } from './create-encounter.dto';
export declare class SearchEncounterDto {
    patientId?: string;
    primaryStaffId?: string;
    facilityId?: string;
    status?: EncounterStatus;
    encounterClass?: EncounterClass;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=search-encounter.dto.d.ts.map