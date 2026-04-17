'use client';

/**
 * Suggested Catalog Mappings
 *
 * Finds clinical catalog items and billing items that share the same code
 * (e.g., lab test with loincCode "85025" ↔ billing item with billingCode "85025")
 * but have no existing mapping. Shows them as suggestions for quick one-click creation.
 *
 * This is a pure-frontend feature — all matching is done client-side using the
 * existing clinical API and RCM billing items API.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { useBillingItems } from '@/modules/rcm/hooks/use-billing-items';
import { useMedications, useLabTests, useImagingStudies, useProcedures } from '@/modules/foundation/hooks/use-catalogs';
import { useCatalogMappings, useCreateCatalogMapping } from '@/modules/rcm/hooks/use-catalog-mappings';
import type { CatalogType } from '@/modules/rcm/types/catalog-mapping';
import { ItemType, BillingCodeType } from '@/modules/rcm/types/billing-item';
import type { BillingItem } from '@/modules/rcm/types/billing-item';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SuggestedPair {
  catalogType: CatalogType;
  catalogItemId: string;
  catalogItemName: string;
  catalogItemCode: string;
  billingItem: BillingItem;
}

// ─── Code extraction per catalog type ────────────────────────────────────────

const CATALOG_OPTIONS: { value: CatalogType; label: string; itemType: ItemType }[] = [
  { value: 'lab_test', label: 'Lab Tests', itemType: ItemType.LAB },
  { value: 'imaging_study', label: 'Imaging Studies', itemType: ItemType.IMAGING },
  { value: 'procedure', label: 'Procedures', itemType: ItemType.PROCEDURE },
  { value: 'medication', label: 'Medications', itemType: ItemType.PHARMACY },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MappingSuggestionsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();

  const [catalogType, setCatalogType] = useState<CatalogType>('lab_test');
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [createdIds, setCreatedIds] = useState<Set<string>>(new Set());

  const option = CATALOG_OPTIONS.find((o) => o.value === catalogType)!;

  // Fetch all active catalog items (no search filter — we want all of them for matching)
  const { data: medications = [], isFetching: loadingMeds } = useMedications(
    catalogType === 'medication' ? { isActive: true, includeGlobal: true } : undefined,
  );
  const { data: labTests = [], isFetching: loadingLabs } = useLabTests(
    catalogType === 'lab_test' ? { isActive: true, includeGlobal: true } : undefined,
  );
  const { data: imagingStudies = [], isFetching: loadingImaging } = useImagingStudies(
    catalogType === 'imaging_study' ? { isActive: true, includeGlobal: true } : undefined,
  );
  const { data: procedures = [], isFetching: loadingProcs } = useProcedures(
    catalogType === 'procedure' ? { isActive: true, includeGlobal: true } : undefined,
  );

  // Fetch billing items for the matching itemType
  const { data: billingItems = [], isFetching: loadingBilling } = useBillingItems({
    itemType: option.itemType,
    isActive: true,
    includeGlobal: true,
  });

  // Fetch existing mappings to exclude already-mapped pairs
  const { data: existingMappings = [], isFetching: loadingMappings } = useCatalogMappings({
    catalogType,
    isActive: true,
  });

  const { mutateAsync: createMapping } = useCreateCatalogMapping();

  const isLoading = loadingMeds || loadingLabs || loadingImaging || loadingProcs || loadingBilling || loadingMappings;

  // Build a set of already-mapped pairs: "catalogItemId::billingItemId"
  const existingPairKeys = useMemo(
    () => new Set(existingMappings.map((m) => `${m.catalogItemId}::${m.billingItemId}`)),
    [existingMappings],
  );

  // Build a code → billing items lookup
  const billingByCode = useMemo(() => {
    const map = new Map<string, BillingItem[]>();
    for (const b of billingItems) {
      const code = b.billingCode.toLowerCase().trim();
      if (!map.has(code)) map.set(code, []);
      map.get(code)!.push(b);
    }
    return map;
  }, [billingItems]);

  // Generate suggestions by matching catalog item codes to billing item codes
  const suggestions = useMemo<SuggestedPair[]>(() => {
    const pairs: SuggestedPair[] = [];

    const tryMatch = (catalogItemId: string, name: string, codes: (string | null | undefined)[]) => {
      for (const code of codes) {
        if (!code) continue;
        const normalized = code.toLowerCase().trim();
        const matched = billingByCode.get(normalized) ?? [];
        for (const b of matched) {
          const key = `${catalogItemId}::${b.id}`;
          if (!existingPairKeys.has(key) && !createdIds.has(key)) {
            pairs.push({ catalogType, catalogItemId, catalogItemName: name, catalogItemCode: code, billingItem: b });
          }
        }
      }
    };

    if (catalogType === 'lab_test') {
      for (const t of labTests) tryMatch(t.id, t.testName, [t.loincCode, t.cptCode]);
    } else if (catalogType === 'imaging_study') {
      for (const s of imagingStudies) tryMatch(s.id, s.studyName, [s.cptCode]);
    } else if (catalogType === 'procedure') {
      for (const p of procedures) tryMatch(p.id, p.procedureName, [p.cptCode, p.icd10PcsCode]);
    } else if (catalogType === 'medication') {
      for (const m of medications) tryMatch(m.id, m.medicationName, [m.ndcCode, m.atcCode]);
    }

    return pairs;
  }, [catalogType, labTests, imagingStudies, procedures, medications, billingByCode, existingPairKeys, createdIds]);

  const handleCreate = async (pair: SuggestedPair) => {
    const key = `${pair.catalogItemId}::${pair.billingItem.id}`;
    setCreatingId(key);
    try {
      await createMapping({
        catalogType: pair.catalogType,
        catalogItemId: pair.catalogItemId,
        billingItemId: pair.billingItem.id,
        quantity: 1,
        isPrimary: true,
        isAutomatic: true,
        requiresApproval: false,
        isActive: true,
        mappingReason: 'Auto-suggested: code match',
      });
      setCreatedIds((prev) => new Set([...prev, key]));
      toast.toast({ title: 'Mapping created', description: `${pair.catalogItemName} → ${pair.billingItem.billingDescription}` });
    } catch (err) {
      toast.toast({ variant: 'destructive', title: 'Failed', description: (err as Error).message });
    } finally {
      setCreatingId(null);
    }
  };

  const handleCreateAll = async () => {
    for (const pair of suggestions) {
      await handleCreate(pair);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/catalog-mappings`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Suggested Mappings
          </h1>
          <p className="text-muted-foreground">
            Clinical catalog items and billing items that share the same code but have no mapping yet.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Catalog type</label>
            <Select value={catalogType} onValueChange={(v) => { setCatalogType(v as CatalogType); setCreatedIds(new Set()); }}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATALOG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!isLoading && suggestions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleCreateAll} disabled={creatingId != null}>
                Accept all ({suggestions.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Finding matches…
        </div>
      ) : suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <p className="font-medium">All code-matched pairs are already mapped!</p>
          <p className="text-sm">No unlinked {option.label.toLowerCase()} found for the current billing items.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found <strong>{suggestions.length}</strong> unlinked {option.label.toLowerCase()} with matching billing item codes.
          </p>
          <div className="rounded-md border divide-y">
            {suggestions.map((pair) => {
              const key = `${pair.catalogItemId}::${pair.billingItem.id}`;
              const isCreating = creatingId === key;
              return (
                <div key={key} className="flex items-center gap-4 px-4 py-3">
                  {/* Catalog side */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{pair.catalogItemName}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="capitalize">{pair.catalogType.replace('_', ' ')}</span>
                      <span className="ml-2 font-mono">{pair.catalogItemCode}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-foreground shrink-0">→</div>

                  {/* Billing item */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{pair.billingItem.billingDescription}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-mono">{pair.billingItem.billingCode}</span>
                      <Badge variant="outline" className="text-xs">{pair.billingItem.billingCodeType}</Badge>
                      {pair.billingItem.listPrice != null && (
                        <span>AED {Number(pair.billingItem.listPrice).toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Match indicator */}
                  <div className="flex items-center gap-1 text-xs text-amber-600 shrink-0">
                    <Sparkles className="h-3 w-3" />
                    code match
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isCreating || creatingId != null}
                    onClick={() => handleCreate(pair)}
                  >
                    {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Accept'}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-md border bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Accepted mappings are created as Primary + Automatic. Review and adjust on the{' '}
            <Link href={`/${locale}/rcm-setup/catalog-mappings`} className="underline">mappings page</Link> if needed.
          </div>
        </div>
      )}
    </div>
  );
}
