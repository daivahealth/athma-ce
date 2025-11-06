/**
 * DTO for updating an encounter
 */
import { CreateEncounterDto } from './create-encounter.dto';
declare const UpdateEncounterDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEncounterDto>>;
export declare class UpdateEncounterDto extends UpdateEncounterDto_base {
    dischargeDisposition?: string;
    followUpInstructions?: string;
}
export {};
//# sourceMappingURL=update-encounter.dto.d.ts.map