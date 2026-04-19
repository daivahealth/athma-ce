import { IsUUID } from 'class-validator';

export class ValidateBedDto {
  @IsUUID("all")
  bedId!: string;
}
