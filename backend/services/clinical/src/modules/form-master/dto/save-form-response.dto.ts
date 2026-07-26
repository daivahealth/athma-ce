import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { FormResponseStatus } from '@zeal/database-clinical';

export class SaveFormResponseDto {
  // The renderer's onChange payload, keyed by dataSchema paths.
  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsEnum(FormResponseStatus)
  status?: FormResponseStatus;
}
