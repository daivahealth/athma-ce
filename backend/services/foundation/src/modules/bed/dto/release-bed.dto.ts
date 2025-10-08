import { IsString, IsOptional } from 'class-validator';

export class ReleaseBedDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
