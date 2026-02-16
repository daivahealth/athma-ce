'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, FileText, RotateCcw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PatientSearchSelect } from '@/components/patient-search-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

import { usePatientLedger, useCreateAdjustment, useReverseEntry } from '@/modules/rcm/hooks/use-patient-ledger';
import {
  LedgerEntryType,
  LedgerEntryStatus,
  AdjustmentType,
  entryTypeLabels,
  entryStatusLabels,
  type LedgerFilters,
  type PatientLedgerEntry,
} from '@/modules/rcm/types/patient-ledger';

const statusVariant: Record<LedgerEntryStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  [LedgerEntryStatus.DRAFT]: 'outline',
  [LedgerEntryStatus.POSTED]: 'default',
  [LedgerEntryStatus.REVERSED]: 'secondary',
  [LedgerEntryStatus.VOID]: 'destructive',
};

const formatCurrency = (value: number | string | null | undefined, currency: string) =>
  `${Number(value ?? 0).toFixed(2)} ${currency}`;

export default function PatientLedgerPage() {
  const toast = useToast();
  const params = useParams();
  const locale = params.locale as string;

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [entryTypeFilter, setEntryTypeFilter] = useState<'all' | LedgerEntryType>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Adjustment dialog state
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    amount: '',
    adjustmentType: AdjustmentType.CREDIT,
    reason: '',
    notes: '',
  });

  // Reversal dialog state
  const [reversalDialogOpen, setReversalDialogOpen] = useState(false);
  const [reversalReason, setReversalReason] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<PatientLedgerEntry | null>(null);

  const filters = useMemo<LedgerFilters>(() => {
    const f: LedgerFilters = {};
    if (entryTypeFilter !== 'all') {
      f.entryType = entryTypeFilter;
    }
    if (dateFrom) {
      f.dateFrom = dateFrom;
    }
    if (dateTo) {
      f.dateTo = dateTo;
    }
    return f;
  }, [entryTypeFilter, dateFrom, dateTo]);

  const { data: ledgerData, isLoading, error } = usePatientLedger(selectedPatient?.id, filters);
  const createAdjustment = useCreateAdjustment();
  const reverseEntry = useReverseEntry();

  const entries = ledgerData?.entries ?? [];
  const summary = ledgerData?.summary;

  const handleCreateAdjustment = async () => {
    if (!selectedPatient) return;
    const amount = Number(adjustmentForm.amount);
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Enter a valid amount.' });
      return;
    }
    if (!adjustmentForm.reason.trim()) {
      toast({ variant: 'destructive', title: 'Please provide a reason.' });
      return;
    }

    try {
      await createAdjustment.mutateAsync({
        patientId: selectedPatient.id,
        payload: {
          patientId: selectedPatient.id,
          amount,
          adjustmentType: adjustmentForm.adjustmentType,
          reason: adjustmentForm.reason,
          notes: adjustmentForm.notes || undefined,
        },
      });
      toast({ title: 'Adjustment created', description: 'The adjustment has been recorded.' });
      setAdjustmentDialogOpen(false);
      setAdjustmentForm({ amount: '', adjustmentType: AdjustmentType.CREDIT, reason: '', notes: '' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to create adjustment', description: (err as Error).message });
    }
  };

  const handleReverseEntry = async () => {
    if (!selectedEntry || !selectedPatient) return;
    if (!reversalReason.trim()) {
      toast({ variant: 'destructive', title: 'Please provide a reason for reversal.' });
      return;
    }

    try {
      await reverseEntry.mutateAsync({
        patientId: selectedPatient.id,
        entryId: selectedEntry.id,
        payload: { reason: reversalReason },
      });
      toast({ title: 'Entry reversed', description: 'The ledger entry has been reversed.' });
      setReversalDialogOpen(false);
      setReversalReason('');
      setSelectedEntry(null);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to reverse entry', description: (err as Error).message });
    }
  };

  const openReversalDialog = (entry: PatientLedgerEntry) => {
    setSelectedEntry(entry);
    setReversalDialogOpen(true);
  };

  const getDocumentHref = (entry: PatientLedgerEntry) => {
    if (entry.invoiceId) {
      return `/${locale}/invoices/${entry.invoiceId}`;
    }
    if (entry.receiptId) {
      return `/${locale}/receipts/${entry.receiptId}`;
    }
    if (entry.refundId) {
      return `/${locale}/revenue-cycle/refunds/${entry.refundId}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Ledger</h1>
        <p className="text-muted-foreground">View patient financial transactions and running balance.</p>
      </div>

      {/* Patient Search */}
      <Card>
        <CardContent className="pt-6">
          <PatientSearchSelect
            label="Patient"
            selectedPatient={selectedPatient}
            onSelect={(patient) => setSelectedPatient(patient)}
            onClear={() => setSelectedPatient(null)}
            placeholder="Search by name, MRN, or mobile"
          />
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {summary ? formatCurrency(summary.totalDebits, summary.currency) : '0.00 AED'}
                </div>
                <p className="text-xs text-muted-foreground">Charges, refunds, adjustments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {summary ? formatCurrency(summary.totalCredits, summary.currency) : '0.00 AED'}
                </div>
                <p className="text-xs text-muted-foreground">Payments, credit notes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    summary && summary.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {summary ? formatCurrency(summary.balance, summary.currency) : '0.00 AED'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary && summary.balance > 0 ? 'Patient owes' : 'Patient credit'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle>Transaction History</CardTitle>
                <Button onClick={() => setAdjustmentDialogOpen(true)}>Create Adjustment</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="w-48">
                  <Label>Entry Type</Label>
                  <Select
                    value={entryTypeFilter}
                    onValueChange={(value) => setEntryTypeFilter(value as 'all' | LedgerEntryType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {Object.values(LedgerEntryType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {entryTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="w-40">
                  <Label>To Date</Label>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>

              {error ? (
                <p className="text-sm text-destructive">Failed to load ledger: {(error as Error).message}</p>
              ) : isLoading ? (
                <div className="h-32 animate-pulse rounded bg-muted" />
              ) : entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions found.</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Doc No</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(entry.postingDate), 'PP')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{entryTypeLabels[entry.entryType]}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {getDocumentHref(entry) ? (
                              <Link
                                href={getDocumentHref(entry)!}
                                className="text-primary hover:underline"
                              >
                                {entry.sourceNumber}
                              </Link>
                            ) : (
                              entry.sourceNumber
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{entry.description || '-'}</TableCell>
                          <TableCell className="text-right text-red-600">
                            {entry.debitAmount > 0 ? formatCurrency(entry.debitAmount, entry.currency) : '-'}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {entry.creditAmount > 0 ? formatCurrency(entry.creditAmount, entry.currency) : '-'}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              (entry.runningBalance ?? 0) > 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {formatCurrency(entry.runningBalance ?? 0, entry.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant[entry.status]}>
                              {entryStatusLabels[entry.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {entry.status === LedgerEntryStatus.POSTED && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openReversalDialog(entry)}
                                title="Reverse entry"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Adjustment</DialogTitle>
            <DialogDescription>
              Create a credit or debit adjustment for this patient.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select
                value={adjustmentForm.adjustmentType}
                onValueChange={(value) =>
                  setAdjustmentForm((prev) => ({ ...prev, adjustmentType: value as AdjustmentType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AdjustmentType.CREDIT}>Credit (reduce balance)</SelectItem>
                  <SelectItem value={AdjustmentType.DEBIT}>Debit (increase balance)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={adjustmentForm.amount}
                onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                value={adjustmentForm.reason}
                onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Reason for adjustment"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={adjustmentForm.notes}
                onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdjustment} disabled={createAdjustment.isPending}>
              {createAdjustment.isPending ? 'Creating...' : 'Create Adjustment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reversal Dialog */}
      <Dialog open={reversalDialogOpen} onOpenChange={setReversalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reverse Entry</DialogTitle>
            <DialogDescription>
              This will create a reversal entry to offset the original transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedEntry && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p>
                  <strong>Document:</strong> {selectedEntry.sourceNumber}
                </p>
                <p>
                  <strong>Type:</strong> {entryTypeLabels[selectedEntry.entryType]}
                </p>
                <p>
                  <strong>Amount:</strong>{' '}
                  {selectedEntry.debitAmount > 0
                    ? `${formatCurrency(selectedEntry.debitAmount, selectedEntry.currency)} (Debit)`
                    : `${formatCurrency(selectedEntry.creditAmount, selectedEntry.currency)} (Credit)`}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Reason for Reversal</Label>
              <Textarea
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                placeholder="Why is this entry being reversed?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReversalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReverseEntry}
              disabled={reverseEntry.isPending}
            >
              {reverseEntry.isPending ? 'Reversing...' : 'Reverse Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
