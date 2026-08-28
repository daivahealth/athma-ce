import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLoadStatusDto {
  @IsIn(['active', 'error'])
  status!: 'active' | 'error';

  /** Truncated load/init error detail when status is 'error'. */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  error?: string;
}
