/**
 * Country packs (ADR-0015 §3): versioned, declarative JSON presets applied at
 * tenant provisioning. A pack sets config defaults and lists offerable
 * plugins — it contains no code and has no runtime presence. Applying a pack
 * makes integrations AVAILABLE; activating them (credentials, plugin
 * activation) stays a separate, deliberate admin step.
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import type { Prisma } from '@zeal/database-foundation';
import { ConfigService } from '../config/config.service';
import * as fs from 'fs';
import * as path from 'path';

export interface CountryPack {
  code: string;
  name: string;
  version: string;
  description?: string;
  config: Record<string, unknown>;
}

export interface ApplyResult {
  pack: { code: string; name: string; version: string };
  applied: string[];
  /** Keys skipped because the tenant already overrides them (use force to overwrite). */
  skippedExisting: string[];
  /** Keys skipped because no instance config schema declares them. */
  skippedUnknown: string[];
}

@Injectable()
export class CountryPackService {
  private readonly logger = new Logger(CountryPackService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  listPacks(): Array<Pick<CountryPack, 'code' | 'name' | 'version' | 'description'>> {
    const dir = this.packsDir();
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as CountryPack)
      .map(({ code, name, version, description }) => ({
        code,
        name,
        version,
        ...(description !== undefined ? { description } : {}),
      }));
  }

  async apply(
    tenantId: string,
    code: string,
    userId: string,
    force = false,
  ): Promise<ApplyResult> {
    const pack = this.loadPack(code);

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException(`Tenant '${tenantId}' not found`);

    const applied: string[] = [];
    const skippedExisting: string[] = [];
    const skippedUnknown: string[] = [];

    for (const [key, value] of Object.entries(pack.config)) {
      const schema = await this.prisma.instanceConfig.findUnique({ where: { configKey: key } });
      if (!schema) {
        this.logger.warn(`Country pack '${pack.code}' sets unknown config key '${key}' — skipped`);
        skippedUnknown.push(key);
        continue;
      }

      const existing = await this.prisma.tenantConfig.findUnique({
        where: { tenantId_configKey: { tenantId, configKey: key } },
      });
      if (existing && !force) {
        skippedExisting.push(key);
        continue;
      }

      // Reuses the config service so overridability/sensitivity rules and the
      // audit trail apply exactly as they do for manual configuration.
      await this.configService.setTenantConfig(
        tenantId,
        key,
        value,
        userId,
        `Country pack ${pack.code} v${pack.version}`,
      );
      applied.push(key);
    }

    const settings = (tenant.settings ?? {}) as Record<string, unknown>;
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: {
          ...settings,
          country_pack: {
            code: pack.code,
            version: pack.version,
            appliedAt: new Date().toISOString(),
            appliedBy: userId,
          },
        } as Prisma.InputJsonValue,
      },
    });

    this.logger.log(
      `Applied country pack ${pack.code} v${pack.version} to tenant ${tenantId}: ` +
        `${applied.length} set, ${skippedExisting.length} kept, ${skippedUnknown.length} unknown`,
    );

    return {
      pack: { code: pack.code, name: pack.name, version: pack.version },
      applied,
      skippedExisting,
      skippedUnknown,
    };
  }

  private loadPack(code: string): CountryPack {
    if (!/^[a-z]{2,10}$/i.test(code)) {
      throw new BadRequestException(`Invalid country pack code '${code}'`);
    }
    const file = path.join(this.packsDir(), `${code.toLowerCase()}.json`);
    if (!fs.existsSync(file)) {
      throw new NotFoundException(`No country pack '${code}' — see GET /country-packs`);
    }
    const pack = JSON.parse(fs.readFileSync(file, 'utf-8')) as CountryPack;
    if (!pack.code || !pack.version || typeof pack.config !== 'object') {
      throw new BadRequestException(`Country pack '${code}' is malformed`);
    }
    return pack;
  }

  private packsDir(): string {
    if (process.env.COUNTRY_PACKS_DIR) return path.resolve(process.env.COUNTRY_PACKS_DIR);
    // Walk upward to the repo root's country-packs/ — robust to the differing
    // src vs dist directory depths.
    let dir = __dirname;
    for (let i = 0; i < 10; i++) {
      const candidate = path.join(dir, 'country-packs');
      if (fs.existsSync(candidate)) return candidate;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    return path.resolve(process.cwd(), 'country-packs');
  }
}
