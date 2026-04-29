import { FrontendPluginManifest } from './types';

class PluginRegistryImpl {
  private plugins: Map<string, FrontendPluginManifest> = new Map();

  register(plugin: FrontendPluginManifest): void {
    this.plugins.set(plugin.id, plugin);
  }

  getAll(): FrontendPluginManifest[] {
    return Array.from(this.plugins.values());
  }

  get(id: string): FrontendPluginManifest | undefined {
    return this.plugins.get(id);
  }

  getNavSections(): { featureFlag: string; sections: FrontendPluginManifest['navigation'] }[] {
    return this.getAll().map((plugin) => ({
      featureFlag: plugin.featureFlag,
      sections: plugin.navigation,
    }));
  }
}

export const pluginRegistry = new PluginRegistryImpl();
