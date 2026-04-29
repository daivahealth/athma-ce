import { Injectable, Logger } from '@nestjs/common';
import {
  ExtensionRegistry,
  EncounterTypeDefinition,
  NoteTemplateDefinition,
  CatalogEntry,
  ObservationCodeDefinition,
  ChartingPanelDefinition,
} from '../interfaces/extension-registry';

@Injectable()
export class ExtensionRegistryService implements ExtensionRegistry {
  private readonly logger = new Logger(ExtensionRegistryService.name);
  private readonly encounterTypes: Map<string, EncounterTypeDefinition> = new Map();
  private readonly noteTemplates: Map<string, NoteTemplateDefinition> = new Map();
  private readonly catalogEntries: Map<string, CatalogEntry> = new Map();
  private readonly observationCodes: Map<string, ObservationCodeDefinition> = new Map();
  private readonly chartingPanels: Map<string, ChartingPanelDefinition> = new Map();

  registerEncounterType(def: EncounterTypeDefinition): void {
    if (this.encounterTypes.has(def.code)) {
      this.logger.warn(
        `Encounter type '${def.code}' already registered by plugin '${this.encounterTypes.get(def.code)!.pluginId}', overriding with plugin '${def.pluginId}'`,
      );
    }
    this.encounterTypes.set(def.code, def);
    this.logger.log(`Registered encounter type '${def.code}' from plugin '${def.pluginId}'`);
  }

  registerNoteTemplate(def: NoteTemplateDefinition): void {
    this.noteTemplates.set(`${def.pluginId}:${def.code}`, def);
    this.logger.log(`Registered note template '${def.code}' from plugin '${def.pluginId}'`);
  }

  registerOrderCatalogEntries(entries: CatalogEntry[]): void {
    for (const entry of entries) {
      this.catalogEntries.set(`${entry.pluginId}:${entry.code}`, entry);
    }
    this.logger.log(
      `Registered ${entries.length} catalog entries from plugin '${entries[0]?.pluginId}'`,
    );
  }

  registerObservationCodes(codes: ObservationCodeDefinition[]): void {
    for (const code of codes) {
      this.observationCodes.set(`${code.pluginId}:${code.code}`, code);
    }
    this.logger.log(
      `Registered ${codes.length} observation codes from plugin '${codes[0]?.pluginId}'`,
    );
  }

  registerChartingPanel(def: ChartingPanelDefinition): void {
    this.chartingPanels.set(def.id, def);
    this.logger.log(`Registered charting panel '${def.id}' from plugin '${def.pluginId}'`);
  }

  getEncounterTypes(): EncounterTypeDefinition[] {
    return Array.from(this.encounterTypes.values());
  }

  getNoteTemplates(specialtyCode?: string): NoteTemplateDefinition[] {
    const templates = Array.from(this.noteTemplates.values());
    if (specialtyCode) {
      return templates.filter((t) => t.specialtyCode === specialtyCode);
    }
    return templates;
  }

  getOrderCatalogEntries(pluginId?: string): CatalogEntry[] {
    const entries = Array.from(this.catalogEntries.values());
    if (pluginId) {
      return entries.filter((e) => e.pluginId === pluginId);
    }
    return entries;
  }

  getObservationCodes(pluginId?: string): ObservationCodeDefinition[] {
    const codes = Array.from(this.observationCodes.values());
    if (pluginId) {
      return codes.filter((c) => c.pluginId === pluginId);
    }
    return codes;
  }

  getChartingPanels(encounterType?: string): ChartingPanelDefinition[] {
    const panels = Array.from(this.chartingPanels.values());
    if (encounterType) {
      return panels
        .filter((p) => p.encounterTypes.includes(encounterType))
        .sort((a, b) => a.priority - b.priority);
    }
    return panels.sort((a, b) => a.priority - b.priority);
  }

  getPluginSummary(): Record<string, { encounterTypes: number; templates: number; catalogs: number; observations: number; panels: number }> {
    const pluginIds = new Set<string>();
    this.encounterTypes.forEach((v) => pluginIds.add(v.pluginId));
    this.noteTemplates.forEach((v) => pluginIds.add(v.pluginId));
    this.catalogEntries.forEach((v) => pluginIds.add(v.pluginId));
    this.observationCodes.forEach((v) => pluginIds.add(v.pluginId));
    this.chartingPanels.forEach((v) => pluginIds.add(v.pluginId));

    const summary: Record<string, { encounterTypes: number; templates: number; catalogs: number; observations: number; panels: number }> = {};
    for (const pid of pluginIds) {
      summary[pid] = {
        encounterTypes: this.getEncounterTypes().filter((e) => e.pluginId === pid).length,
        templates: this.getNoteTemplates().filter((t) => t.pluginId === pid).length,
        catalogs: this.getOrderCatalogEntries(pid).length,
        observations: this.getObservationCodes(pid).length,
        panels: this.getChartingPanels().filter((p) => p.pluginId === pid).length,
      };
    }
    return summary;
  }
}
