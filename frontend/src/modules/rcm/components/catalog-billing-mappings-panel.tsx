'use client';

/**
 * CatalogBillingMappingsPanel
 *
 * Reusable panel that shows existing CatalogItemMappings and lets the user
 * create new ones inline. Works in two modes:
 *
 * 1. "catalog" mode  — used on clinical catalog detail pages (medication, lab test, etc.)
 *    - catalogType + catalogItemId are fixed (pre-populated)
 *    - The user searches for a billing item to map to
 *
 * 2. "billing" mode  — used on the billing item detail page
 *    - billingItemId is fixed (pre-populated)
 *    - The user picks a catalog type then searches for a catalog item
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Trash2, Search, Loader2, CheckCircle2, Sparkles, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  useCatalogMappings,
  useCreateCatalogMapping,
  useDeleteCatalogMapping,
} from '@/modules/rcm/hooks/use-catalog-mappings';
import { useBillingItems, useBillingItem } from '@/modules/rcm/hooks/use-billing-items';
import { useMedications, useLabTests, useImagingStudies, useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import { useAdministrativeServices } from '@/modules/clinical/hooks/use-administrative-services';
import { usePackages } from '@/modules/clinical/hooks/use-packages';
import type { CatalogType } from '@/modules/rcm/types/catalog-mapping';
import type { BillingItem } from '@/modules/rcm/types/billing-item';
import { ItemType } from '@/modules/rcm/types/billing-item';
import type { Medication, LabTest, ImagingStudy, Procedure } from '@/modules/foundation/types/catalog';
import type { AdministrativeService } from '@/modules/clinical/types/administrative-service';
import type { Package } from '@/modules/clinical/types/package';

// ─── Constants ────────────────────────────────────────────────────────────────

const catalogTypeLabels: Record<CatalogType, string> = {
  medication: 'Medication',
  lab_test: 'Lab test',
  imaging_study: 'Imaging study',
  procedure: 'Procedure',
  package: 'Package',
  administrative_service: 'Administrative service',
};

const catalogTypeToItemType: Partial<Record<CatalogType, ItemType>> = {
  medication: ItemType.PHARMACY,
  lab_test: ItemType.LAB,
  imaging_study: ItemType.IMAGING,
  procedure: ItemType.PROCEDURE,
  administrative_service: ItemType.MISC,
  package: ItemType.PACKAGE,
};

// ─── Catalog item helpers ─────────────────────────────────────────────────────

interface ResolvedCatalogItem {
  id: string;
  name: string;
  subLabel: string;
  primaryCode: string | null;
}

function resolveMedication(m: Medication): ResolvedCatalogItem {
  return { id: m.id, name: m.medicationName, subLabel: [m.genericName, m.dosageForm, m.strength].filter(Boolean).join(' · '), primaryCode: m.ndcCode ?? m.atcCode ?? null };
}
function resolveLabTest(t: LabTest): ResolvedCatalogItem {
  return { id: t.id, name: t.testName, subLabel: [t.testCategory, t.testSubcategory].filter(Boolean).join(' · '), primaryCode: t.loincCode ?? t.cptCode ?? null };
}
function resolveImagingStudy(s: ImagingStudy): ResolvedCatalogItem {
  return { id: s.id, name: s.studyName, subLabel: [s.modality, s.bodyPart].filter(Boolean).join(' · '), primaryCode: s.cptCode ?? null };
}
function resolveProcedure(p: Procedure): ResolvedCatalogItem {
  return { id: p.id, name: p.procedureName, subLabel: [p.procedureCategory, p.bodySystem].filter(Boolean).join(' · '), primaryCode: p.cptCode ?? p.icd10PcsCode ?? null };
}
function resolveAdministrativeService(s: AdministrativeService): ResolvedCatalogItem {
  return { id: s.id, name: s.serviceName, subLabel: [s.serviceCategory, s.careSetting].filter(Boolean).join(' · '), primaryCode: s.billingCode ?? s.serviceCode ?? null };
}
function resolvePackage(p: Package): ResolvedCatalogItem {
  return { id: p.id, name: p.name, subLabel: [p.packageType, p.careSetting].filter(Boolean).join(' · '), primaryCode: p.code };
}

// ─── Small search combobox (inline) ──────────────────────────────────────────

interface ComboboxOption { id: string; label: string; subLabel?: string; code?: string | null; isSuggested?: boolean; }

function SearchCombobox({
  placeholder, value, options, isLoading, searchText, onSearchChange, onSelect, onClear, disabled,
}: {
  placeholder: string; value: ComboboxOption | null; options: ComboboxOption[]; isLoading?: boolean;
  searchText: string; onSearchChange: (v: string) => void; onSelect: (o: ComboboxOption) => void;
  onClear: () => void; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8 pr-8"
          placeholder={placeholder}
          value={value ? value.label : searchText}
          disabled={disabled}
          onChange={(e) => { if (value) onClear(); onSearchChange(e.target.value); setOpen(e.target.value.length >= 2); }}
          onFocus={() => { if (!value && searchText.length >= 2) setOpen(true); }}
        />
        {isLoading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
        {value && <button type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={onClear}><X className="h-4 w-4" /></button>}
      </div>
      {value && (
        <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="font-medium">{value.label}</span>
          {value.code && <span className="font-mono text-xs text-muted-foreground">{value.code}</span>}
        </div>
      )}
      {open && !value && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-56 overflow-y-auto">
          {options.length === 0 && !isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results for &ldquo;{searchText}&rdquo;</div>
          ) : options.map((opt) => (
            <button key={opt.id} type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-start gap-2"
              onMouseDown={(e) => { e.preventDefault(); onSelect(opt); setOpen(false); }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{opt.label}</span>
                  {opt.isSuggested && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                      <Sparkles className="h-3 w-3" />Suggested
                    </span>
                  )}
                </div>
                {(opt.subLabel || opt.code) && (
                  <div className="text-xs text-muted-foreground truncate">{opt.subLabel}{opt.code && <span className="ml-2 font-mono">{opt.code}</span>}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Catalog item search hook ─────────────────────────────────────────────────

function useCatalogSearch(catalogType: CatalogType, search: string) {
  const enabled = search.length >= 2;
  const f = enabled ? { search, isActive: true } : undefined;
  const meds = useMedications(catalogType === 'medication' ? f : undefined);
  const labs = useLabTests(catalogType === 'lab_test' ? f : undefined);
  const imaging = useImagingStudies(catalogType === 'imaging_study' ? f : undefined);
  const procs = useProcedures(catalogType === 'procedure' ? f : undefined);
  const adminServices = useAdministrativeServices(catalogType === 'administrative_service' ? f : undefined);
  const packages = usePackages(catalogType === 'package' ? f : undefined);
  const isLoading =
    (catalogType === 'medication' && meds.isFetching) ||
    (catalogType === 'lab_test' && labs.isFetching) ||
    (catalogType === 'imaging_study' && imaging.isFetching) ||
    (catalogType === 'procedure' && procs.isFetching) ||
    (catalogType === 'administrative_service' && adminServices.isFetching) ||
    (catalogType === 'package' && packages.isFetching);
  const items = useMemo<ResolvedCatalogItem[]>(() => {
    if (!enabled) return [];
    if (catalogType === 'medication') return (meds.data ?? []).map(resolveMedication);
    if (catalogType === 'lab_test') return (labs.data ?? []).map(resolveLabTest);
    if (catalogType === 'imaging_study') return (imaging.data ?? []).map(resolveImagingStudy);
    if (catalogType === 'procedure') return (procs.data ?? []).map(resolveProcedure);
    if (catalogType === 'administrative_service') return (adminServices.data ?? []).map(resolveAdministrativeService);
    if (catalogType === 'package') return (packages.data ?? []).map(resolvePackage);
    return [];
  }, [catalogType, enabled, meds.data, labs.data, imaging.data, procs.data, adminServices.data, packages.data]);
  return { items, isLoading };
}

// ─── Add Mapping Dialog ───────────────────────────────────────────────────────

interface AddMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fixed catalog side (catalog mode) */
  fixedCatalogType?: CatalogType;
  fixedCatalogItemId?: string;
  fixedCatalogItemName?: string;
  fixedCatalogItemCode?: string | null;
  /** Pre-fixed billing side (billing mode) */
  fixedBillingItemId?: string;
  fixedBillingItem?: BillingItem;
}

