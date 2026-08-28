import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ExtensionPointService } from './extension-point.service';
import { PluginManifest, PluginContext, AthmaPluginModule } from '@athma/plugin-sdk';
import * as fs from 'fs';
import * as path from 'path';

interface DiscoveredPlugin {
  manifest: PluginManifest;
  moduleClass: any;
}

export interface QuarantinedPlugin {
  /** Plugin id when the manifest parsed, otherwise the directory name. */
  pluginId: string;
  directory: string;
  stage: 'manifest' | 'load' | 'init';
  error: string;
}

@Global()
@Module({})
export class PluginLoaderModule {
  private static readonly logger = new Logger(PluginLoaderModule.name);

  static async forRoot(): Promise<DynamicModule> {
    const extensionPointService = new ExtensionPointService();
    const quarantined: QuarantinedPlugin[] = [];
    const plugins = await PluginLoaderModule.discoverPlugins(quarantined);

    // Initialize plugins BEFORE assembling the dynamic module so an
    // init-failed plugin is fully excluded (no controllers/providers of a
    // quarantined plugin are ever registered). The service still boots.
    const initialized: DiscoveredPlugin[] = [];
    for (const plugin of plugins) {
      try {
        const instance = Object.create(plugin.moduleClass.prototype) as AthmaPluginModule;
        if (typeof instance.onPluginInit === 'function') {
          const context: PluginContext = {
            pluginId: plugin.manifest.id,
            extensionRegistry: extensionPointService,
          };
          await instance.onPluginInit!(context);
        }
        initialized.push(plugin);
      } catch (error) {
        PluginLoaderModule.quarantine(quarantined, {
          pluginId: plugin.manifest.id,
          directory: plugin.manifest.id,
          stage: 'init',
          error: error instanceof Error ? (error.stack ?? error.message) : String(error),
        });
      }
    }

    const dynamicModule: DynamicModule = {
      module: PluginLoaderModule,
      imports: initialized.map((p) => p.moduleClass),
      providers: [
        {
          provide: ExtensionPointService,
          useValue: extensionPointService,
        },
        {
          provide: 'LOADED_PLUGINS',
          useValue: initialized.map((p) => p.manifest),
        },
        {
          provide: 'QUARANTINED_PLUGINS',
          useValue: quarantined,
        },
      ],
      exports: [ExtensionPointService, 'LOADED_PLUGINS', 'QUARANTINED_PLUGINS'],
    };

    PluginLoaderModule.logStartupSummary(initialized, quarantined);
    // Fire-and-forget: the registry status report must never block or fail boot.
    void PluginLoaderModule.reportLoadStatus(initialized, quarantined);

    const summary = extensionPointService.getPluginSummary();
    if (Object.keys(summary).length > 0) {
      PluginLoaderModule.logger.log(`Plugin extension summary: ${JSON.stringify(summary)}`);
    }

    return dynamicModule;
  }

  private static quarantine(list: QuarantinedPlugin[], entry: QuarantinedPlugin): void {
    list.push(entry);
    PluginLoaderModule.logger.error(
      `QUARANTINED plugin '${entry.pluginId}' at stage '${entry.stage}': ${entry.error}`,
    );
  }

  private static logStartupSummary(
    loaded: DiscoveredPlugin[],
    quarantined: QuarantinedPlugin[],
  ): void {
    const loadedNames = loaded.map((p) => `${p.manifest.id}@${p.manifest.version}`);
    if (quarantined.length === 0) {
      PluginLoaderModule.logger.log(
        `Plugin startup: ${loaded.length} loaded, 0 quarantined${loadedNames.length ? ` (${loadedNames.join(', ')})` : ''}`,
      );
    } else {
      PluginLoaderModule.logger.error(
        `Plugin startup: ${loaded.length} loaded (${loadedNames.join(', ') || 'none'}), ` +
          `${quarantined.length} QUARANTINED (${quarantined.map((q) => q.pluginId).join(', ')}) — see errors above`,
      );
    }
  }

