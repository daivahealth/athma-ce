import { IsString, IsUUID } from 'class-validator';

export class CreateFormResponseDto {
  @IsUUID()
  formMasterId!: string;

  @IsUUID()
  patientId!: string;

  @IsUUID()
  encounterId!: string;
}
