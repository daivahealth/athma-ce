import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListProviderCallbacksQueryDto {
  @ApiPropertyOptional({ description: 'Filter by channel' })
  @IsOptional()
  @IsString()
  channel?: string;

  /**
   * Kept as a 'true' / 'false' string: implicit conversion would turn the
   * string 'false' into boolean true.
   */
  @ApiPropertyOptional({ description: 'Filter by processed flag', enum: ['true', 'false'] })
  @IsOptional()
  @IsIn(['true', 'false'])
  processed?: 'true' | 'false';

  @ApiPropertyOptional({ description: 'Max results', default: 50, maximum: 200 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset for pagination', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
