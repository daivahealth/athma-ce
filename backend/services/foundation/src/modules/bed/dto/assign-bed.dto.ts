import { IsUUID, IsString, IsOptional } from 'class-validator';

export class AssignBedDto {
  @IsUUID()
  patientId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
