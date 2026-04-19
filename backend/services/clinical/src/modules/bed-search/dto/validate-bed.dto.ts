import { IsUUID } from 'class-validator';

export class ValidateBedDto {
  @IsUUID("loose" as any)
  bedId!: string;
}
