export interface EncounterTypeDefinition {
  code: string;
  display: string;
  encounterClass: string;
  pluginId: string;
  description?: string;
}

export interface NoteTemplateDefinition {
  code: string;
  name: string;
  specialtyCode: string;
  pluginId: string;
  templateContent: Record<string, unknown>;
  description?: string;
}

export interface CatalogEntry {
  code: string;
  name: string;
  category: string;
  pluginId: string;
  metadata?: Record<string, unknown>;
}

export interface ObservationCodeDefinition {
  code: string;
  display: string;
  system: string;
  unit?: string;
  pluginId: string;
  category?: string;
  dataType: 'numeric' | 'text' | 'coded' | 'datetime';
}

export interface ChartingPanelDefinition {
  id: string;
  name: string;
  pluginId: string;
  encounterTypes: string[];
  priority: number;
  componentPath: string;
}

export interface ExtensionRegistry {
  registerEncounterType(def: EncounterTypeDefinition): void;
  registerNoteTemplate(def: NoteTemplateDefinition): void;
  registerOrderCatalogEntries(entries: CatalogEntry[]): void;
  registerObservationCodes(codes: ObservationCodeDefinition[]): void;
  registerChartingPanel(def: ChartingPanelDefinition): void;

  getEncounterTypes(): EncounterTypeDefinition[];
  getNoteTemplates(specialtyCode?: string): NoteTemplateDefinition[];
  getOrderCatalogEntries(pluginId?: string): CatalogEntry[];
  getObservationCodes(pluginId?: string): ObservationCodeDefinition[];
  getChartingPanels(encounterType?: string): ChartingPanelDefinition[];
}
