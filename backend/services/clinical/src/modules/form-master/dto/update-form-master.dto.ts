import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { FormMasterStatus, FrequencyType, FrequencyUnit } from '@zeal/database-clinical';

export class UpdateFormMasterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(FormMasterStatus)
  status?: FormMasterStatus;

  @IsOptional()
  @IsEnum(FrequencyType)
  frequencyType?: FrequencyType;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequencyValue?: number;

  @IsOptional()
  @IsEnum(FrequencyUnit)
  frequencyUnit?: FrequencyUnit;
}
