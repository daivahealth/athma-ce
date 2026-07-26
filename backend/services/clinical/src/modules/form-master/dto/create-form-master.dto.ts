import { IsString, IsEnum, IsOptional, IsInt, IsObject, Min } from 'class-validator';
import { FrequencyType, FrequencyUnit } from '@zeal/database-clinical';

export class CreateFormMasterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsEnum(FrequencyType)
  frequencyType!: FrequencyType;

  @IsOptional()
  @IsInt()
  @Min(1)
  frequencyValue?: number;

  @IsOptional()
  @IsEnum(FrequencyUnit)
  frequencyUnit?: FrequencyUnit;

  // The full OpenMedForm export bundle: { formCode, version, engine, name, language,
  // dataSchema, uiSchema, printSchema?, translations?, assets? }. Validated for the
  // required shape in the service rather than field-by-field here, since it's an
  // opaque third-party document.
  @IsObject()
  bundle!: Record<string, any>;
}
