import { type ComponentType } from 'react';

export interface PluginNavItem {
  href: string;
  labelKey: string;
  icon: string;
}

export interface PluginNavSection {
  section: string;
  labelKey: string;
  icon: string;
  children: PluginNavItem[];
}

export interface PluginEncounterExtensions {
  chartingPanels?: ComponentType<ChartingPanelProps>[];
  encounterSidebarWidgets?: ComponentType<EncounterWidgetProps>[];
}

export interface ChartingPanelProps {
  encounterId: string;
  patientId: string;
  encounterType: string;
}

export interface EncounterWidgetProps {
  encounterId: string;
  patientId: string;
}

export interface FrontendPluginManifest {
  id: string;
  name: string;
  featureFlag: string;
  navigation: PluginNavSection[];
  encounterExtensions?: PluginEncounterExtensions;
  translations?: Record<string, Record<string, string>>;
  pageComponent?: ComponentType<PluginPageProps>;
}

export interface PluginPageProps {
  pluginId: string;
  subPath: string[];
}
