export interface PluginActivation {
  id: string;
  pluginId: string;
  tenantId: string;
  isEnabled: boolean;
  enabledAt: string;
  disabledAt: string | null;
  enabledBy: string | null;
  settings: Record<string, unknown>;
}

export interface PluginRegistryEntry {
  id: string;
  pluginId: string;
  name: string;
  version: string;
  description: string | null;
  author: string | null;
  license: string | null;
  specialtyCode: string | null;
  targetService: string;
  manifest: PluginManifestData;
  packagePath: string | null;
  status: string;
  installedAt: string;
  updatedAt: string;
  installedBy: string | null;
  activations: PluginActivation[];
}

export interface PluginManifestData {
  id: string;
  name: string;
  version: string;
  description?: string;
  specialty?: {
    code: string;
    displayName: string;
  };
  backend: {
    targetService: string;
    permissions?: string[];
  };
  frontend?: {
    navigation?: Array<{
      section: string;
      labelKey: string;
      icon: string;
      children: Array<{
        href: string;
        labelKey: string;
        icon: string;
      }>;
    }>;
  };
  configKeys?: Array<{
    key: string;
    defaultValue: unknown;
    description: string;
  }>;
}
