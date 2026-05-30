import type { ClinicalOrder } from '../../../types/charting';
import type { LabTestResultTemplate } from '@/modules/foundation/types/catalog';

type ReportableItem = {
  id?: string;
  testCode: string;
  codeSystem?: string | null;
  sortOrder?: number;
};

export type LabDisplayRow<TItem extends ReportableItem> =
  | {
      kind: 'group';
      key: string;
      label: string;
      indentLevel: number;
    }
  | {
      kind: 'item';
      key: string;
      item: TItem;
      indentLevel: number;
    };

function getItemKey<TItem extends ReportableItem>(item: TItem, index: number) {
  return item.id ?? `${item.testCode}:${item.codeSystem ?? 'LOINC'}:${index}`;
}

function sortTemplates(templates: LabTestResultTemplate[]) {
  return [...templates].sort((a, b) => a.sortOrder - b.sortOrder);
}

function findMatchingItem<TItem extends ReportableItem>(
  items: TItem[],
  template: LabTestResultTemplate,
  consumedKeys: Set<string>,
) {
  return items.find((item, index) => {
    const key = getItemKey(item, index);
    if (consumedKeys.has(key)) return false;
    return (
      item.testCode === template.observationCodeCatalog?.code &&
      (item.codeSystem ?? 'LOINC') === template.observationCodeCatalog?.codeSystem
    );
  });
}

export function buildLabDisplayRows<TItem extends ReportableItem>(
  items: TItem[],
  order?: ClinicalOrder | null,
  templateMap?: Record<string, LabTestResultTemplate[]>,
): LabDisplayRow<TItem>[] {
  const sortedItems = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const displayRows: LabDisplayRow<TItem>[] = [];
  const consumedKeys = new Set<string>();
  const labTests = order?.labTests ?? [];

  for (const labTest of labTests) {
    if (!labTest.labTestMasterId) continue;
    const templates = templateMap?.[labTest.labTestMasterId] ?? [];
    if (!templates.length) continue;

    const sortedTemplates = sortTemplates(templates);

    for (const template of sortedTemplates) {
      if (template.nodeType === 'group') {
        const childTemplates = sortedTemplates.filter(
          (child) => child.parentTemplateId === template.id && child.nodeType === 'analyte',
        );

        const childItems = childTemplates
          .map((childTemplate) => findMatchingItem(sortedItems, childTemplate, consumedKeys))
          .filter((item): item is TItem => Boolean(item));

        if (childItems.length === 0) continue;

        displayRows.push({
          kind: 'group',
          key: template.id,
          label: template.displayLabel || 'Panel Section',
          indentLevel: 0,
        });

        for (const childItem of childItems) {
          const childKey = getItemKey(childItem, sortedItems.indexOf(childItem));
          consumedKeys.add(childKey);
          displayRows.push({
            kind: 'item',
            key: childKey,
            item: childItem,
            indentLevel: 1,
          });
        }

        continue;
      }

      if (template.parentTemplateId) {
        continue;
      }

      const item = findMatchingItem(sortedItems, template, consumedKeys);
      if (!item) continue;

      const key = getItemKey(item, sortedItems.indexOf(item));
      consumedKeys.add(key);
      displayRows.push({
        kind: 'item',
        key,
        item,
        indentLevel: 0,
      });
    }
  }

  const fallbackItems = sortedItems.filter((item, index) => {
    const key = getItemKey(item, index);
    return !consumedKeys.has(key);
  });

  for (const fallbackItem of fallbackItems) {
    displayRows.push({
      kind: 'item',
      key: getItemKey(fallbackItem, sortedItems.indexOf(fallbackItem)),
      item: fallbackItem,
      indentLevel: 0,
    });
  }

  return displayRows;
}
