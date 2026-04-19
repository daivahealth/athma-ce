import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum StockMovementType {
  RECEIVE = 'receive',
  DISPENSE = 'dispense',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  EXPIRE = 'expire',
  RECALL = 'recall',
  WRITE_OFF = 'write_off',
}

export class StockMovementFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by movement type', enum: StockMovementType })
  @IsString()
  @IsOptional()
  movementType?: string;

  @ApiPropertyOptional({ description: 'Filter movements from this date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter movements to this date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by performer (staff UUID)' })
  @IsUUID("all")
  @IsOptional()
  performedBy?: string;
}
