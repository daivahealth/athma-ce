import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ExtensionPointService } from './extension-point.service';
import { PluginManifest, PluginContext, AthmaPluginModule } from '@athma/plugin-sdk';
import * as fs from 'fs';
import * as path from 'path';

interface DiscoveredPlugin {
  manifest: PluginManifest;
  moduleClass: any;
}

@Global()
@Module({})
export class PluginLoaderModule {
  private static readonly logger = new Logger(PluginLoaderModule.name);

  static async forRoot(): Promise<DynamicModule> {
    const extensionPointService = new ExtensionPointService();
    const plugins = await PluginLoaderModule.discoverPlugins();

    const pluginModules: any[] = [];

    for (const plugin of plugins) {
      try {
        pluginModules.push(plugin.moduleClass);
        PluginLoaderModule.logger.log(
          `Loaded plugin '${plugin.manifest.id}' v${plugin.manifest.version}`,
        );
      } catch (error) {
        PluginLoaderModule.logger.error(
          `Failed to load plugin '${plugin.manifest.id}': ${error}`,
        );
      }
    }

    const dynamicModule: DynamicModule = {
      module: PluginLoaderModule,
      imports: [EventEmitterModule.forRoot(), ...pluginModules],
      providers: [
        {
          provide: ExtensionPointService,
          useValue: extensionPointService,
        },
        {
          provide: 'LOADED_PLUGINS',
          useValue: plugins.map((p) => p.manifest),
        },
      ],
      exports: [ExtensionPointService, 'LOADED_PLUGINS'],
    };

    // Initialize plugins after module creation
    for (const plugin of plugins) {
      try {
        const instance = Object.create(plugin.moduleClass.prototype);
        if (typeof (instance as AthmaPluginModule).onPluginInit === 'function') {
          const context: PluginContext = {
            pluginId: plugin.manifest.id,
            extensionRegistry: extensionPointService,
          };
          await (instance as AthmaPluginModule).onPluginInit(context);
        }
      } catch (error) {
        PluginLoaderModule.logger.error(
          `Failed to initialize plugin '${plugin.manifest.id}': ${error}`,
        );
      }
    }

    const summary = extensionPointService.getPluginSummary();
    if (Object.keys(summary).length > 0) {
      PluginLoaderModule.logger.log(`Plugin extension summary: ${JSON.stringify(summary)}`);
    }

    return dynamicModule;
  }

  private static async discoverPlugins(): Promise<DiscoveredPlugin[]> {
    const discovered: DiscoveredPlugin[] = [];
    const pluginDirs = PluginLoaderModule.getPluginSearchPaths();

    for (const dir of pluginDirs) {
      if (!fs.existsSync(dir)) continue;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const manifestPath = path.join(dir, entry.name, 'athma-plugin.json');
        if (!fs.existsSync(manifestPath)) continue;

        try {
          const raw = fs.readFileSync(manifestPath, 'utf-8');
          const manifest: PluginManifest = JSON.parse(raw);

          if (manifest.backend.targetService !== 'clinical') continue;

          const modulePath = path.resolve(
            dir,
            entry.name,
            manifest.backend.moduleEntrypoint,
          );

          const moduleExports = require(modulePath);
          const moduleClass =
            moduleExports.default || Object.values(moduleExports)[0];

          if (moduleClass) {
            discovered.push({ manifest, moduleClass });
          }
        } catch (error) {
          PluginLoaderModule.logger.warn(
            `Skipping plugin in '${entry.name}': ${error}`,
          );
        }
      }
    }

    PluginLoaderModule.logger.log(
      `Discovered ${discovered.length} clinical plugin(s)`,
    );
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
