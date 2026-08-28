export interface PluginManifest {
  /** 1 (implicit for legacy manifests) or 2. v2 adds the fields below. */
  manifestVersion?: number;
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  athmaVersion?: string;

  specialty?: PluginSpecialty;

  /** ISO 3166-1 alpha-2 codes this plugin targets; omit for country-neutral. */
  countries?: string[];
  /** Capability implementations this plugin provides (ADR-0015). */
  capabilities?: PluginCapabilityDeclaration[];
  /** Secret slots the framework should provision (values via the secrets API). */
  secrets?: PluginSecretDeclaration[];
  /** Callback ingress paths a companion connector exposes. */
  callbacks?: PluginCallbackDeclaration[];

  backend: PluginBackendConfig;
  frontend?: PluginFrontendConfig;
  configKeys?: PluginConfigKey[];
  dependencies?: string[];
  i18n?: Record<string, string>;
}

export interface PluginCapabilityDeclaration {
  /** Capability key, e.g. 'registry.facility'. */
  key: string;
  /** Provider id usable in capability bindings, e.g. 'hfr'. */
  provider: string;
}

export interface PluginSecretDeclaration {
  /** Secret key, e.g. 'abdm.client_secret'. */
  key: string;
  scope: 'tenant' | 'facility';
}

export interface PluginCallbackDeclaration {
  path: string;
  verification?: string;
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
