'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock, Plus, FlaskConical, FolderTree, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  useLabTest,
  useLabTestResultTemplates,
  useObservationCodes,
  useReplaceLabTestResultTemplates,
  useUpdateLabTest,
} from '@/modules/foundation/hooks/use-catalogs';
import type { LabTest, LabTestResultTemplate, ObservationCode } from '@/modules/foundation/types/catalog';
import { CatalogBillingMappingsPanel } from '@/modules/rcm/components/catalog-billing-mappings-panel';

type LabAnalyteDomain =
  | 'all'
  | 'hematology'
  | 'chemistry'
  | 'microbiology'
  | 'coagulation'
  | 'urinalysis'
  | 'other';

type DraftLabTestResultTemplate = LabTestResultTemplate & {
  draftKey: string;
};

type LabTestMaintenanceForm = {
  reportStyle: string;
  labDiscipline: string;
  turnaroundTimeHours: string;
  referenceLab: string;
  isActive: boolean;
};

const REPORT_STYLE_OPTIONS = [
  { value: 'structured', label: 'Structured' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

const LAB_DISCIPLINE_OPTIONS = [
  { value: 'hematology', label: 'Hematology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'histopathology', label: 'Histopathology' },
  { value: 'cytology', label: 'Cytology' },
  { value: 'coagulation', label: 'Coagulation' },
  { value: 'urinalysis', label: 'Urinalysis' },
  { value: 'other', label: 'Other' },
] as const;

function createMaintenanceForm(labTest?: LabTest): LabTestMaintenanceForm {
  return {
    reportStyle: labTest?.reportStyle ?? 'structured',
    labDiscipline: labTest?.labDiscipline ?? '',
    turnaroundTimeHours:
      labTest?.turnaroundTimeHours != null ? String(labTest.turnaroundTimeHours) : '',
    referenceLab: labTest?.referenceLab ?? '',
    isActive: labTest?.isActive ?? true,
  };
}

function getObservationDomain(observationCode: ObservationCode): Exclude<LabAnalyteDomain, 'all'> {
  if (observationCode.labDomain === 'hematology') return 'hematology';
  if (observationCode.labDomain === 'chemistry') return 'chemistry';
  if (observationCode.labDomain === 'microbiology') return 'microbiology';
  if (observationCode.labDomain === 'coagulation') return 'coagulation';
  if (observationCode.labDomain === 'urinalysis') return 'urinalysis';
  const haystack = `${observationCode.displayName} ${observationCode.code}`.toLowerCase();

  if (
    haystack.includes('white blood') ||
    haystack.includes('red blood') ||
    haystack.includes('hemoglobin') ||
    haystack.includes('platelet') ||
    haystack.includes('hemat')
  ) {
    return 'hematology';
  }

  if (
    haystack.includes('culture') ||
    haystack.includes('organism') ||
    haystack.includes('bacteria') ||
    haystack.includes('fung') ||
    haystack.includes('virus')
  ) {
    return 'microbiology';
  }

  if (
    haystack.includes('glucose') ||
    haystack.includes('creatinine') ||
    haystack.includes('urea') ||
    haystack.includes('sodium') ||
    haystack.includes('potassium') ||
    haystack.includes('cholesterol') ||
    haystack.includes('triglyceride') ||
    haystack.includes('alanine aminotransferase') ||
    haystack.includes('aspartate aminotransferase') ||
    haystack.includes('thyroid')
  ) {
    return 'chemistry';
  }

  return 'other';
}

function inferDefaultDomain(labTest?: {
  testCategory?: string | null;
  testSubcategory?: string | null;
  testName?: string | null;
}): LabAnalyteDomain {
  const haystack = `${labTest?.testCategory ?? ''} ${labTest?.testSubcategory ?? ''} ${labTest?.testName ?? ''}`.toLowerCase();

  if (haystack.includes('cbc') || haystack.includes('hemat')) return 'hematology';
  if (haystack.includes('micro')) return 'microbiology';
  if (
    haystack.includes('chem') ||
    haystack.includes('lipid') ||
    haystack.includes('thyroid') ||
    haystack.includes('metabolic')
  ) {
    return 'chemistry';
  }

  return 'all';
}

function toDraftTemplate(template: LabTestResultTemplate): DraftLabTestResultTemplate {
  return {
    ...template,
    draftKey: template.id,
  };
}

function sortTemplateNodes(
  items: DraftLabTestResultTemplate[],
  parentTemplateId: string | null,
): DraftLabTestResultTemplate[] {
  return items
    .filter((item) => (item.parentTemplateId ?? null) === parentTemplateId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

function flattenTemplateTree(
  items: DraftLabTestResultTemplate[],
  parentTemplateId: string | null = null,
): DraftLabTestResultTemplate[] {
  const flattened: DraftLabTestResultTemplate[] = [];

  for (const item of sortTemplateNodes(items, parentTemplateId)) {
    flattened.push(item);
    flattened.push(...flattenTemplateTree(items, item.draftKey));
  }

  return flattened;
}

function slugifyLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function LabTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const labTestId = params.id as string;
  const locale = params.locale as string;

  const { data: labTest, isLoading, error } = useLabTest(labTestId);
  const { data: resultTemplates, isLoading: isLoadingTemplates } = useLabTestResultTemplates(labTestId);
  const { data: observationCodes, isLoading: isLoadingObservationCodes } = useObservationCodes('laboratory');
  const replaceTemplates = useReplaceLabTestResultTemplates(labTestId);
  const updateLabTest = useUpdateLabTest(labTestId);

  const [draftTemplates, setDraftTemplates] = useState<DraftLabTestResultTemplate[] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pickerParentTemplateId, setPickerParentTemplateId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<LabAnalyteDomain>('all');
  const [editForm, setEditForm] = useState<LabTestMaintenanceForm>(createMaintenanceForm());

  useEffect(() => {
    if (!labTest || editDialogOpen) return;
    setEditForm(createMaintenanceForm(labTest));
  }, [editDialogOpen, labTest]);

  const effectiveTemplates = useMemo(
    () => draftTemplates ?? (resultTemplates ?? []).map(toDraftTemplate),
    [draftTemplates, resultTemplates],
  );

  const selectedObservationIds = useMemo(
    () =>
      new Set(
        effectiveTemplates
          .map((item) => item.observationCodeCatalogId)
          .filter((value): value is string => Boolean(value)),
      ),
    [effectiveTemplates],
  );

  const groupedObservationCodes = useMemo(() => {
    const term = search.trim().toLowerCase();
    const groups: Record<Exclude<LabAnalyteDomain, 'all'>, ObservationCode[]> = {
      hematology: [],
      chemistry: [],
      microbiology: [],
      coagulation: [],
      urinalysis: [],
      other: [],
    };

    for (const item of observationCodes ?? []) {
      if (selectedObservationIds.has(item.id)) continue;
      if (
        term &&
        !item.displayName.toLowerCase().includes(term) &&
        !item.code.toLowerCase().includes(term) &&
        !item.codeSystem.toLowerCase().includes(term)
      ) {
        continue;
      }

      const domain = getObservationDomain(item);
      if (domainFilter !== 'all' && domain !== domainFilter) continue;
      groups[domain].push(item);
    }

    return groups;
  }, [domainFilter, observationCodes, search, selectedObservationIds]);

  const availableObservationCodes = useMemo(
    () => Object.values(groupedObservationCodes).flat(),
    [groupedObservationCodes],
  );

  const pickerParent = useMemo(
    () =>
      pickerParentTemplateId
        ? effectiveTemplates.find((item) => item.draftKey === pickerParentTemplateId) ?? null
        : null,
    [effectiveTemplates, pickerParentTemplateId],
  );

  const setDirtyTemplates = (next: DraftLabTestResultTemplate[]) => {
    setDraftTemplates(next);
  };

  const openPickerForParent = (parentTemplateId: string | null) => {
    setPickerParentTemplateId(parentTemplateId);
    setPickerOpen(true);
    setDomainFilter(inferDefaultDomain(labTest));
  };

  const openGroupDialog = () => {
    setNewGroupName('');
    setGroupDialogOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickerParentTemplateId(null);
    setSearch('');
    setDomainFilter('all');
  };

  const closeGroupDialog = () => {
    setGroupDialogOpen(false);
    setNewGroupName('');
  };

  const handleAddGroup = () => {
    const label = newGroupName.trim();
    if (!label) return;

    const draftId = `draft-group-${Date.now()}`;
    const nextGroup: DraftLabTestResultTemplate = {
      id: draftId,
      draftKey: draftId,
      tenantId: labTest?.tenantId ?? null,
      labTestMasterId: labTestId,
      parentTemplateId: null,
      nodeType: 'group',
      groupKey: slugifyLabel(label) || `group-${effectiveTemplates.length + 1}`,
      renderStyle: 'section',
      observationCodeCatalogId: null,
      displayLabel: label,
      sortOrder: effectiveTemplates.filter((item) => !item.parentTemplateId).length,
      isRequired: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      observationCodeCatalog: null,
    };

    setDirtyTemplates([...effectiveTemplates, nextGroup]);
    closeGroupDialog();
  };

  const handleAddTemplate = (observationCode: ObservationCode) => {
    const siblingCount = effectiveTemplates.filter(
      (item) => (item.parentTemplateId ?? null) === pickerParentTemplateId,
    ).length;

    const draftId = `draft-analyte-${observationCode.id}-${Date.now()}`;
    const nextTemplate: DraftLabTestResultTemplate = {
      id: draftId,
      draftKey: draftId,
      tenantId: labTest?.tenantId ?? null,
      labTestMasterId: labTestId,
      parentTemplateId: pickerParentTemplateId,
      nodeType: 'analyte',
      groupKey: pickerParent?.groupKey ?? null,
      renderStyle: null,
      observationCodeCatalogId: observationCode.id,
      displayLabel: observationCode.displayName,
      sortOrder: siblingCount,
      isRequired: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      observationCodeCatalog: observationCode,
    };

    setDirtyTemplates([...effectiveTemplates, nextTemplate]);
    closePicker();
  };

  const handleRemoveTemplate = (draftKey: string) => {
    const descendants = new Set<string>();
    const queue = [draftKey];

    while (queue.length > 0) {
      const current = queue.shift()!;
      descendants.add(current);
      for (const item of effectiveTemplates) {
        if (item.parentTemplateId === current) {
          queue.push(item.draftKey);
        }
      }
    }

    setDirtyTemplates(effectiveTemplates.filter((item) => !descendants.has(item.draftKey)));
  };

  const handleToggleRequired = (draftKey: string) => {
    setDirtyTemplates(
      effectiveTemplates.map((item) =>
        item.draftKey === draftKey ? { ...item, isRequired: !item.isRequired } : item,
      ),
    );
  };

  const handleRenameTemplate = (draftKey: string, nextLabel: string) => {
    setDirtyTemplates(
      effectiveTemplates.map((item) =>
        item.draftKey === draftKey ? { ...item, displayLabel: nextLabel } : item,
      ),
    );
  };

  const handleResetTemplates = () => {
    setDraftTemplates(null);
  };

  const handleOpenEditDialog = () => {
    setEditForm(createMaintenanceForm(labTest));
    setEditDialogOpen(true);
  };

  const handleSaveLabTest = async () => {
    try {
      const normalizedTurnaround =
        editForm.turnaroundTimeHours.trim() === ''
          ? null
          : Number.parseInt(editForm.turnaroundTimeHours.trim(), 10);

      if (
        editForm.turnaroundTimeHours.trim() !== '' &&
        (!Number.isFinite(normalizedTurnaround) || normalizedTurnaround < 0)
      ) {
        toast({
          variant: 'destructive',
          title: 'Invalid turnaround time',
          description: 'Turnaround time must be a whole number of hours.',
        });
        return;
      }

      await updateLabTest.mutateAsync({
        reportStyle: editForm.reportStyle,
        labDiscipline: editForm.labDiscipline || null,
        turnaroundTimeHours: normalizedTurnaround,
        referenceLab: editForm.referenceLab.trim() || null,
        isActive: editForm.isActive,
      });

      setEditDialogOpen(false);
      toast({
        title: 'Lab master updated',
        description: `${labTest?.testName ?? 'Lab test'} maintenance fields were saved.`,
      });
    } catch (saveError) {
      toast({
        variant: 'destructive',
        title: 'Failed to update lab master',
        description: saveError instanceof Error ? saveError.message : 'Try again.',
      });
    }
  };

  const handleSaveTemplates = async () => {
    try {
      const orderedItems = flattenTemplateTree(effectiveTemplates);
      await replaceTemplates.mutateAsync(
        orderedItems.map((item, index) => ({
          templateKey: item.draftKey,
          parentTemplateKey: item.parentTemplateId ?? undefined,
          nodeType: item.nodeType,
          observationCodeCatalogId:
            item.nodeType === 'analyte' && item.observationCodeCatalogId
              ? item.observationCodeCatalogId
              : undefined,
          displayLabel:
            item.displayLabel ?? item.observationCodeCatalog?.displayName ?? undefined,
          groupKey: item.groupKey ?? undefined,
          renderStyle: item.nodeType === 'group' ? item.renderStyle ?? 'section' : undefined,
          sortOrder: index,
          isRequired: item.nodeType === 'analyte' ? item.isRequired : false,
          isActive: item.isActive,
        })),
      );
      setDraftTemplates(null);
      toast({
        title: 'Analyte template updated',
        description: `${labTest?.testName ?? 'Lab test'} result hierarchy was saved.`,
      });
    } catch (saveError) {
      toast({
        variant: 'destructive',
        title: 'Failed to save analyte template',
        description: saveError instanceof Error ? saveError.message : 'Try again.',
      });
    }
  };

  const renderTemplateNode = (template: DraftLabTestResultTemplate): ReactNode => {
    const childTemplates = sortTemplateNodes(effectiveTemplates, template.draftKey);

    if (template.nodeType === 'group') {
      return (
        <div key={template.draftKey} className="rounded-xl border bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-primary" />
              <Badge variant="secondary">Group</Badge>
              <Badge variant="outline">{childTemplates.length} items</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openPickerForParent(template.draftKey)}>
                <Plus className="h-4 w-4 mr-2" />
                Add analyte
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveTemplate(template.draftKey)}>
                <X className="h-4 w-4 mr-2" />
                Remove group
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Group label</Label>
            <Input
              value={template.displayLabel ?? ''}
              onChange={(event) => handleRenameTemplate(template.draftKey, event.target.value)}
              placeholder="Differential Count"
            />
          </div>

          <div className="space-y-3 border-l pl-4">
            {childTemplates.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                No analytes in this group yet. Add Neutrophils, Lymphocytes, Monocytes, Eosinophils, or Basophils here.
              </div>
            ) : (
              childTemplates.map((childTemplate) => renderTemplateNode(childTemplate))
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={template.draftKey} className="flex items-start justify-between rounded-lg border p-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="capitalize">
              {template.observationCodeCatalog?.dataType ?? 'analyte'}
            </Badge>
            {template.isRequired ? (
              <Badge variant="outline">Required</Badge>
            ) : (
              <Badge variant="outline">Optional</Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label>Display label</Label>
            <Input
              value={template.displayLabel ?? template.observationCodeCatalog?.displayName ?? ''}
              onChange={(event) => handleRenameTemplate(template.draftKey, event.target.value)}
              placeholder="Display label"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-mono">
              {template.observationCodeCatalog?.codeSystem ?? 'LOINC'}{' '}
              {template.observationCodeCatalog?.code ?? ''}
            </span>
            {template.observationCodeCatalog?.defaultUnit
              ? ` · ${template.observationCodeCatalog.defaultUnit}`
              : ''}
            {template.observationCodeCatalog &&
            (template.observationCodeCatalog.refRangeLow != null ||
              template.observationCodeCatalog.refRangeHigh != null)
              ? ` · range ${template.observationCodeCatalog.refRangeLow ?? '—'} to ${template.observationCodeCatalog.refRangeHigh ?? '—'}`
              : ''}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleToggleRequired(template.draftKey)}>
            Mark {template.isRequired ? 'optional' : 'required'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleRemoveTemplate(template.draftKey)}>
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !labTest) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Error loading lab test details</div>
      </div>
    );
  }

  const rootTemplates = sortTemplateNodes(effectiveTemplates, null);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${locale}/catalogs/lab-tests`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{labTest.testName}</h1>
            {labTest.testCategory && <p className="text-muted-foreground">{labTest.testCategory}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={labTest.isActive ? 'default' : 'secondary'}>
            {labTest.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {labTest.reportStyle}
          </Badge>
          {labTest.labDiscipline && (
            <Badge variant="outline" className="capitalize">
              {labTest.labDiscipline.replace(/_/g, ' ')}
            </Badge>
          )}
          {labTest.fastingRequired && <Badge variant="outline">Fasting Required</Badge>}
          {labTest.turnaroundTimeHours && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              TAT: {labTest.turnaroundTimeHours}h
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleOpenEditDialog}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Deactivate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Name</label>
              <p className="text-base">{labTest.testName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Category</label>
              <p className="text-base">{labTest.testCategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Subcategory</label>
              <p className="text-base">{labTest.testSubcategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Methodology</label>
              <p className="text-base">{labTest.methodology || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification & Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Report Style</label>
              <p className="text-base capitalize">{labTest.reportStyle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Lab Discipline</label>
              <p className="text-base capitalize">
                {labTest.labDiscipline ? labTest.labDiscipline.replace(/_/g, ' ') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coding Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">LOINC Code</label>
              <p className="text-base font-mono">{labTest.loincCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPT Code</label>
              <p className="text-base font-mono">{labTest.cptCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Local Code</label>
              <p className="text-base font-mono">{labTest.localCode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specimen & Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Specimen Type</label>
              <p className="text-base">{labTest.specimenType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Collection Method</label>
              <p className="text-base">{labTest.collectionMethod || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fasting Required</label>
              <p className="text-base">{labTest.fastingRequired ? 'Yes' : 'No'}</p>
            </div>
            {labTest.fastingRequired && labTest.fastingDurationHours && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fasting Duration</label>
                <p className="text-base">{labTest.fastingDurationHours} hours</p>
              </div>
            )}
          </div>
          {labTest.preparationInstructions && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preparation Instructions</label>
                <p className="text-base mt-2">{labTest.preparationInstructions}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Normal Ranges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {labTest.units && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Units</label>
                <p className="text-base">{labTest.units}</p>
              </div>
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Male)</label>
              <p className="text-base">{labTest.normalRangeMale || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Female)</label>
              <p className="text-base">{labTest.normalRangeFemale || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Pediatric)</label>
              <p className="text-base">{labTest.normalRangePediatric || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Result Analyte Template</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure analytes and optional group rows such as Differential Count. Manual result entry still stores atomic analyte rows; the hierarchy is used for panel structure and rendering.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={openGroupDialog}>
              <FolderTree className="h-4 w-4 mr-2" />
              Add group
            </Button>
            <Button variant="outline" size="sm" onClick={() => openPickerForParent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add root analyte
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Draft result entry seeds only analyte rows. Group rows such as Cell Counts or Differential Count organize the panel and keep CBC templates maintainable.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTemplates}
                disabled={!draftTemplates || replaceTemplates.isPending}
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSaveTemplates}
                disabled={!draftTemplates || replaceTemplates.isPending}
              >
                Save template
              </Button>
            </div>
          </div>

          {isLoadingTemplates ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Loading analyte template...
            </div>
          ) : rootTemplates.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No analytes configured yet. Add a group such as Differential Count, then add CBC components like WBC, RBC, HGB, HCT, and the leukocyte differential analytes under it.
            </div>
          ) : (
            <div className="space-y-4">
              {rootTemplates.map((template) => renderTemplateNode(template))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={pickerOpen} onOpenChange={(open) => (open ? setPickerOpen(true) : closePicker())}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Add laboratory analyte
              {pickerParent ? ` to ${pickerParent.displayLabel ?? 'group'}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="analyte-search">Search observation catalog</Label>
            <Input
              id="analyte-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search WBC, RBC, HGB, Neutrophils, LOINC code..."
            />
            <div className="flex flex-wrap gap-2">
              {(['all', 'hematology', 'chemistry', 'microbiology', 'coagulation', 'urinalysis', 'other'] as LabAnalyteDomain[]).map((domain) => (
                <Button
                  key={domain}
                  type="button"
                  size="sm"
                  variant={domainFilter === domain ? 'default' : 'outline'}
                  onClick={() => setDomainFilter(domain)}
                >
                  {domain === 'all' ? 'All analytes' : domain}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex-1 overflow-auto space-y-2">
            {isLoadingObservationCodes ? (
              <p className="text-sm text-muted-foreground">Loading laboratory observation codes...</p>
            ) : availableObservationCodes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No analytes match the current search.</p>
            ) : (
              (Object.entries(groupedObservationCodes) as Array<[Exclude<LabAnalyteDomain, 'all'>, ObservationCode[]]>)
                .filter(([, items]) => items.length > 0)
                .map(([domain, items]) => (
                  <div key={domain} className="space-y-2">
                    <div className="sticky top-0 z-10 bg-card py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {domain}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-start justify-between rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddTemplate(item)}
                      >
                        <div>
                          <div className="font-medium">{item.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.codeSystem} {item.code} {item.defaultUnit ? ` · ${item.defaultUnit}` : ''}
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {item.dataType}
                        </Badge>
                      </button>
                    ))}
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={groupDialogOpen} onOpenChange={(open) => (open ? setGroupDialogOpen(true) : closeGroupDialog())}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add template group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group label</Label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(event) => setNewGroupName(event.target.value)}
                placeholder="Differential Count"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeGroupDialog}>
                Cancel
              </Button>
              <Button onClick={handleAddGroup} disabled={!newGroupName.trim()}>
                Add group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit lab master maintenance fields</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-style">Report Style</Label>
              <Select
                value={editForm.reportStyle}
                onValueChange={(value) => setEditForm((current) => ({ ...current, reportStyle: value }))}
              >
                <SelectTrigger id="report-style">
                  <SelectValue placeholder="Select report style" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lab-discipline">Lab Discipline</Label>
              <Select
                value={editForm.labDiscipline || '__none__'}
                onValueChange={(value) =>
                  setEditForm((current) => ({
                    ...current,
                    labDiscipline: value === '__none__' ? '' : value,
                  }))
                }
              >
                <SelectTrigger id="lab-discipline">
                  <SelectValue placeholder="Select discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Not specified</SelectItem>
                  {LAB_DISCIPLINE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tat-hours">Turnaround Time (hours)</Label>
              <Input
                id="tat-hours"
                inputMode="numeric"
                value={editForm.turnaroundTimeHours}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    turnaroundTimeHours: event.target.value,
                  }))
                }
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference-lab">Reference Lab</Label>
              <Input
                id="reference-lab"
                value={editForm.referenceLab}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    referenceLab: event.target.value,
                  }))
                }
                placeholder="In-house"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Checkbox
              id="lab-active"
              checked={editForm.isActive}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
            />
            <div className="space-y-1">
              <Label htmlFor="lab-active">Active lab master</Label>
              <p className="text-sm text-muted-foreground">
                Inactive tests stay in the catalog but should not be offered for new orders.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLabTest} disabled={updateLabTest.isPending}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Processing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Turnaround Time</label>
              <p className="text-base">{labTest.turnaroundTimeHours ? `${labTest.turnaroundTimeHours} hours` : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reference Lab</label>
              <p className="text-base">{labTest.referenceLab || 'In-house'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogBillingMappingsPanel
            catalogType="lab_test"
            catalogItemId={labTestId}
            catalogItemName={labTest.testName}
            catalogItemCode={labTest.loincCode ?? labTest.cptCode ?? null}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(labTest.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-base">{new Date(labTest.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