  /**
   * Best-effort report of per-plugin load outcomes to the Foundation plugin
   * registry (PluginRegistry.status: 'active' | 'error'), so quarantined
   * plugins are visible in the admin API instead of only in this service's
   * logs. Requires FOUNDATION_BASE_URL + INTERNAL_API_KEY; silently skipped
   * otherwise (e.g. isolated local dev).
   */
  private static async reportLoadStatus(
    loaded: DiscoveredPlugin[],
    quarantined: QuarantinedPlugin[],
  ): Promise<void> {
    const baseUrl = process.env.FOUNDATION_BASE_URL || 'http://localhost:3010';
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) return;

    const reports: Array<{ pluginId: string; status: 'active' | 'error'; error?: string }> = [
      ...loaded.map((p) => ({ pluginId: p.manifest.id, status: 'active' as const })),
      ...quarantined.map((q) => ({
        pluginId: q.pluginId,
        status: 'error' as const,
        error: `[${q.stage}] ${q.error}`.slice(0, 2000),
      })),
    ];

    for (const report of reports) {
      try {
        await fetch(`${baseUrl}/api/v1/plugins/internal/${report.pluginId}/load-status`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            'x-internal-api-key': apiKey,
          },
          body: JSON.stringify({ status: report.status, error: report.error }),
        });
      } catch (error) {
        PluginLoaderModule.logger.warn(
          `Could not report load status for '${report.pluginId}' to Foundation: ${error}`,
        );
      }
    }
  }

  private static async discoverPlugins(
    quarantined: QuarantinedPlugin[],
  ): Promise<DiscoveredPlugin[]> {
    const discovered: DiscoveredPlugin[] = [];
    const pluginDirs = PluginLoaderModule.getPluginSearchPaths();

    for (const dir of pluginDirs) {
      if (!fs.existsSync(dir)) continue;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const manifestPath = path.join(dir, entry.name, 'athma-plugin.json');
        if (!fs.existsSync(manifestPath)) continue;

        let manifest: PluginManifest | undefined;
        try {
          const raw = fs.readFileSync(manifestPath, 'utf-8');
          manifest = JSON.parse(raw);
        } catch (error) {
          PluginLoaderModule.quarantine(quarantined, {
            pluginId: entry.name,
            directory: path.join(dir, entry.name),
            stage: 'manifest',
            error: error instanceof Error ? error.message : String(error),
          });
          continue;
        }

        if (!manifest?.backend?.targetService || manifest.backend.targetService !== 'clinical') {
          continue; // Not ours to load — foundation/rcm/prm plugins are skipped silently.
        }

        try {
          const modulePath = path.resolve(dir, entry.name, manifest.backend.moduleEntrypoint);
          PluginLoaderModule.logger.log(`Loading plugin module from: ${modulePath}`);
          const moduleExports = require(modulePath);
          const moduleClass = moduleExports.default || Object.values(moduleExports)[0];

          if (!moduleClass) {
            throw new Error(
              `Entrypoint exports no module class (keys: ${Object.keys(moduleExports).join(', ') || 'none'})`,
            );
          }

          discovered.push({ manifest, moduleClass });
          PluginLoaderModule.logger.log(`Loaded plugin '${manifest.id}' v${manifest.version}`);
        } catch (error) {
          PluginLoaderModule.quarantine(quarantined, {
            pluginId: manifest.id ?? entry.name,
            directory: path.join(dir, entry.name),
            stage: 'load',
            error: error instanceof Error ? (error.stack ?? error.message) : String(error),
          });
        }
      }
    }

    return discovered;
  }

  private static getPluginSearchPaths(): string[] {
    const paths: string[] = [];

    // Check node_modules/@athma-plugins/
    const nodeModulesPath = path.resolve(
      process.cwd(),
      'node_modules',
      '@athma-plugins',
    );
    paths.push(nodeModulesPath);

    // Check local plugins/ directory at project root (3 levels up from backend/services/clinical/)
    const projectRoot = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
    const localPluginsPath = path.resolve(projectRoot, 'plugins');
    paths.push(localPluginsPath);

    // Also check cwd-relative plugins/ as fallback
    const cwdPluginsPath = path.resolve(process.cwd(), 'plugins');
    if (cwdPluginsPath !== localPluginsPath) {
      paths.push(cwdPluginsPath);
    }

    // Check env-configured plugin path
    if (process.env.ATHMA_PLUGIN_DIR) {
      paths.push(path.resolve(process.env.ATHMA_PLUGIN_DIR));
    }

    return paths;
  }
}
