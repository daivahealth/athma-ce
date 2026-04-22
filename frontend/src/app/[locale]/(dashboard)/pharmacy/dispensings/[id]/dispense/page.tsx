'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  Search,
  Pill,
  PackageCheck,
  X,
  ClipboardList,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
  usePharmacyDispensing,
  useVerifyDispensing,
  useExecuteDispense,
} from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { usePharmacyStock } from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import { usePrescriptionHeader } from '@/modules/pharmacy/hooks/use-prescription-header';
import { DispensingStatus, DispensingSource } from '@/modules/pharmacy/types/dispensing';
import { DispensingPatientHeader } from '@/modules/pharmacy/components/DispensingPatientHeader';
import type { PharmacyStock } from '@/modules/pharmacy/types/stock';
import type { PrescriptionDrugItemResponse } from '@/modules/pharmacy/services/prescription-header-service';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface DispenseItem {
  rowId: string;
  /** Set when this row comes from a prescription drug line */
  prescriptionOrderId?: string;
  /** Set when the pharmacist has chosen a stock batch */
  stock: PharmacyStock | null;
  quantityDispensed: number;
  dispensingInstructions: string;
  isSubstituted: boolean;
  substitutionReason: string;
  /** Drug name shown even before a batch is selected (from prescription) */
  prescribedDrugName?: string;
  prescribedDrugCode?: string;
  prescribedDosage?: string;
  prescribedFrequency?: string;
  prescribedQuantity?: string | null;
}

