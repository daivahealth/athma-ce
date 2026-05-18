import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetOtBoardDto {
  @ApiPropertyOptional({
    description: 'Board date in YYYY-MM-DD format. Defaults to today when omitted.',
    example: '2026-05-15',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}
