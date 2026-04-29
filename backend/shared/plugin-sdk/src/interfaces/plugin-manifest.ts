export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  athmaVersion?: string;

  specialty?: PluginSpecialty;

  backend: PluginBackendConfig;
  frontend?: PluginFrontendConfig;
  configKeys?: PluginConfigKey[];
  dependencies?: string[];
  i18n?: Record<string, string>;
}

export interface PluginSpecialty {
  code: string;
  snomed?: string;
  displayName: string;
}

export interface PluginBackendConfig {
  targetService: 'clinical' | 'foundation' | 'rcm' | 'prm';
  moduleEntrypoint: string;
  prismaSchema?: string;
  migrationDir?: string;
  permissions?: string[];
  extensionPoints?: PluginExtensionPoints;
}

export interface PluginExtensionPoints {
  encounterTypes?: string[];
  noteTemplates?: string[];
  orderCatalogs?: string[];
  observationCodes?: string[];
}

export interface PluginFrontendConfig {
  moduleEntrypoint: string;
  navigation?: PluginNavSection[];
  routes?: PluginRoute[];
  encounterExtensions?: PluginEncounterExtensions;
}

export interface PluginNavSection {
  section: string;
  labelKey: string;
  icon: string;
  children: PluginNavItem[];
}

export interface PluginNavItem {
  href: string;
  labelKey: string;
  icon: string;
}

export interface PluginRoute {
  path: string;
  component: string;
}

export interface PluginEncounterExtensions {
  chartingPanels?: string[];
  encounterSidebarWidgets?: string[];
}

export interface PluginConfigKey {
  key: string;
  defaultValue: string | boolean | number;
  valueType: 'string' | 'boolean' | 'number' | 'json';
  category: string;
  description: string;
  isOverridable: boolean;
}
