import { IsString, IsNotEmpty } from 'class-validator';

export class SaveChecklistResponseDto {
  @IsString()
  @IsNotEmpty()
  templateItemId!: string;

  @IsNotEmpty()
  value: any;
}

export class BulkSaveChecklistResponseDto {
  @IsNotEmpty()
  responses!: SaveChecklistResponseDto[];
}
