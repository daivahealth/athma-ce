import type { SmartChartingBlockType, SlashCommandItem } from '../types';

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    id: 'chiefHpi',
    title: 'Chief Complaints and HPI',
    description: 'Document chief complaints and history of present illness',
    icon: 'FileText',
  },
  {
    id: 'history',
    title: 'History',
    description: 'Document past medical, surgical, family, or social history',
    icon: 'Clock',
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Add clinical notes and observations',
    icon: 'StickyNote',
  },
  {
    id: 'diagnosis',
    title: 'Diagnosis',
    description: 'Search and add ICD-10 diagnoses',
    icon: 'Stethoscope',
  },
  {
    id: 'orders',
    title: 'Orders',
    description: 'Order lab tests, imaging, or procedures',
    icon: 'ClipboardList',
  },
  {
    id: 'prescription',
    title: 'Prescription',
    description: 'Prescribe medications',
    icon: 'Pill',
  },
];

export const getCommandByType = (type: SmartChartingBlockType): SlashCommandItem | undefined =>
  SLASH_COMMANDS.find((cmd) => cmd.id === type);

export const filterCommands = (query: string): SlashCommandItem[] => {
  if (!query) return SLASH_COMMANDS;
  const lowerQuery = query.toLowerCase();
  return SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery)
  );
};
