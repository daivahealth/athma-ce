import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { FixedWindowLimiter } from '../../common/rate-limit/fixed-window-limiter';
import {
  ACCESS_REQUEST_STATUSES,
  type AccessRequestStatus,
  type CreateAccessRequestDto,
  type UpdateAccessRequestDto,
} from './dto/access-request.dto';

export class AccessRequestRateLimitedError extends Error {}

/**
 * Production access requests from the public site. Instance-wide data, not
 * tenant data. See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
@Injectable()
export class AccessRequestService {
  private readonly logger = new Logger(AccessRequestService.name);
  private readonly perIp = new FixedWindowLimiter(5, 60 * 60_000);
  private readonly perEmail = new FixedWindowLimiter(3, 24 * 60 * 60_000);

  constructor(private readonly prisma: PrismaService) {}

  /** Stores a request. Returns false when it was dropped (honeypot). */
  async submit(dto: CreateAccessRequestDto, ip: string): Promise<boolean> {
    if (dto.website) {
      this.logger.warn('Dropped access request with honeypot field filled');
      return false;
    }
    if (!this.perIp.take(ip) || !this.perEmail.take(dto.email)) {
      throw new AccessRequestRateLimitedError();
    }
    const created = await this.prisma.accessRequest.create({
      data: {
        organisationName: dto.organisationName,
        organisationType: dto.organisationType,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone ?? null,
        country: dto.country,
        facilityCount: dto.facilityCount ?? null,
        bedCount: dto.bedCount ?? null,
        modules: Array.from(new Set(dto.modules ?? [])),
        message: dto.message ?? null,
      },
      select: { id: true },
    });
    this.logger.log(`New access request ${created.id} (${dto.organisationType}, ${dto.country})`);
    return true;
  }

  async list(status?: AccessRequestStatus) {
    const [data, grouped] = await Promise.all([
      this.prisma.accessRequest.findMany({
        where: status ? { status } : {},
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      this.prisma.accessRequest.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);
    const counts = Object.fromEntries(ACCESS_REQUEST_STATUSES.map((s) => [s, 0])) as Record<AccessRequestStatus, number>;
    for (const row of grouped) {
      if ((ACCESS_REQUEST_STATUSES as readonly string[]).includes(row.status)) {
        counts[row.status as AccessRequestStatus] = row._count._all;
      }
    }
    return { data, counts };
  }

  async update(id: string, dto: UpdateAccessRequestDto, reviewerId: string | undefined) {
    const existing = await this.prisma.accessRequest.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Access request not found');
    return this.prisma.accessRequest.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.adminNotes !== undefined ? { adminNotes: dto.adminNotes } : {}),
        reviewedAt: new Date(),
        reviewedBy: reviewerId ?? null,
      },
    });
  }
}
