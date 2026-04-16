import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '@zeal/database-rcm';
import { StockMovementFiltersDto } from '../dto/pharmacy-stock-movement.dto';

@ApiTags('Pharmacy Stock Movements')
@ApiBearerAuth()
@Controller('pharmacy/movements')
export class PharmacyStockMovementController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all stock movements (global audit log)' })
  @ApiQuery({ name: 'movementType', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'performedBy', required: false })
  @ApiResponse({ status: 200, description: 'Movement list returned' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query() filters: StockMovementFiltersDto,
  ) {
    const where: any = { tenantId };

    if (filters.movementType) where.movementType = filters.movementType;
    if (filters.performedBy) where.performedBy = filters.performedBy;

    if (filters.dateFrom || filters.dateTo) {
      where.performedAt = {};
      if (filters.dateFrom) where.performedAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.performedAt.lte = new Date(filters.dateTo);
    }

    return this.prisma.pharmacyStockMovement.findMany({
      where,
      include: { stock: { select: { drugName: true, batchNumber: true, drugCode: true } } },
      orderBy: { performedAt: 'desc' },
      take: 500,
    });
  }

  @Get('stock/:stockId')
  @ApiOperation({ summary: 'List all movements for a specific stock batch' })
  @ApiResponse({ status: 200, description: 'Movement log returned' })
  async findByStock(
    @Headers('x-tenant-id') tenantId: string,
    @Param('stockId') stockId: string,
  ) {
    return this.prisma.pharmacyStockMovement.findMany({
      where: { tenantId, stockId },
      orderBy: { performedAt: 'desc' },
    });
  }
}
