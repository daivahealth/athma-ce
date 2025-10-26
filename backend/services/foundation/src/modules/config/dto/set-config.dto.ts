import { IsNotEmpty, IsString, IsJSON, IsOptional } from 'class-validator';

export class SetConfigDto {
  @IsNotEmpty()
  value: any;

  @IsOptional()
  @IsString()
  changeReason?: string;
}
