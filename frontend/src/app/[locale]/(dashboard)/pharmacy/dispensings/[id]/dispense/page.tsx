'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Search, Pill, PackageCheck } from 'lucide-react';
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
import { DispensingStatus, DispensingSource } from '@/modules/pharmacy/types/dispensing';
import type { PharmacyStock } from '@/modules/pharmacy/types/stock';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface DispenseItem {
  rowId: string;
  stock: PharmacyStock | null;
  stockSearch: string;
  showSuggestions: boolean;
  quantityDispensed: number;
  dispensingInstructions: string;
  isSubstituted: boolean;
  substitutionReason: string;
}

function makeItem(): DispenseItem {
  return {
    rowId: Math.random().toString(36).slice(2),
    stock: null,
    stockSearch: '',
    showSuggestions: false,
    quantityDispensed: 1,
    dispensingInstructions: '',
    isSubstituted: false,
    substitutionReason: '',
  };
}

/* ─── Stock search row ───────────────────────────────────────────────── */
function StockSearchRow({
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  item: DispenseItem;
  onChange: (patch: Partial<DispenseItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const debouncedSearch = useDebouncedValue(item.stockSearch, 300);

  const { data: stockResults = [] } = usePharmacyStock(
    debouncedSearch.length >= 2 ? { search: debouncedSearch, status: 'active' } : undefined,
  );

  const availableQty = item.stock ? Number(item.stock.quantityOnHand) : 0;

  return (
    <div className="p-4 rounded-lg border space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-3">

          {/* Stock selection */}
          {item.stock ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-muted/40">
              <div>
                <div className="font-medium text-sm flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  {item.stock.drugName}
                  {item.stock.strength && (
                    <span className="text-muted-foreground text-xs">{item.stock.strength}</span>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {item.stock.dosageForm}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Batch: {item.stock.batchNumber} · Expires:{' '}
                  {format(new Date(item.stock.expiryDate), 'MMM yyyy')} · On hand:{' '}
                  {availableQty} {item.stock.unit}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => onChange({ stock: null, stockSearch: '', showSuggestions: false })}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by drug name or code..."
                  className="pl-9"
                  value={item.stockSearch}
                  onChange={(e) =>
                    onChange({ stockSearch: e.target.value, showSuggestions: true })
                  }
                  onFocus={() => onChange({ showSuggestions: true })}
                  onBlur={() =>
                    setTimeout(() => onChange({ showSuggestions: false }), 150)
                  }
                />
              </div>

              {item.showSuggestions && debouncedSearch.length >= 2 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md max-h-56 overflow-y-auto">
                  {stockResults.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No stock found for &quot;{debouncedSearch}&quot;
                    </div>
                  ) : (
                    <ul>
                      {stockResults.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                            onMouseDown={() =>
                              onChange({ stock: s, stockSearch: '', showSuggestions: false })
                            }
                          >
                            <div className="font-medium text-sm">
                              {s.drugName}
                              {s.strength ? ` (${s.strength})` : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.dosageForm} · Batch: {s.batchNumber} · Exp:{' '}
                              {format(new Date(s.expiryDate), 'MMM yyyy')} · Qty:{' '}
                              {Number(s.quantityOnHand)} {s.unit}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {item.showSuggestions &&
                item.stockSearch.length > 0 &&
                debouncedSearch.length < 2 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md">
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      Type at least 2 characters
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Quantity + instructions */}
          {item.stock && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">
                  Qty to Dispense
                  <span className="text-muted-foreground ml-1">
                    (max {availableQty} {item.stock.unit})
                  </span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={availableQty}
                  value={item.quantityDispensed}
                  onChange={(e) =>
                    onChange({
                      quantityDispensed: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Instructions</Label>
                <Input
                  placeholder="e.g. Take 1 tablet twice daily"
                  value={item.dispensingInstructions}
                  onChange={(e) => onChange({ dispensingInstructions: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Substitution */}
          {item.stock && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`sub-${item.rowId}`}
                  checked={item.isSubstituted}
                  onCheckedChange={(checked) => onChange({ isSubstituted: !!checked })}
                />
                <Label htmlFor={`sub-${item.rowId}`} className="text-xs cursor-pointer">
                  Generic substitution
                </Label>
              </div>
              {item.isSubstituted && (
                <Input
                  placeholder="Reason for substitution..."
                  value={item.substitutionReason}
                  onChange={(e) => onChange({ substitutionReason: e.target.value })}
                  className="text-sm"
                />
              )}
            </div>
          )}
        </div>

        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive mt-0.5 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
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

  const [items, setItems] = useState<DispenseItem[]>([makeItem()]);
  const [counsellingProvided, setCounsellingProvided] = useState(false);
  const [counsellingNotes, setCounsellingNotes] = useState('');

  const updateItem = (index: number, patch: Partial<DispenseItem>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const readyItems = items.filter((i) => i.stock !== null);

    // For OTC / paper dispensings that are still QUEUED, auto-verify first
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

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!dispensing) {
    return <div className="text-muted-foreground">Dispensing record not found</div>;
  }

  /* ── Status guard ──
       OTC/paper: allow QUEUED (auto-verified on submit) or VERIFIED
       Digital:   require VERIFIED (manual verify step)
  ── */
  const isOtcOrPaper = dispensing.dispensingSource !== DispensingSource.DIGITAL_PRESCRIPTION;
  const allowedToDispense =
    dispensing.status === DispensingStatus.VERIFIED ||
    (dispensing.status === DispensingStatus.QUEUED && isOtcOrPaper);

  if (!allowedToDispense) {
    return (
      <div className="max-w-md space-y-4">
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
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/pharmacy/dispensings/${id}`)}
            >
              Go to Detail Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readyCount = items.filter((i) => i.stock !== null).length;

  return (
    <div className="space-y-6 max-w-2xl">
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

      {/* Summary */}
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

      {/* Item rows */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Medications to Dispense</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setItems((prev) => [...prev, makeItem()])}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <StockSearchRow
              key={item.rowId}
              item={item}
              onChange={(patch) => updateItem(index, patch)}
              onRemove={() => removeItem(index)}
              canRemove={items.length > 1}
            />
          ))}
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
                placeholder="Notes on medication use, side effects, storage instructions..."
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
          disabled={readyCount === 0 || verifyDispensing.isPending || executeDispense.isPending}
          className="min-w-40"
        >
          <PackageCheck className="h-4 w-4 mr-2" />
          {verifyDispensing.isPending
            ? 'Verifying...'
            : executeDispense.isPending
            ? 'Dispensing...'
            : `Dispense ${readyCount} Item${readyCount !== 1 ? 's' : ''}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {readyCount === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one stock item to dispense
        </p>
      )}
    </div>
  );
}
