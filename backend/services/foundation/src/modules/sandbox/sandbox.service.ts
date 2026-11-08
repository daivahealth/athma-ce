import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import {
  copyTenantSetup,
  purgeTenantData,
  type TransactionalSqlClient,
} from '@zeal/shared-utils';
import { createHash, randomBytes, randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import { AuthService } from '../auth/services/auth.service';
import type { CreateSandboxDto } from './dto/sandbox.dto';
import {
  FOUNDATION_SETUP_TABLES,
  readSandboxSettings,
  resolveModules,
  SANDBOX_MODULE_FLAGS,
  SANDBOX_MODULES,
  SANDBOX_OWNER_ROLE,
  SANDBOX_REMOVED_ROLES,
  type SandboxSettings,
} from './sandbox.settings';

/**
 * Self-serve sandbox tenants (ADR-0017). A signed-in visitor (external
 * identity) gets one tenant copied from the template (demo) tenant's setup,
 * becomes its administrator, and switches between it and the demo hospital.
 *
 * Provisioning and removal run one at a time in this process (the demo runs
 * a single foundation instance). See docs/features/SANDBOX-TENANTS.md.
 */

export type SandboxStatus = 'provisioning' | 'active' | 'failed' | 'expired' | 'deleting' | 'deleted';
const LIVE: SandboxStatus[] = ['provisioning', 'active'];
const SWEEP_INTERVAL_MS = 15 * 60_000;
const STUCK_AFTER_MS = 60 * 60_000;
/** Access tokens live 1 hour (JWT_EXPIRY default); purge deleted sandboxes again in this window. */
const LATE_PURGE_AFTER_MS = 65 * 60_000;
const LATE_PURGE_UNTIL_MS = 100 * 60_000;
const DAY_MS = 24 * 60 * 60_000;

interface Owner {
  provider: string;
  subject: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  termsVersion: string | null;
}

type SandboxRow = Awaited<ReturnType<PrismaService['sandbox']['findFirst']>> & {};

export interface SandboxView {
  id: string;
  tenantId: string;
  organisationName: string;
  organisationType: string;
  modules: string[];
  status: string;
  createdAt: Date;
  activatedAt: Date | null;
  expiresAt: Date | null;
  canExtend: boolean;
  failed: boolean;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function splitName(displayName: string | null): { firstName: string; lastName: string } {
  const parts = (displayName ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Sandbox', lastName: 'Owner' };
  if (parts.length === 1) return { firstName: parts[0]!.slice(0, 100), lastName: 'Owner' };
  return { firstName: parts.slice(0, -1).join(' ').slice(0, 100), lastName: parts[parts.length - 1]!.slice(0, 100) };
}

@Injectable()
export class SandboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SandboxService.name);
  private readonly settings: SandboxSettings = readSandboxSettings();
  private queue: Promise<void> = Promise.resolve();
  private sweepTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  onModuleInit(): void {
    if (!this.settings.enabled) return;
    if (!this.settings.isolationReady) {
      this.logger.error(
        'SANDBOX_ENABLED=true but AUTH_REQUIRE_TOKEN_FOR_WRITES/READS are not both on: sandbox creation is refused until they are.',
      );
    }
    this.sweepTimer = setInterval(() => void this.sweep(), SWEEP_INTERVAL_MS);
    this.sweepTimer.unref();
    setTimeout(() => void this.sweep(), 30_000).unref();
  }

  onModuleDestroy(): void {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
  }

  // ---------------------------------------------------------------- views

  view(row: NonNullable<SandboxRow>): SandboxView {
    return {
      id: row.id,
      tenantId: row.tenantId,
      organisationName: row.organisationName,
      organisationType: row.organisationType,
      modules: row.modules,
      status: row.status,
      createdAt: row.createdAt,
      activatedAt: row.activatedAt,
      expiresAt: row.expiresAt,
      canExtend: row.status === 'active' && !row.extendedAt,
      failed: row.status === 'failed',
    };
  }

  private available(): { available: boolean; reason?: string } {
    if (!this.settings.enabled) return { available: false, reason: 'disabled' };
    if (!this.settings.isolationReady || !this.settings.templateTenantId || !this.settings.internalApiKey) {
      return { available: false, reason: 'not_configured' };
    }
    return { available: true };
  }

  private async ownerOf(userId: string): Promise<Owner | null> {
    const identity = await this.prisma.userIdentity.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { provider: true, providerSubject: true, email: true, emailVerified: true, displayName: true, termsVersion: true },
    });
    if (!identity) return null;
    return {
      provider: identity.provider,
      subject: identity.providerSubject,
      email: identity.email,
      emailVerified: identity.emailVerified,
      displayName: identity.displayName,
      termsVersion: identity.termsVersion ?? null,
    };
  }

  private liveSandboxOf(owner: Owner) {
    return this.prisma.sandbox.findFirst({
      where: { ownerProvider: owner.provider, ownerSubject: owner.subject, status: { in: LIVE } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** What the signed-in user can do: whether sandboxes are offered, and their sandbox if any. */
  async status(userId: string, tenantId: string) {
    const availability = this.available();
    const owner = await this.ownerOf(userId);
    const live = owner ? await this.liveSandboxOf(owner) : null;
    const latestFailed =
      owner && !live
        ? await this.prisma.sandbox.findFirst({
            where: { ownerProvider: owner.provider, ownerSubject: owner.subject, status: 'failed' },
            orderBy: { createdAt: 'desc' },
          })
        : null;
    return {
      ...availability,
      eligible: !!owner,
      inSandbox: !!live && live.tenantId === tenantId,
      sandbox: live ? this.view(live) : latestFailed ? this.view(latestFailed) : null,
      limits: { lifetimeDays: this.settings.lifetimeDays, extensionDays: this.settings.extensionDays },
    };
  }

  // ---------------------------------------------------------------- create

  async create(userId: string, dto: CreateSandboxDto): Promise<SandboxView> {
    const availability = this.available();
    if (!availability.available) {
      throw new ServiceUnavailableException({ code: 'SANDBOX_UNAVAILABLE', message: 'Sandboxes are not available on this instance.' });
    }
    const owner = await this.ownerOf(userId);
    if (!owner) {
      throw new ForbiddenException({
        code: 'EXTERNAL_SIGN_IN_REQUIRED',
        message: 'Sign in with Google, Microsoft or GitHub to create a sandbox.',
      });
    }
    const existing = await this.liveSandboxOf(owner);
    if (existing) {
      throw new ConflictException({ code: 'SANDBOX_EXISTS', message: 'You already have a sandbox.', sandbox: this.view(existing) });
    }
    const recent = await this.prisma.sandbox.count({
      where: { ownerProvider: owner.provider, ownerSubject: owner.subject, createdAt: { gt: new Date(Date.now() - DAY_MS) } },
    });
    if (recent >= this.settings.maxCreatesPerOwnerPerDay) {
      throw new HttpException(
        { code: 'SANDBOX_RATE_LIMITED', message: 'Too many sandboxes created today. Try again tomorrow.' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const live = await this.prisma.sandbox.count({ where: { status: { in: LIVE } } });
    if (live >= this.settings.maxActive) {
      throw new ServiceUnavailableException({
        code: 'SANDBOX_CAPACITY',
        message: 'All sandboxes are in use right now. Try again later, or request production access.',
      });
    }

    const modules = resolveModules(dto.organisationType, dto.modules);
    const tenantId = randomUUID();
    const short = tenantId.slice(0, 8);

    let sandbox: NonNullable<SandboxRow>;
    try {
      sandbox = await this.prisma.$transaction(async (tx) => {
        await tx.tenant.create({
          data: {
            id: tenantId,
            name: `${dto.organisationName} (sandbox ${short})`,
            domain: `${short}.sandbox.athma.invalid`,
            status: 'active',
            settings: { sandbox: { organisationType: dto.organisationType, modules } },
          },
        });
        return tx.sandbox.create({
          data: {
            tenantId,
            ownerProvider: owner.provider,
            ownerSubject: owner.subject,
            ownerEmail: owner.email,
            ownerName: owner.displayName,
            organisationName: dto.organisationName,
            organisationType: dto.organisationType,
            modules,
            status: 'provisioning',
          },
        });
      });
    } catch (error) {
      // sandboxes_one_live_per_owner: a concurrent request won the race.
      const raced = await this.liveSandboxOf(owner);
      if (raced) throw new ConflictException({ code: 'SANDBOX_EXISTS', message: 'You already have a sandbox.', sandbox: this.view(raced) });
      throw error;
    }

    this.logger.log(`Sandbox ${sandbox.id} (tenant ${tenantId}) requested by ${owner.provider} identity`);
    this.enqueue(() => this.provision(sandbox.id));
    return this.view(sandbox);
  }

  private enqueue(job: () => Promise<void>): void {
    this.queue = this.queue.then(job).catch((error) => {
      this.logger.error(`Sandbox job failed: ${error instanceof Error ? error.stack : String(error)}`);
    });
  }

  /** For tests: resolves when queued jobs have run. */
  idle(): Promise<void> {
    return this.queue;
  }

  private async callService(url: string, tenantId: string, body: unknown): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': this.settings.internalApiKey ?? '',
        'x-tenant-id': tenantId,
        'x-service-name': 'foundation',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5 * 60_000),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`${url} answered ${response.status}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
  }

  private serviceUrls() {
    return {
      clinical: `${this.settings.clinicalUrl}/api/v1/internal/tenant-setup`,
      rcm: `${this.settings.rcmUrl}/api/v1/internal/tenant-setup`,
      prm: `${this.settings.prmUrl}/v1/internal/tenant-setup`,
    };
  }

  private async provision(sandboxId: string): Promise<void> {
    const sandbox = await this.prisma.sandbox.findUnique({ where: { id: sandboxId } });
    if (!sandbox || sandbox.status !== 'provisioning') return;
    const tenantId = sandbox.tenantId;
    const started = Date.now();
    const urls = this.serviceUrls();

    try {
      const foundation = await copyTenantSetup(this.prisma as unknown as TransactionalSqlClient, {
        sourceTenantId: this.settings.templateTenantId!,
        targetTenantId: tenantId,
        tables: FOUNDATION_SETUP_TABLES,
      });
      await this.prisma.role.deleteMany({ where: { tenantId, code: { in: SANDBOX_REMOVED_ROLES } } });
      await this.applyModules(tenantId, sandbox.modules);

      const clinical = await this.callService(`${urls.clinical}/copy`, tenantId, {
        targetTenantId: tenantId,
        externalIds: foundation.sourceIds,
      });
      const shared = [...foundation.sourceIds, ...(clinical.sourceIds ?? [])];
      await this.callService(`${urls.rcm}/copy`, tenantId, { targetTenantId: tenantId, externalIds: shared });
      await this.callService(`${urls.prm}/copy`, tenantId, { targetTenantId: tenantId, externalIds: shared });

      await this.createOwnerUser(sandbox);

      const now = new Date();
      await this.prisma.sandbox.update({
        where: { id: sandboxId },
        data: { status: 'active', activatedAt: now, expiresAt: new Date(now.getTime() + this.settings.lifetimeDays * DAY_MS) },
      });
      this.logger.log(`Sandbox ${sandboxId} ready in ${Math.round((Date.now() - started) / 1000)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Sandbox ${sandboxId} provisioning failed: ${message}`);
      await this.prisma.sandbox.update({ where: { id: sandboxId }, data: { status: 'failed', error: message.slice(0, 1000) } });
      await this.removeData(tenantId).catch((cleanup) =>
        this.logger.error(`Cleanup of failed sandbox ${sandboxId} failed: ${cleanup instanceof Error ? cleanup.message : cleanup}`),
      );
    }
  }

  /** Sets the per-tenant navigation switches and the oncology plugin from the chosen modules. */
  private async applyModules(tenantId: string, modules: string[]): Promise<void> {
    for (const module of SANDBOX_MODULES) {
      const enabled = modules.includes(module);
      await this.prisma.tenantConfig.upsert({
        where: { tenantId_configKey: { tenantId, configKey: SANDBOX_MODULE_FLAGS[module] } },
        create: { tenantId, configKey: SANDBOX_MODULE_FLAGS[module], value: enabled },
        update: { value: enabled },
      });
    }
    if (!modules.includes('oncology')) {
      await this.prisma.pluginActivation.updateMany({
        where: { tenantId, plugin: { pluginId: 'oncology' } },
        data: { isEnabled: false, disabledAt: new Date() },
      });
    }
  }

  /** The owner's account in the sandbox: same external identity, tenant admin, own staff record. */
  private async createOwnerUser(sandbox: NonNullable<SandboxRow>): Promise<string> {
    const tenantId = sandbox.tenantId;
    const owner = {
      provider: sandbox.ownerProvider,
      subject: sandbox.ownerSubject,
    };
    const demoIdentity = await this.prisma.userIdentity.findFirst({
      where: { provider: owner.provider, providerSubject: owner.subject },
      orderBy: { createdAt: 'asc' },
    });
    const role = await this.prisma.role.findFirst({ where: { tenantId, code: SANDBOX_OWNER_ROLE }, select: { id: true } });
    if (!role) throw new Error(`Sandbox has no ${SANDBOX_OWNER_ROLE} role; check the template tenant`);
    const facilities = await this.prisma.facility.findMany({ where: { tenantId }, select: { id: true, code: true }, orderBy: { code: 'asc' } });
    const defaultFacility = facilities.find((f) => /^MAIN/i.test(f.code ?? '')) ?? facilities[0];
    const { firstName, lastName } = splitName(sandbox.ownerName);
    const email =
      demoIdentity?.email && demoIdentity.emailVerified
        ? demoIdentity.email
        : `${owner.provider}-${sha256(owner.subject).slice(0, 16)}@visitors.athma.invalid`;
    const passwordHash = await argon2.hash(randomBytes(32).toString('base64url'));

    return this.prisma.$transaction(async (tx) => {
      const staff = await tx.staff.create({
        data: {
          tenantId,
          firstName,
          lastName,
          dateOfBirth: new Date('1985-01-01'),
          gender: 'other',
          nationality: 'IN',
          email: demoIdentity?.email ?? null,
          employeeId: 'SANDBOX-OWNER',
          staffType: 'physician',
          displayName: `Dr ${firstName} ${lastName}`.slice(0, 255),
          status: 'active',
        },
        select: { id: true },
      });
      const user = await tx.user.create({
        data: {
          tenantId,
          email,
          firstName,
          lastName,
          passwordHash,
          role: SANDBOX_OWNER_ROLE,
          status: 'active',
          staffId: staff.id,
          defaultFacilityId: defaultFacility?.id ?? null,
        },
        select: { id: true },
      });
      await tx.userRole.create({ data: { userId: user.id, roleId: role.id, isActive: true } });
      if (facilities.length > 0) {
        await tx.userFacility.createMany({
          data: facilities.map((facility) => ({
            userId: user.id,
            facilityId: facility.id,
            isDefault: facility.id === defaultFacility?.id,
            accessLevel: 'admin',
          })),
        });
      }
      await tx.userIdentity.create({
        data: {
          tenantId,
          userId: user.id,
          provider: owner.provider,
          providerSubject: owner.subject,
          email: demoIdentity?.email ?? null,
          emailVerified: demoIdentity?.emailVerified ?? false,
          displayName: sandbox.ownerName,
          termsVersion: demoIdentity?.termsVersion ?? '2026-11',
          termsAcceptedAt: new Date(),
        },
      });
      return user.id;
    });
  }

  // ---------------------------------------------------------------- switch, extend, delete

  /** Issues a session for the caller's account in their sandbox or in the demo tenant. */
  async switchWorkspace(userId: string, target: 'sandbox' | 'demo') {
    const owner = await this.ownerOf(userId);
    if (!owner) {
      throw new ForbiddenException({ code: 'EXTERNAL_SIGN_IN_REQUIRED', message: 'Only accounts signed in with Google, Microsoft or GitHub can switch.' });
    }
    let tenantId: string | null;
    let sandboxId: string | null = null;
    if (target === 'sandbox') {
      const sandbox = await this.liveSandboxOf(owner);
      if (!sandbox || sandbox.status !== 'active') {
        throw new NotFoundException({ code: 'SANDBOX_NOT_READY', message: 'Your sandbox is not ready.' });
      }
      tenantId = sandbox.tenantId;
      sandboxId = sandbox.id;
    } else {
      tenantId = process.env.PUBLIC_DEMO_TENANT_ID?.trim() || null;
    }
    if (!tenantId) throw new NotFoundException('Workspace not found');

    const identity = await this.prisma.userIdentity.findUnique({
      where: { tenantId_provider_providerSubject: { tenantId, provider: owner.provider, providerSubject: owner.subject } },
      include: { user: { select: { id: true, tenantId: true, status: true } } },
    });
    if (!identity || identity.user.status !== 'active') {
      throw new NotFoundException({ code: 'WORKSPACE_ACCOUNT_MISSING', message: 'You have no account in that workspace.' });
    }
    const now = new Date();
    await this.prisma.userIdentity.update({ where: { id: identity.id }, data: { lastLoginAt: now } });
    await this.prisma.user.update({ where: { id: identity.user.id }, data: { lastLogin: now } });
    if (sandboxId) await this.prisma.sandbox.update({ where: { id: sandboxId }, data: { lastSwitchAt: now } });
    return this.authService.issueSession({ id: identity.user.id, tenantId: identity.user.tenantId });
  }

  async extend(userId: string): Promise<SandboxView> {
    const owner = await this.ownerOf(userId);
    const sandbox = owner ? await this.liveSandboxOf(owner) : null;
    if (!sandbox || sandbox.status !== 'active') throw new NotFoundException({ code: 'SANDBOX_NOT_FOUND', message: 'You have no active sandbox.' });
    return this.view(await this.extendRow(sandbox));
  }

  private async extendRow(sandbox: NonNullable<SandboxRow>) {
    if (sandbox.extendedAt) {
      throw new ConflictException({ code: 'SANDBOX_ALREADY_EXTENDED', message: 'This sandbox has already been extended once.' });
    }
    const base = sandbox.expiresAt && sandbox.expiresAt > new Date() ? sandbox.expiresAt : new Date();
    return this.prisma.sandbox.update({
      where: { id: sandbox.id },
      data: { extendedAt: new Date(), expiresAt: new Date(base.getTime() + this.settings.extensionDays * DAY_MS) },
    });
  }

  async deleteMine(userId: string): Promise<SandboxView> {
    const owner = await this.ownerOf(userId);
    const sandbox = owner ? await this.liveSandboxOf(owner) : null;
    if (!sandbox) throw new NotFoundException({ code: 'SANDBOX_NOT_FOUND', message: 'You have no sandbox.' });
    if (sandbox.status === 'provisioning') {
      throw new ConflictException({ code: 'SANDBOX_PROVISIONING', message: 'Wait until your sandbox is ready, then delete it.' });
    }
    return this.view(await this.retire(sandbox, 'deleting'));
  }

  // ---------------------------------------------------------------- platform admin

  async list() {
    const [data, grouped] = await Promise.all([
      this.prisma.sandbox.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
      this.prisma.sandbox.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);
    const counts: Record<SandboxStatus, number> = { provisioning: 0, active: 0, failed: 0, expired: 0, deleting: 0, deleted: 0 };
    for (const row of grouped) {
      if (row.status in counts) counts[row.status as SandboxStatus] = row._count._all;
    }
    return {
      data: data.map((row) => ({ ...this.view(row), ownerProvider: row.ownerProvider, ownerEmail: row.ownerEmail, ownerName: row.ownerName, error: row.error, lastSwitchAt: row.lastSwitchAt, deletedAt: row.deletedAt })),
      counts,
      limits: { maxActive: this.settings.maxActive, lifetimeDays: this.settings.lifetimeDays },
    };
  }

  async adminDelete(id: string): Promise<SandboxView> {
    const sandbox = await this.prisma.sandbox.findUnique({ where: { id } });
    if (!sandbox) throw new NotFoundException('Sandbox not found');
    if (['deleted', 'deleting', 'expired'].includes(sandbox.status)) return this.view(sandbox);
    if (sandbox.status === 'provisioning') {
      throw new ConflictException({ code: 'SANDBOX_PROVISIONING', message: 'Wait until provisioning finishes.' });
    }
    return this.view(await this.retire(sandbox, 'deleting'));
  }

  async adminExtend(id: string): Promise<SandboxView> {
    const sandbox = await this.prisma.sandbox.findUnique({ where: { id } });
    if (!sandbox || sandbox.status !== 'active') throw new NotFoundException('No active sandbox with that id');
    // Admins may extend more than once.
    return this.view(await this.extendRow({ ...sandbox, extendedAt: null }));
  }

  // ---------------------------------------------------------------- removal

  /**
   * Blocks sign-in at once, then removes the data in the background. The
   * sandbox is `expired` or `deleting` until the data is gone, then `deleted`.
   */
  private async retire(sandbox: NonNullable<SandboxRow>, status: 'expired' | 'deleting') {
    await this.prisma.user.updateMany({ where: { tenantId: sandbox.tenantId }, data: { status: 'disabled' } });
    const updated = await this.prisma.sandbox.update({ where: { id: sandbox.id }, data: { status } });
    this.enqueue(() => this.finishRemoval(sandbox.id, sandbox.tenantId));
    return updated;
  }

  private async finishRemoval(sandboxId: string, tenantId: string): Promise<void> {
    const current = await this.prisma.sandbox.findUnique({ where: { id: sandboxId }, select: { status: true } });
    if (current?.status === 'deleted') return;
    await this.removeData(tenantId);
    await this.prisma.sandbox.update({ where: { id: sandboxId }, data: { status: 'deleted', deletedAt: new Date() } });
    this.logger.log(`Sandbox ${sandboxId} removed`);
  }

  /** Deletes the tenant's data in every service, then the tenant itself. Idempotent. */
  private async removeData(tenantId: string): Promise<void> {
    if (tenantId === this.settings.templateTenantId || tenantId === process.env.PUBLIC_DEMO_TENANT_ID?.trim()) {
      throw new Error('Refusing to remove the template tenant');
    }
    const isSandbox = await this.prisma.sandbox.findUnique({ where: { tenantId }, select: { id: true } });
    if (!isSandbox) throw new Error(`Tenant ${tenantId} is not a sandbox`);
    const urls = this.serviceUrls();
    // Try every service even if one is down; the tenant row stays until all succeed,
    // and the sweep retries failed sandboxes whose tenant still exists.
    const failures: string[] = [];
    for (const url of [urls.prm, urls.rcm, urls.clinical]) {
      try {
        await this.callService(`${url}/purge`, tenantId, { tenantId });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }
    if (failures.length > 0) throw new Error(`Sandbox data not fully removed: ${failures.join('; ')}`);
    await purgeTenantData(this.prisma as unknown as TransactionalSqlClient, tenantId, { exclude: ['sandboxes'] });
    await this.prisma.tenant.deleteMany({ where: { id: tenantId } });
  }

  /** Expires sandboxes past their date and fails provisioning that never finished. */
  async sweep(now: Date = new Date()): Promise<void> {
    try {
      const due = await this.prisma.sandbox.findMany({ where: { status: 'active', expiresAt: { lt: now } } });
      for (const sandbox of due) await this.retire(sandbox, 'expired');

      const stuck = await this.prisma.sandbox.findMany({
        where: { status: 'provisioning', createdAt: { lt: new Date(now.getTime() - STUCK_AFTER_MS) } },
      });
      for (const sandbox of stuck) {
        await this.prisma.sandbox.update({ where: { id: sandbox.id }, data: { status: 'failed', error: 'Provisioning did not finish' } });
        this.enqueue(() => this.removeData(sandbox.tenantId));
      }

      // Removal interrupted by a restart: finish it (skipping ones queued above).
      const queued = new Set(due.map((sandbox) => sandbox.id));
      const unfinished = await this.prisma.sandbox.findMany({ where: { status: { in: ['expired', 'deleting'] } } });
      for (const sandbox of unfinished) {
        if (!queued.has(sandbox.id)) this.enqueue(() => this.finishRemoval(sandbox.id, sandbox.tenantId));
      }

      // Failed provisioning whose cleanup did not finish (a service was down): retry.
      const failedWithData = await this.prisma.sandbox.findMany({ where: { status: 'failed' }, select: { tenantId: true } });
      if (failedWithData.length > 0) {
        const remaining = await this.prisma.tenant.findMany({
          where: { id: { in: failedWithData.map((sandbox) => sandbox.tenantId) } },
          select: { id: true },
        });
        for (const tenant of remaining) this.enqueue(() => this.removeData(tenant.id));
      }

      // An access token issued before removal stays valid for up to an hour and
      // could still write rows; purge again once those tokens have expired.
      const recentlyDeleted = await this.prisma.sandbox.findMany({
        where: {
          status: 'deleted',
          deletedAt: { gt: new Date(now.getTime() - LATE_PURGE_UNTIL_MS), lt: new Date(now.getTime() - LATE_PURGE_AFTER_MS) },
        },
      });
      for (const sandbox of recentlyDeleted) this.enqueue(() => this.removeData(sandbox.tenantId));

      if (due.length || stuck.length) this.logger.log(`Sandbox sweep: ${due.length} expired, ${stuck.length} stuck`);
    } catch (error) {
      this.logger.error(`Sandbox sweep failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
