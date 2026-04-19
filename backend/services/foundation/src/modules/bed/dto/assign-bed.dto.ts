import { IsUUID, IsString, IsOptional } from 'class-validator';

export class AssignBedDto {
  @IsUUID("loose" as any)
  patientId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
