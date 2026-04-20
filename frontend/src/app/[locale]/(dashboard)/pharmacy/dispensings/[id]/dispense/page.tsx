'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2, Search, Pill, PackageCheck, X } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
  usePharmacyDispensing,
  useVerifyDispensing,
  useExecuteDispense,
} from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { usePharmacyStock } from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import { DispensingStatus, DispensingSource } from '@/modules/pharmacy/types/dispensing';
import type { PharmacyStock } from '@/modules/pharmacy/types/stock';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface DispenseItem {
  rowId: string;
  stock: PharmacyStock;
  quantityDispensed: number;
  dispensingInstructions: string;
  isSubstituted: boolean;
  substitutionReason: string;
}

/* ─── Single search input that adds to the list ──────────────────────── */
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
          placeholder="Search by drug name or code to add..."
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
            <div className="p-3 text-sm text-muted-foreground text-center">
              Type at least 2 characters…
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No stock found for &quot;{debouncedSearch}&quot;
            </div>
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
                      {s.drugName}
                      {s.strength ? ` (${s.strength})` : ''}
                      <Badge variant="outline" className="ml-2 text-xs">{s.dosageForm}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Batch: {s.batchNumber} · Exp: {format(new Date(s.expiryDate), 'MMM yyyy')} · In stock: {Number(s.quantityOnHand)} {s.unit}
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

/* ─── Row for each added medication ──────────────────────────────────── */
function DispensedItemRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: DispenseItem;
  index: number;
  onChange: (patch: Partial<DispenseItem>) => void;
  onRemove: () => void;
}) {
  const availableQty = Number(item.stock.quantityOnHand);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 items-start py-4">
      <div className="space-y-3">
        {/* Drug info */}
        <div className="flex items-center gap-2">
          <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm">{item.stock.drugName}</span>
          {item.stock.strength && (
            <span className="text-xs text-muted-foreground">{item.stock.strength}</span>
          )}
          <Badge variant="outline" className="text-xs">{item.stock.dosageForm}</Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            Batch: {item.stock.batchNumber} · Exp: {format(new Date(item.stock.expiryDate), 'MMM yyyy')} · On hand: {availableQty} {item.stock.unit}
          </span>
        </div>

        {/* Qty + instructions */}
        <div className="grid grid-cols-[140px_1fr] gap-3">
          <div className="space-y-1">
            <Label className="text-xs">
              Qty <span className="text-muted-foreground">(max {availableQty})</span>
            </Label>
            <Input
              type="number"
              min={1}
              max={availableQty}
              value={item.quantityDispensed}
              onChange={(e) =>
                onChange({ quantityDispensed: Math.max(1, parseInt(e.target.value) || 1) })
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Instructions</Label>
            <Input
              placeholder="e.g. Take 1 tablet twice daily after food"
              value={item.dispensingInstructions}
              onChange={(e) => onChange({ dispensingInstructions: e.target.value })}
            />
          </div>
        </div>

        {/* Substitution */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`sub-${item.rowId}`}
              checked={item.isSubstituted}
              onCheckedChange={(c) => onChange({ isSubstituted: !!c })}
            />
            <Label htmlFor={`sub-${item.rowId}`} className="text-xs cursor-pointer text-muted-foreground">
              Generic substitution
            </Label>
          </div>
          {item.isSubstituted && (
            <Input
              placeholder="Reason for substitution…"
              value={item.substitutionReason}
              onChange={(e) => onChange({ substitutionReason: e.target.value })}
              className="text-sm"
            />
          )}
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive mt-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
export default function ExecuteDispensePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: dispensing, isLoading } = usePharmacyDispensing(id);
  const verifyDispensing = useVerifyDispensing();
  const executeDispense = useExecuteDispense();

  const [items, setItems] = useState<DispenseItem[]>([]);
  const [counsellingProvided, setCounsellingProvided] = useState(false);
  const [counsellingNotes, setCounsellingNotes] = useState('');

  const addItem = (stock: PharmacyStock) =>
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
        items: items.map((i) => ({
          stockId: i.stock.id,
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

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Dispense Medication
          </h1>
          <p className="text-sm text-muted-foreground">
            {dispensing.dispensingNumber} · {dispensing.patientDisplayName ?? 'Unknown Patient'}
            {dispensing.mrn ? ` · MRN: ${dispensing.mrn}` : ''}
          </p>
        </div>
      </div>

      {/* Patient summary */}
      <Card>
        <CardContent className="pt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Patient</div>
            <div className="font-medium">{dispensing.patientDisplayName ?? '—'}</div>
            {dispensing.mrn && (
              <div className="text-xs text-muted-foreground">MRN: {dispensing.mrn}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Channel</div>
            <Badge variant="outline" className="capitalize">
              {dispensing.dispensingChannel.replace(/_/g, ' ')}
            </Badge>
          </div>
          {dispensing.prescribedByName && (
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Prescribed By</div>
              <div>{dispensing.prescribedByName}</div>
            </div>
          )}
          {dispensing.wardName && (
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Ward</div>
              <div>
                {dispensing.wardName}
                {dispensing.bedNumber ? ` — Bed ${dispensing.bedNumber}` : ''}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="overflow-visible">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Medications to Dispense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Single search input — selecting an item appends it to the list */}
          <MedicationSearchInput onSelect={addItem} />

          {/* Added items */}
          {items.length > 0 && (
            <div className="divide-y">
              {items.map((item, index) => (
                <DispensedItemRow
                  key={item.rowId}
                  item={item}
                  index={index}
                  onChange={(patch) => updateItem(index, patch)}
                  onRemove={() => removeItem(index)}
                />
              ))}
            </div>
          )}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Use the search above to add medications
            </p>
          )}
        </CardContent>
      </Card>

      {/* Counselling */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Patient Counselling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="counselling"
              checked={counsellingProvided}
              onCheckedChange={(c) => setCounsellingProvided(!!c)}
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
          disabled={items.length === 0 || verifyDispensing.isPending || executeDispense.isPending}
          className="min-w-44"
        >
          <PackageCheck className="h-4 w-4 mr-2" />
          {verifyDispensing.isPending
            ? 'Verifying…'
            : executeDispense.isPending
            ? 'Dispensing…'
            : `Dispense ${items.length} Item${items.length !== 1 ? 's' : ''}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add at least one medication to dispense
          </p>
        )}
      </div>
    </div>
  );
}
