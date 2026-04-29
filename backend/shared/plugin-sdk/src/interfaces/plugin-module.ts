import { ExtensionRegistry } from './extension-registry';

export interface PluginContext {
  pluginId: string;
  extensionRegistry: ExtensionRegistry;
}

export interface AthmaPluginModule {
  onPluginInit?(context: PluginContext): Promise<void>;
  onPluginDestroy?(): Promise<void>;
}
