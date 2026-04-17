'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { Search, Loader2, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ResourceTable } from '@/components/tables/resource-table';
import { useToast } from '@/components/ui/use-toast';
import { useCatalogMappings, useCreateCatalogMapping } from '@/modules/rcm/hooks/use-catalog-mappings';
import { useBillingItems } from '@/modules/rcm/hooks/use-billing-items';
import { useMedications, useLabTests, useImagingStudies, useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import { useAdministrativeServices } from '@/modules/clinical/hooks/use-administrative-services';
import { usePackages } from '@/modules/clinical/hooks/use-packages';
import type { CatalogMapping, CatalogMappingFilters, CatalogType } from '@/modules/rcm/types/catalog-mapping';
import type { BillingItem } from '@/modules/rcm/types/billing-item';
import { ItemType } from '@/modules/rcm/types/billing-item';
import type { Medication, LabTest, ImagingStudy, Procedure } from '@/modules/foundation/types/catalog';
import type { AdministrativeService } from '@/modules/clinical/types/administrative-service';
import type { Package } from '@/modules/clinical/types/package';

// ─── Constants ───────────────────────────────────────────────────────────────

const catalogTypeLabels: Record<CatalogType, string> = {
  medication: 'Medication',
  lab_test: 'Lab test',
  imaging_study: 'Imaging study',
  procedure: 'Procedure',
  package: 'Package',
  administrative_service: 'Administrative service',
};

/** Maps catalog type → billing item itemType filter */
const catalogTypeToItemType: Partial<Record<CatalogType, ItemType>> = {
  medication: ItemType.PHARMACY,
  lab_test: ItemType.LAB,
  imaging_study: ItemType.IMAGING,
  procedure: ItemType.PROCEDURE,
  administrative_service: ItemType.MISC,
  package: ItemType.PACKAGE,
};

// ─── Resolved catalog item shape ─────────────────────────────────────────────

interface ResolvedCatalogItem {
  id: string;
  name: string;
  subLabel: string;
  primaryCode: string | null; // ndcCode / loincCode / cptCode used for auto-suggest
}

function resolveMedication(m: Medication): ResolvedCatalogItem {
  return {
    id: m.id,
    name: m.medicationName,
    subLabel: [m.genericName, m.dosageForm, m.strength].filter(Boolean).join(' · '),
    primaryCode: m.ndcCode ?? m.atcCode ?? null,
  };
}
function resolveLabTest(t: LabTest): ResolvedCatalogItem {
  return {
    id: t.id,
    name: t.testName,
    subLabel: [t.testCategory, t.testSubcategory].filter(Boolean).join(' · '),
    primaryCode: t.loincCode ?? t.cptCode ?? null,
  };
}
function resolveImagingStudy(s: ImagingStudy): ResolvedCatalogItem {
  return {
    id: s.id,
    name: s.studyName,
    subLabel: [s.modality, s.bodyPart].filter(Boolean).join(' · '),
    primaryCode: s.cptCode ?? null,
  };
}
function resolveProcedure(p: Procedure): ResolvedCatalogItem {
  return {
    id: p.id,
    name: p.procedureName,
    subLabel: [p.procedureCategory, p.bodySystem].filter(Boolean).join(' · '),
    primaryCode: p.cptCode ?? p.icd10PcsCode ?? null,
  };
}
function resolveAdministrativeService(s: AdministrativeService): ResolvedCatalogItem {
  return {
    id: s.id,
    name: s.serviceName,
    subLabel: [s.serviceCategory, s.careSetting].filter(Boolean).join(' · '),
    primaryCode: s.billingCode ?? s.serviceCode ?? null,
  };
}
function resolvePackage(p: Package): ResolvedCatalogItem {
  return {
    id: p.id,
    name: p.name,
    subLabel: [p.packageType, p.careSetting].filter(Boolean).join(' · '),
    primaryCode: p.code,
  };
}

// ─── Table columns ────────────────────────────────────────────────────────────

const createColumns = (): ColumnDef<CatalogMapping>[] => [
  {
    accessorKey: 'catalogType',
    header: 'Catalog',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold capitalize">{catalogTypeLabels[row.original.catalogType]}</p>
        <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{row.original.catalogItemId}</p>
      </div>
    ),
  },
  {
    accessorKey: 'billingItemId',
    header: 'Billing item',
    cell: ({ row }) => (
      <div>
        <p className="font-mono text-sm truncate max-w-[180px]">{row.original.billingItemId}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {row.original.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
          {row.original.isAutomatic && <Badge variant="outline" className="text-xs">Auto</Badge>}
          {row.original.requiresApproval && <Badge variant="secondary" className="text-xs">Needs approval</Badge>}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
    cell: ({ getValue }) => getValue<number | null>() ?? 1,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-600">Active</Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Effective',
    cell: ({ row }) => {
      const start = row.original.effectiveDate ? format(new Date(row.original.effectiveDate), 'PPP') : '—';
      const end = row.original.expirationDate ? format(new Date(row.original.expirationDate), 'PPP') : '—';
      return (
        <div className="text-sm">
          <p>{start}</p>
          <p className="text-xs text-muted-foreground">Ends: {end}</p>
        </div>
      );
    },
  },
];

// ─── Generic search combobox ──────────────────────────────────────────────────

interface ComboboxOption {
  id: string;
  label: string;
  subLabel?: string;
  code?: string | null;
  isSuggested?: boolean;
}

interface SearchComboboxProps {
  placeholder: string;
  value: ComboboxOption | null;
  options: ComboboxOption[];
  isLoading?: boolean;
  searchText: string;
  onSearchChange: (v: string) => void;
  onSelect: (opt: ComboboxOption) => void;
  onClear: () => void;
  disabled?: boolean;
  minChars?: number;
}

function SearchCombobox({
  placeholder,
  value,
  options,
  isLoading,
  searchText,
  onSearchChange,
  onSelect,
  onClear,
  disabled,
  minChars = 2,
}: SearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayValue = value ? value.label : searchText;

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8 pr-8"
          placeholder={placeholder}
          value={displayValue}
          disabled={disabled}
          onChange={(e) => {
            if (value) onClear();
            onSearchChange(e.target.value);
            setOpen(e.target.value.length >= minChars);
          }}
          onFocus={() => {
            if (!value && searchText.length >= minChars) setOpen(true);
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {value && (
          <button
            type="button"
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {value && (
        <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="font-medium">{value.label}</span>
          {value.code && <span className="font-mono text-xs text-muted-foreground">{value.code}</span>}
          {value.subLabel && <span className="text-xs text-muted-foreground">{value.subLabel}</span>}
        </div>
      )}

      {open && !value && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-64 overflow-y-auto">
          {options.length === 0 && !isLoading && searchText.length >= minChars ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results for &ldquo;{searchText}&rdquo;</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-start gap-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{opt.label}</span>
                    {opt.isSuggested && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                        <Sparkles className="h-3 w-3" />
                        Suggested
                      </span>
                    )}
                  </div>
                  {(opt.subLabel || opt.code) && (
                    <div className="text-xs text-muted-foreground truncate">
                      {opt.subLabel}
                      {opt.code && <span className="ml-2 font-mono">{opt.code}</span>}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Catalog item search (switches by type) ───────────────────────────────────

function useCatalogItemSearch(catalogType: CatalogType, search: string) {
  const enabled = search.length >= 2;
  const filters = enabled ? { search, isActive: true } : undefined;

  const meds = useMedications(catalogType === 'medication' ? filters : undefined);
  const labs = useLabTests(catalogType === 'lab_test' ? filters : undefined);
  const imaging = useImagingStudies(catalogType === 'imaging_study' ? filters : undefined);
  const procedures = useProcedures(catalogType === 'procedure' ? filters : undefined);
  const adminServices = useAdministrativeServices(catalogType === 'administrative_service' ? filters : undefined);
  const packages = usePackages(catalogType === 'package' ? filters : undefined);

  const isLoading =
    (catalogType === 'medication' && meds.isFetching) ||
    (catalogType === 'lab_test' && labs.isFetching) ||
    (catalogType === 'imaging_study' && imaging.isFetching) ||
    (catalogType === 'procedure' && procedures.isFetching) ||
    (catalogType === 'administrative_service' && adminServices.isFetching) ||
    (catalogType === 'package' && packages.isFetching);

  const items: ResolvedCatalogItem[] = useMemo(() => {
    if (!enabled) return [];
    if (catalogType === 'medication') return (meds.data ?? []).map(resolveMedication);
    if (catalogType === 'lab_test') return (labs.data ?? []).map(resolveLabTest);
    if (catalogType === 'imaging_study') return (imaging.data ?? []).map(resolveImagingStudy);
    if (catalogType === 'procedure') return (procedures.data ?? []).map(resolveProcedure);
    if (catalogType === 'administrative_service') return (adminServices.data ?? []).map(resolveAdministrativeService);
    if (catalogType === 'package') return (packages.data ?? []).map(resolvePackage);
    return [];
  }, [catalogType, enabled, meds.data, labs.data, imaging.data, procedures.data, adminServices.data, packages.data]);

  return { items, isLoading };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CatalogMappingsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();

  // Filters
  const [filters, setFilters] = useState<CatalogMappingFilters>({ isActive: true });

  // Form state
  const [catalogType, setCatalogType] = useState<CatalogType>('lab_test');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<ResolvedCatalogItem | null>(null);

  const [billingSearch, setBillingSearch] = useState('');
  const [selectedBillingItem, setSelectedBillingItem] = useState<BillingItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [isPrimary, setIsPrimary] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [mappingReason, setMappingReason] = useState('');
  const [notes, setNotes] = useState('');

  // Catalog item search
  const { items: catalogItems, isLoading: searchingCatalog } = useCatalogItemSearch(catalogType, catalogSearch);

  // Billing item search — filtered by matching itemType when one is known
  const billingItemType = catalogTypeToItemType[catalogType];
  const { data: billingItemResults = [], isFetching: searchingBilling } = useBillingItems(
    billingSearch.length >= 2
      ? { search: billingSearch, itemType: billingItemType, isActive: true, includeGlobal: true }
      : undefined,
  );

  // Auto-suggest: put billing items whose code matches the catalog item's code first
  const catalogItemCode = selectedCatalogItem?.primaryCode?.toLowerCase() ?? null;
  const billingOptions: ComboboxOption[] = useMemo(() => {
    return billingItemResults.map((b) => ({
      id: b.id,
      label: b.billingDescription,
      subLabel: b.billingCode,
      code: b.billingCode,
      isSuggested: catalogItemCode != null && b.billingCode.toLowerCase() === catalogItemCode,
    })).sort((a, b) => (b.isSuggested ? 1 : 0) - (a.isSuggested ? 1 : 0));
  }, [billingItemResults, catalogItemCode]);

  const { data: mappings, isLoading, error } = useCatalogMappings(filters);
  const { mutateAsync: createMapping, isPending: isCreating } = useCreateCatalogMapping();
  const columns = useMemo(() => createColumns(), []);

  const resetForm = useCallback(() => {
    setCatalogSearch('');
    setSelectedCatalogItem(null);
    setBillingSearch('');
    setSelectedBillingItem(null);
    setQuantity(1);
    setMappingReason('');
    setNotes('');
  }, []);

  const handleCatalogTypeChange = (value: string) => {
    setCatalogType(value as CatalogType);
    setCatalogSearch('');
    setSelectedCatalogItem(null);
    setBillingSearch('');
    setSelectedBillingItem(null);
  };

  const handleCreate = async () => {
    if (!selectedCatalogItem || !selectedBillingItem) {
      toast.toast({
        variant: 'destructive',
        title: 'Missing selection',
        description: 'Please select a catalog item and a billing item.',
      });
      return;
    }

    try {
      await createMapping({
        catalogType,
        catalogItemId: selectedCatalogItem.id,
        billingItemId: selectedBillingItem.id,
        quantity,
        isAutomatic,
        isPrimary,
        requiresApproval,
        mappingReason: mappingReason || undefined,
        notes: notes || undefined,
        isActive: true,
      });
      toast.toast({ title: 'Mapping created', description: 'Catalog mapping saved successfully.' });
      resetForm();
    } catch (err) {
      toast.toast({
        variant: 'destructive',
        title: 'Failed to create mapping',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Catalog mappings</h1>
          <p className="text-muted-foreground">Link clinical catalogs to billing items for charge automation.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/rcm-setup/catalog-mappings/suggestions`}>
            <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
            Suggested mappings
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Catalog type</Label>
            <Select
              value={filters.catalogType ?? 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, catalogType: value === 'all' ? undefined : (value as CatalogType) }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(catalogTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, isActive: value === 'all' ? undefined : value === 'active' }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Primary only</Label>
            <Select
              value={filters.isPrimary === undefined ? 'all' : filters.isPrimary ? 'yes' : 'no'}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, isPrimary: value === 'all' ? undefined : value === 'yes' }))
              }
            >
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Primary</SelectItem>
                <SelectItem value="no">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Billing item ID</Label>
            <Input
              placeholder="Billing item UUID"
              value={filters.billingItemId ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, billingItemId: e.target.value || undefined }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Create mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Row 1: Catalog type + catalog item search */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Catalog type</Label>
              <Select value={catalogType} onValueChange={handleCatalogTypeChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(catalogTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>{catalogTypeLabels[catalogType]} *</Label>
              <SearchCombobox
                placeholder={`Search ${catalogTypeLabels[catalogType].toLowerCase()}…`}
                value={selectedCatalogItem ? { id: selectedCatalogItem.id, label: selectedCatalogItem.name, subLabel: selectedCatalogItem.subLabel, code: selectedCatalogItem.primaryCode } : null}
                options={catalogItems.map((item) => ({ id: item.id, label: item.name, subLabel: item.subLabel, code: item.primaryCode }))}
                isLoading={searchingCatalog}
                searchText={catalogSearch}
                onSearchChange={setCatalogSearch}
                onSelect={(opt) => {
                  const found = catalogItems.find((i) => i.id === opt.id);
                  if (found) setSelectedCatalogItem(found);
                }}
                onClear={() => { setSelectedCatalogItem(null); setCatalogSearch(''); }}
              />
            </div>
          </div>

          {/* Row 2: Billing item search */}
          <div className="space-y-1">
            <Label>
              Billing item *
              {billingItemType && (
                <span className="ml-1 text-xs text-muted-foreground">
                  (filtered to {billingItemType} items
                  {selectedCatalogItem?.primaryCode && ` · ✨ suggested matches highlighted`})
                </span>
              )}
            </Label>
            <SearchCombobox
              placeholder="Search billing items…"
              value={selectedBillingItem ? { id: selectedBillingItem.id, label: selectedBillingItem.billingDescription, code: selectedBillingItem.billingCode } : null}
              options={billingOptions}
              isLoading={searchingBilling}
              searchText={billingSearch}
              onSearchChange={setBillingSearch}
              onSelect={(opt) => {
                const found = billingItemResults.find((b) => b.id === opt.id);
                if (found) setSelectedBillingItem(found);
              }}
              onClear={() => { setSelectedBillingItem(null); setBillingSearch(''); }}
              disabled={!selectedCatalogItem}
            />
            {!selectedCatalogItem && (
              <p className="text-xs text-muted-foreground">Select a catalog item first to enable billing item search.</p>
            )}
          </div>

          {/* Row 3: Quantity + reason + notes */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-1">
              <Label>Mapping reason</Label>
              <Input
                placeholder="Why this mapping exists"
                value={mappingReason}
                onChange={(e) => setMappingReason(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                rows={1}
                placeholder="Optional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Flags + submit */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="auto" checked={isAutomatic} onCheckedChange={setIsAutomatic} />
                <Label htmlFor="auto">Automatic</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="primary" checked={isPrimary} onCheckedChange={setIsPrimary} />
                <Label htmlFor="primary">Primary</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="requires-approval" checked={requiresApproval} onCheckedChange={setRequiresApproval} />
                <Label htmlFor="requires-approval">Requires approval</Label>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={isCreating || !selectedCatalogItem || !selectedBillingItem}>
              {isCreating ? 'Saving…' : 'Create mapping'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load catalog mappings: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Catalog mappings"
          columns={columns}
          data={mappings ?? []}
          isLoading={isLoading}
          emptyState="No mappings found for the selected filters."
          cta={<div />}
        />
      )}
    </div>
  );
}
