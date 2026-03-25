import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '@zeal/database-clinical';

@ApiTags('Observation Catalog')
@ApiBearerAuth()
@Controller('observation-catalog')
export class ObservationCatalogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List observation codes, optionally filtered by category' })
  async list(
    @Headers('x-tenant-id') tenantId: string,
    @Query('category') category?: string,
  ) {
    return this.prisma.observationCodeCatalog.findMany({
      where: {
        isActive: true,
        OR: [{ tenantId }, { tenantId: null }],
        ...(category ? { category } : {}),
      },
      orderBy: [{ category: 'asc' }, { displayName: 'asc' }],
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search observation codes by name or code (autocomplete)' })
  async search(
    @Headers('x-tenant-id') tenantId: string,
    @Query('q') q: string,
  ) {
    if (!q || q.length < 2) {
      return [];
    }

    return this.prisma.observationCodeCatalog.findMany({
      where: {
        isActive: true,
        OR: [
          {
            tenantId,
            displayName: { contains: q, mode: 'insensitive' },
          },
          {
            tenantId: null,
            displayName: { contains: q, mode: 'insensitive' },
          },
          {
            tenantId,
            code: { startsWith: q, mode: 'insensitive' },
          },
          {
            tenantId: null,
            code: { startsWith: q, mode: 'insensitive' },
          },
        ],
      },
      take: 20,
      orderBy: { displayName: 'asc' },
    });
  }
}
