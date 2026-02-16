'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { InvoiceSelectDialog } from '@/components/invoice-select-dialog';
import { useCreateCreditNote } from '@/modules/rcm/hooks/use-credit-notes';
import type { CreditNoteLine, CreateCreditNoteInput } from '@/modules/rcm/types/credit-note';
import type { Invoice } from '@/modules/rcm/types/invoice';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

const createLine = (lineNumber: number): CreditNoteLine => ({
  lineNumber,
  description: '',
  lineAmount: 0,
});

export default function NewCreditNotePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createCreditNote = useCreateCreditNote();
  const { data: currencyConfig } = useResolveConfig('finance.currency');

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientId, setPatientId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [creditNoteDate, setCreditNoteDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<CreditNoteLine[]>([createLine(1)]);

  const currency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value
      : 'AED';

  const totalAmount = useMemo(
    () => lines.reduce((sum, line) => sum + (Number(line.lineAmount) || 0), 0),
    [lines],
  );

  const handleLineChange = (index: number, field: keyof CreditNoteLine, value: string) => {
    setLines((prev) =>
      prev.map((line, idx) => {
        if (idx !== index) return line;
        const updated: CreditNoteLine = { ...line };
        if (field === 'lineAmount') {
          updated.lineAmount = value === '' ? 0 : Number(value);
        } else {
          (updated as any)[field] = value;
        }
        return updated;
      }),
    );
  };

  const handleAddLine = () => {
    setLines((prev) => [...prev, createLine(prev.length + 1)]);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientId.trim()) return;

    const payload: CreateCreditNoteInput = {
      patientId: patientId.trim(),
      invoiceId: selectedInvoice?.id,
      creditNoteDate: creditNoteDate ? new Date(creditNoteDate).toISOString() : undefined,
      amount: totalAmount,
      currency,
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
      lines: lines.map((line, idx) => ({
        ...line,
        lineNumber: idx + 1,
        description: line.description?.trim() || undefined,
      })),
    };

    const created = await createCreditNote.mutateAsync(payload);
    toast({ title: 'Credit note created' });
    router.push(`/${locale}/revenue-cycle/credit-notes/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/credit-notes`} aria-label="Back to credit notes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            New credit note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <PatientSearchSelect
                  required
                  selectedPatient={selectedPatient}
                  onSelect={(patient) => {
                    setSelectedPatient(patient);
                    setPatientId(patient.id);
                    setSelectedInvoice(null);
                  }}
                  onClear={() => {
                    setSelectedPatient(null);
                    setPatientId('');
                    setSelectedInvoice(null);
                  }}
                />
              </div>
              <div className="space-y-2">
                <InvoiceSelectDialog
                  label="Invoice (optional)"
                  patientId={patientId || undefined}
                  selectedInvoice={selectedInvoice}
                  onSelect={setSelectedInvoice}
                  onClear={() => setSelectedInvoice(null)}
                  disabled={!patientId}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={creditNoteDate}
                  onChange={(event) => setCreditNoteDate(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Reason</Label>
                <Input value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Input value={notes} onChange={(event) => setNotes(event.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Line items</h3>
                  <p className="text-sm text-muted-foreground">Total: {totalAmount.toFixed(2)} {currency}</p>
                </div>
                <Button type="button" variant="outline" onClick={handleAddLine}>
                  <Plus className="mr-2 h-4 w-4" /> Add line
                </Button>
              </div>
              {lines.map((line, index) => (
                <div key={index} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Line {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLine(index)}
                      disabled={lines.length === 1}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={line.description ?? ''}
                        onChange={(event) => handleLineChange(index, 'description', event.target.value)}
                        placeholder="What is being credited"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount ({currency})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.lineAmount ?? 0}
                        onChange={(event) => handleLineChange(index, 'lineAmount', event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={createCreditNote.isPending}>
                Create credit note
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
