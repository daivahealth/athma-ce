import { IsUUID } from 'class-validator';

export class ValidateBedDto {
  @IsUUID()
  bedId!: string;
}