/* ─── Inline stock selector (filtered by drug code if known) ──────────── */
function StockSelector({
  drugCode,
  onSelect,
}: {
  drugCode?: string;
  onSelect: (stock: PharmacyStock) => void;
}) {
  const [search, setSearch] = useState(drugCode ?? '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: results = [] } = usePharmacyStock(
    debouncedSearch.length >= 2 ? { search: debouncedSearch, status: 'active' } : undefined,
  );

  const handleSelect = (stock: PharmacyStock) => {
    onSelect(stock);
    setSearch('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search batch / drug name…"
          className="pl-8 h-8 text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onMouseDown={() => { setSearch(''); setOpen(false); }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && search.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {debouncedSearch.length < 2 ? (
            <div className="p-2 text-xs text-muted-foreground text-center">Type at least 2 characters…</div>
          ) : results.length === 0 ? (
            <div className="p-2 text-xs text-muted-foreground text-center">No stock found</div>
          ) : (
            <ul>
              {results.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                    onMouseDown={() => handleSelect(s)}
                  >
                    <div className="font-medium text-xs">
                      {s.billingItemDescription ?? s.drugName}
                      {s.strength ? ` (${s.strength})` : ''}
                      <Badge variant="outline" className="ml-2 text-xs">{s.dosageForm}</Badge>
                    </div>
                    {s.billingItemDescription && (
                      <div className="text-xs text-muted-foreground">{s.drugName}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Batch: {s.batchNumber} · Exp: {format(new Date(s.expiryDate), 'MMM yyyy')} · On hand: {Number(s.quantityOnHand)} {s.unit}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Single search input that adds freeform items ─────────────────────── */
function MedicationSearchInput({ onSelect }: { onSelect: (stock: PharmacyStock) => void }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: results = [] } = usePharmacyStock(
    debouncedSearch.length >= 2 ? { search: debouncedSearch, status: 'active' } : undefined,
  );

  const handleSelect = (stock: PharmacyStock) => {
    onSelect(stock);
    setSearch('');
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Add medication by name or code…"
          className="pl-9 pr-8"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onMouseDown={() => { setSearch(''); setOpen(false); }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && search.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {debouncedSearch.length < 2 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">Type at least 2 characters…</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">No stock found for &quot;{debouncedSearch}&quot;</div>
          ) : (
            <ul>
              {results.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors"
                    onMouseDown={() => handleSelect(s)}
                  >
                    <div className="font-medium text-sm">
                      {s.billingItemDescription ?? s.drugName}
                      {s.strength ? ` (${s.strength})` : ''}
                      <Badge variant="outline" className="ml-2 text-xs">{s.dosageForm}</Badge>
                    </div>
                    {s.billingItemDescription && (
                      <div className="text-xs text-muted-foreground">{s.drugName}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Batch: {s.batchNumber} · Exp: {format(new Date(s.expiryDate), 'MMM yyyy')} · On hand: {Number(s.quantityOnHand)} {s.unit}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Row for each medication (side-by-side prescribed ↔ stock) ───────── */
function DispensedItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: DispenseItem;
  onChange: (patch: Partial<DispenseItem>) => void;
  onRemove: () => void;
}) {
  const stock = item.stock;
  const availableQty = stock ? Number(stock.quantityOnHand) : null;
  const isPrescribed = Boolean(item.prescriptionOrderId);
  const displayName =
    stock?.billingItemDescription ?? stock?.drugName ?? item.prescribedDrugName ?? '—';

  return (
    <div className="grid grid-cols-[1fr_1fr_36px] gap-4 items-start py-4 px-6">
      {/* ── Left: Prescribed Medication ───────────────────────── */}
      <div className="flex items-start gap-2.5 min-w-0">
        <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{displayName}</span>
            {stock?.strength && (
              <span className="text-xs text-muted-foreground">{stock.strength}</span>
            )}
            {stock && (
              <Badge variant="outline" className="text-xs">{stock.dosageForm}</Badge>
            )}
            {isPrescribed && (
              <Badge variant="secondary" className="text-xs uppercase tracking-wide">Prescribed</Badge>
            )}
          </div>
          {stock?.billingItemDescription && (
            <div className="text-xs text-muted-foreground mt-0.5">Catalog: {stock.drugName}</div>
          )}
          {(item.prescribedDosage || item.prescribedFrequency) && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {[item.prescribedDosage, item.prescribedFrequency]
                .filter(Boolean)
                .join(' · ')}
              {item.prescribedQuantity && (
                <span className="ml-1">· Qty: {item.prescribedQuantity}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Stock Batch Selection ──────────────────────── */}
      <div className="space-y-2">
        {!stock ? (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Select Stock Batch
            </p>
            <StockSelector
              drugCode={item.prescribedDrugCode}
              onSelect={(s) =>
                onChange({
                  stock: s,
                  quantityDispensed: item.prescribedQuantity
                    ? Math.min(parseInt(item.prescribedQuantity) || 1, Number(s.quantityOnHand))
                    : 1,
                })
              }
            />
          </>
        ) : (
          <>
            {/* Batch identity */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{stock.batchNumber}</span>
              <span>·</span>
              <span>Exp: {format(new Date(stock.expiryDate), 'MMM yyyy')}</span>
              <span>·</span>
              <span>On hand: {Number(stock.quantityOnHand)} {stock.unit}</span>
              <button
                type="button"
                className="text-primary underline hover:no-underline"
                onClick={() => onChange({ stock: null })}
              >
                change
              </button>
            </div>

            {/* Qty + Instructions */}
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Qty (max {availableQty})
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={availableQty ?? undefined}
                  value={item.quantityDispensed}
                  className="h-8 text-sm"
                  onChange={(e) =>
                    onChange({ quantityDispensed: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Instructions</Label>
                <Input
                  placeholder="Take 1 tablet twice daily after food"
                  value={item.dispensingInstructions}
                  className="h-8 text-sm"
                  onChange={(e) => onChange({ dispensingInstructions: e.target.value })}
                />
              </div>
            </div>

            {/* Substitution */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`sub-${item.rowId}`}
                  checked={item.isSubstituted}
                  onChange={(e) =>
                    onChange({ isSubstituted: (e.target as HTMLInputElement).checked })
                  }
                />
                <Label
                  htmlFor={`sub-${item.rowId}`}
                  className="text-xs cursor-pointer text-muted-foreground"
                >
                  Generic substitution
                </Label>
              </div>
              {item.isSubstituted && (
                <Input
                  placeholder="Reason for substitution…"
                  value={item.substitutionReason}
                  className="text-sm h-8"
                  onChange={(e) => onChange({ substitutionReason: e.target.value })}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors mt-1"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Helper — build pre-populated rows from prescription ──────────────── */
function buildItemsFromPrescription(drugs: PrescriptionDrugItemResponse[]): DispenseItem[] {
  return drugs.map((drug) => ({
    rowId: `rx-${drug.id}`,
    prescriptionOrderId: drug.id,
    stock: null,
    quantityDispensed: 1,
    dispensingInstructions: drug.instructions ?? '',
    isSubstituted: false,
    substitutionReason: '',
    prescribedDrugName: drug.drugName,
    prescribedDrugCode: drug.drugCode,
    prescribedDosage: drug.dosage,
    prescribedFrequency: drug.frequency,
    prescribedQuantity: drug.quantity,
  }));
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function ExecuteDispensePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: dispensing, isLoading } = usePharmacyDispensing(id);
  const { data: prescriptionHeader, isLoading: rxLoading } = usePrescriptionHeader(
    dispensing?.prescriptionId,
  );

  const verifyDispensing = useVerifyDispensing();
  const executeDispense = useExecuteDispense();

  const [items, setItems] = useState<DispenseItem[]>([]);
  const [initialised, setInitialised] = useState(false);
  const [counsellingProvided, setCounsellingProvided] = useState(false);
  const [counsellingNotes, setCounsellingNotes] = useState('');

  // Pre-populate from prescription header once loaded
  useEffect(() => {
    if (!initialised && prescriptionHeader?.items?.length) {
      setItems(buildItemsFromPrescription(prescriptionHeader.items));
      setInitialised(true);
    }
    // If no prescription, just leave empty (OTC / paper flow)
    if (!initialised && dispensing && !dispensing.prescriptionId) {
      setInitialised(true);
    }
  }, [initialised, prescriptionHeader, dispensing]);

  const addFreeformItem = (stock: PharmacyStock) =>
    setItems((prev) => [
      ...prev,
      {
        rowId: Math.random().toString(36).slice(2),
        stock,
        quantityDispensed: 1,
        dispensingInstructions: '',
        isSubstituted: false,
        substitutionReason: '',
      },
    ]);

  const updateItem = (index: number, patch: Partial<DispenseItem>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  // Only items with a stock batch selected can be submitted
  const readyItems = items.filter((i) => i.stock !== null);

  const handleSubmit = async () => {
    if (
      dispensing?.status === DispensingStatus.QUEUED &&
      dispensing?.dispensingSource !== DispensingSource.DIGITAL_PRESCRIPTION
    ) {
      await verifyDispensing.mutateAsync({ id, payload: {} });
    }
    await executeDispense.mutateAsync({
      id,
      payload: {
        items: readyItems.map((i) => ({
          stockId: i.stock!.id,
          ...(i.prescriptionOrderId ? { prescriptionOrderId: i.prescriptionOrderId } : {}),
          quantityDispensed: i.quantityDispensed,
          ...(i.dispensingInstructions ? { dispensingInstructions: i.dispensingInstructions } : {}),
          ...(i.isSubstituted ? { isSubstituted: true } : {}),
          ...(i.substitutionReason ? { substitutionReason: i.substitutionReason } : {}),
        })),
        counsellingProvided,
        ...(counsellingNotes ? { counsellingNotes } : {}),
      },
    });
    router.push(`/${locale}/pharmacy/dispensings/${id}`);
  };

  if (isLoading || (dispensing?.prescriptionId && rxLoading && !initialised)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!dispensing) {
    return <div className="text-muted-foreground">Dispensing record not found</div>;
  }

  const isOtcOrPaper = dispensing.dispensingSource !== DispensingSource.DIGITAL_PRESCRIPTION;
  const allowedToDispense =
    dispensing.status === DispensingStatus.VERIFIED ||
    (dispensing.status === DispensingStatus.QUEUED && isOtcOrPaper);

  if (!allowedToDispense) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              This dispensing is currently{' '}
              <Badge variant="outline">{dispensing.status}</Badge>. Please verify the
              prescription before dispensing.
            </p>
            <Button variant="outline" onClick={() => router.push(`/${locale}/pharmacy/dispensings/${id}`)}>
              Go to Detail Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasPrescription = Boolean(dispensing.prescriptionId);

  return (
    <div className="space-y-6">
      {/* Patient header — same component as the detail page */}
      <DispensingPatientHeader dispensing={dispensing} />

      {/* Medication Dispensing Plan — z-10 ensures its dropdown sits above the Counselling card below */}
      <Card className="overflow-visible relative z-10">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Medication Dispensing Plan</span>
          </div>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {readyItems.length} of {items.length} batch{items.length !== 1 ? 'es' : ''} selected
            </span>
          )}
        </div>

        {/* Column headers */}
        {items.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_36px] gap-4 px-6 py-2.5 bg-muted/40 border-b text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Prescribed Medication</span>
            <span>Stock Batch Selection</span>
            <span>Actions</span>
          </div>
        )}

        {/* Rows */}
        {items.length > 0 ? (
          <div className="divide-y">
            {items.map((item, index) => (
              <DispensedItemRow
                key={item.rowId}
                item={item}
                onChange={(patch) => updateItem(index, patch)}
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">
            Use the search below to add medications
          </p>
        )}

        {/* Add extra / substitution drug */}
        <div className="px-6 py-4 border-t">
          <MedicationSearchInput onSelect={addFreeformItem} />
          <p className="text-xs text-muted-foreground mt-1.5">
            + {hasPrescription ? 'Add extra or substitution drug' : 'Add medication'}
          </p>
        </div>
      </Card>

      {/* Counselling */}
      <Card className="relative z-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Patient Counselling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="counselling"
              checked={counsellingProvided}
              onChange={(e) => setCounsellingProvided((e.target as HTMLInputElement).checked)}
            />
            <Label htmlFor="counselling" className="cursor-pointer">
              Counselling provided to patient
            </Label>
          </div>
          {counsellingProvided && (
            <div className="space-y-1.5">
              <Label className="text-xs">Counselling Notes</Label>
              <Textarea
                placeholder="Notes on medication use, side effects, storage instructions…"
                value={counsellingNotes}
                onChange={(e) => setCounsellingNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={readyItems.length === 0 || verifyDispensing.isPending || executeDispense.isPending}
          className="min-w-44"
        >
          <PackageCheck className="h-4 w-4 mr-2" />
          {verifyDispensing.isPending
            ? 'Verifying…'
            : executeDispense.isPending
            ? 'Dispensing…'
            : `Dispense ${readyItems.length} Item${readyItems.length !== 1 ? 's' : ''}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        {readyItems.length === 0 && items.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Select a stock batch for each drug to proceed
          </p>
        )}
        {readyItems.length === 0 && items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add at least one medication to dispense
          </p>
        )}
      </div>
    </div>
  );
}