function AddMappingDialog({
  open, onOpenChange,
  fixedCatalogType, fixedCatalogItemId, fixedCatalogItemName, fixedCatalogItemCode,
  fixedBillingItemId, fixedBillingItem,
}: AddMappingDialogProps) {
  const toast = useToast();
  const { mutateAsync: createMapping, isPending } = useCreateCatalogMapping();

  // Catalog side (when in "billing" mode)
  const [catalogType, setCatalogType] = useState<CatalogType>(fixedCatalogType ?? 'lab_test');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState<ResolvedCatalogItem | null>(null);

  // Billing side (when in "catalog" mode)
  const [billingSearch, setBillingSearch] = useState('');
  const [selectedBilling, setSelectedBilling] = useState<BillingItem | null>(null);

  // Flags
  const [isPrimary, setIsPrimary] = useState(true);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isCatalogMode = Boolean(fixedCatalogItemId);

  // Resolved values
  const effectiveCatalogType = fixedCatalogType ?? catalogType;
  const effectiveCatalogItemId = fixedCatalogItemId ?? selectedCatalog?.id;
  const effectiveBillingItemId = fixedBillingItemId ?? selectedBilling?.id;

  const billingItemType = catalogTypeToItemType[effectiveCatalogType];
  const primaryCode = fixedCatalogItemCode ?? selectedCatalog?.primaryCode ?? null;

  // Catalog item search (billing mode only)
  const { items: catalogItems, isLoading: searchingCatalog } = useCatalogSearch(catalogType, catalogSearch);

  // Billing item search (catalog mode)
  const { data: billingResults = [], isFetching: searchingBilling } = useBillingItems(
    billingSearch.length >= 2 ? { search: billingSearch, itemType: billingItemType, isActive: true, includeGlobal: true } : undefined,
  );

  // Auto-suggest
  const billingOptions: ComboboxOption[] = useMemo(() => billingResults.map((b) => ({
    id: b.id, label: b.billingDescription, subLabel: b.billingCode, code: b.billingCode,
    isSuggested: primaryCode != null && b.billingCode.toLowerCase() === primaryCode.toLowerCase(),
  })).sort((a, b) => (b.isSuggested ? 1 : 0) - (a.isSuggested ? 1 : 0)), [billingResults, primaryCode]);

  const handleReset = () => {
    setCatalogSearch(''); setSelectedCatalog(null);
    setBillingSearch(''); setSelectedBilling(null);
    setCatalogType(fixedCatalogType ?? 'lab_test');
    setIsPrimary(true); setIsAutomatic(true); setRequiresApproval(false); setQuantity(1);
  };

  const handleSubmit = async () => {
    if (!effectiveCatalogItemId || !effectiveBillingItemId) return;
    try {
      await createMapping({
        catalogType: effectiveCatalogType,
        catalogItemId: effectiveCatalogItemId,
        billingItemId: effectiveBillingItemId,
        quantity,
        isPrimary,
        isAutomatic,
        requiresApproval,
        isActive: true,
      });
      toast.toast({ title: 'Mapping created' });
      handleReset();
      onOpenChange(false);
    } catch (err) {
      toast.toast({ variant: 'destructive', title: 'Failed', description: (err as Error).message });
    }
  };

  const canSubmit = Boolean(effectiveCatalogItemId && effectiveBillingItemId);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>Add Billing Mapping</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Catalog side */}
          {isCatalogMode ? (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Catalog item: </span>
              <span className="font-medium">{fixedCatalogItemName}</span>
              {fixedCatalogItemCode && <span className="ml-2 font-mono text-xs text-muted-foreground">{fixedCatalogItemCode}</span>}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Catalog type</Label>
                  <Select value={catalogType} onValueChange={(v) => { setCatalogType(v as CatalogType); setSelectedCatalog(null); setCatalogSearch(''); }}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(catalogTypeLabels).map(([k, l]) => (
                        <SelectItem key={k} value={k} className="text-xs">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantity</Label>
                  <Input type="number" min={0} value={quantity} className="h-8 text-xs" onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Catalog item *</Label>
                <SearchCombobox
                  placeholder={`Search ${catalogTypeLabels[catalogType].toLowerCase()}…`}
                  value={selectedCatalog ? { id: selectedCatalog.id, label: selectedCatalog.name, subLabel: selectedCatalog.subLabel, code: selectedCatalog.primaryCode } : null}
                  options={catalogItems.map((i) => ({ id: i.id, label: i.name, subLabel: i.subLabel, code: i.primaryCode }))}
                  isLoading={searchingCatalog}
                  searchText={catalogSearch}
                  onSearchChange={setCatalogSearch}
                  onSelect={(opt) => { const found = catalogItems.find((i) => i.id === opt.id); if (found) setSelectedCatalog(found); }}
                  onClear={() => { setSelectedCatalog(null); setCatalogSearch(''); }}
                />
              </div>
            </div>
          )}

          {/* Billing side */}
          {fixedBillingItemId ? (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Billing item: </span>
              <span className="font-medium">{fixedBillingItem?.billingDescription}</span>
              {fixedBillingItem?.billingCode && <span className="ml-2 font-mono text-xs text-muted-foreground">{fixedBillingItem.billingCode}</span>}
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-xs">
                Billing item *
                {primaryCode && <span className="ml-1 text-xs text-muted-foreground">(✨ code-matched suggestions highlighted)</span>}
              </Label>
              <SearchCombobox
                placeholder="Search billing items…"
                value={selectedBilling ? { id: selectedBilling.id, label: selectedBilling.billingDescription, code: selectedBilling.billingCode } : null}
                options={billingOptions}
                isLoading={searchingBilling}
                searchText={billingSearch}
                onSearchChange={setBillingSearch}
                onSelect={(opt) => { const found = billingResults.find((b) => b.id === opt.id); if (found) setSelectedBilling(found); }}
                onClear={() => { setSelectedBilling(null); setBillingSearch(''); }}
                disabled={!isCatalogMode && !selectedCatalog}
              />
            </div>
          )}

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Switch id="dlg-primary" checked={isPrimary} onCheckedChange={setIsPrimary} />
              <Label htmlFor="dlg-primary" className="text-xs">Primary</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="dlg-auto" checked={isAutomatic} onCheckedChange={setIsAutomatic} />
              <Label htmlFor="dlg-auto" className="text-xs">Automatic</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="dlg-approval" checked={requiresApproval} onCheckedChange={setRequiresApproval} />
              <Label htmlFor="dlg-approval" className="text-xs">Requires approval</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !canSubmit}>
            {isPending ? 'Saving…' : 'Create mapping'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main exported panel ──────────────────────────────────────────────────────

export interface CatalogBillingMappingsPanelProps {
  /** "catalog" mode — fixed catalog item, user picks billing item */
  catalogType?: CatalogType;
  catalogItemId?: string;
  catalogItemName?: string;
  catalogItemCode?: string | null;
  /** "billing" mode — fixed billing item, user picks catalog item */
  billingItemId?: string;
  billingItem?: BillingItem;
}

export function CatalogBillingMappingsPanel({
  catalogType, catalogItemId, catalogItemName, catalogItemCode,
  billingItemId, billingItem,
}: CatalogBillingMappingsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();

  const { data: mappings = [], isLoading } = useCatalogMappings(
    catalogItemId
      ? { catalogType, catalogItemId }
      : billingItemId
        ? { billingItemId }
        : undefined,
  );

  const { mutateAsync: deleteMapping, isPending: isDeleting } = useDeleteCatalogMapping();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this mapping?')) return;
    try {
      await deleteMapping(id);
      toast.toast({ title: 'Mapping removed' });
    } catch (err) {
      toast.toast({ variant: 'destructive', title: 'Failed', description: (err as Error).message });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading…' : mappings.length === 0 ? 'No mappings yet.' : `${mappings.length} mapping${mappings.length !== 1 ? 's' : ''}`}
        </p>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add mapping
        </Button>
      </div>

      {mappings.length > 0 && (
        <div className="divide-y rounded-md border text-sm">
          {mappings.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-3 py-2 gap-3">
              <div className="flex-1 min-w-0">
                {/* In catalog mode show the billing item; in billing mode show the catalog item */}
                {catalogItemId ? (
                  <div>
                    {m.billingItem ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-medium">{m.billingItem.billingCode}</span>
                        <span className="text-xs text-muted-foreground truncate">{m.billingItem.billingDescription}</span>
                        {m.billingItem.listPrice != null && (
                          <span className="text-xs text-muted-foreground">· ₹{Number(m.billingItem.listPrice).toFixed(2)}</span>
                        )}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground truncate block">{m.billingItemId}</span>
                    )}
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {m.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                      {m.isAutomatic && <Badge variant="outline" className="text-xs">Auto</Badge>}
                      {m.requiresApproval && <Badge variant="secondary" className="text-xs">Needs approval</Badge>}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="capitalize text-xs text-muted-foreground">{catalogTypeLabels[m.catalogType]}</span>
                    <span className="font-mono text-xs ml-2 truncate">{m.catalogItemId}</span>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {m.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                      {m.isAutomatic && <Badge variant="outline" className="text-xs">Auto</Badge>}
                    </div>
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive shrink-0" disabled={isDeleting} onClick={() => handleDelete(m.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AddMappingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fixedCatalogType={catalogType}
        fixedCatalogItemId={catalogItemId}
        fixedCatalogItemName={catalogItemName}
        fixedCatalogItemCode={catalogItemCode}
        fixedBillingItemId={billingItemId}
        fixedBillingItem={billingItem}
      />
    </div>
  );
}
