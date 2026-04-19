import { IsUUID, IsString, IsOptional } from 'class-validator';

export class AssignBedDto {
  @IsUUID("all")
  patientId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
