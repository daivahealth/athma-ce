'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Ban, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useDebitNote,
  usePostDebitNote,
  useVoidDebitNote,
  useDeleteDebitNote,
} from '@/modules/rcm/hooks/use-debit-notes';
import type { DebitNoteStatus } from '@/modules/rcm/types/debit-note';

const statusLabels: Record<DebitNoteStatus, string> = {
  draft: 'Draft',
  posted: 'Posted',
  voided: 'Voided',
};

const statusColors: Record<DebitNoteStatus, string> = {
  draft: 'bg-yellow-500/10 text-yellow-600',
  posted: 'bg-green-500/10 text-green-600',
  voided: 'bg-red-500/10 text-red-600',
};

export default function DebitNoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: debitNote, isLoading, error } = useDebitNote(id);
  const postMutation = usePostDebitNote();
  const voidMutation = useVoidDebitNote();
  const deleteMutation = useDeleteDebitNote();
  const [voidReason, setVoidReason] = useState('');

  const handlePost = async () => {
    await postMutation.mutateAsync(id);
    toast({ title: 'Debit note posted successfully' });
  };

  const handleVoid = async () => {
    if (!voidReason.trim()) {
      toast({ variant: 'destructive', title: 'Void reason is required' });
      return;
    }
    await voidMutation.mutateAsync({ id, payload: { reason: voidReason.trim() } });
    toast({ title: 'Debit note voided' });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this debit note?')) return;
    await deleteMutation.mutateAsync(id);
    toast({ title: 'Debit note deleted' });
    router.push(`/${locale}/revenue-cycle/debit-notes`);
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !debitNote) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load debit note: ${(error as Error).message}` : 'Debit note not found.'}
      </div>
    );
  }

  const patientName = debitNote.patientDisplayName || debitNote.patientDisplay?.displayName;
  const patientMrn = debitNote.mrn || debitNote.patientDisplay?.mrn;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/debit-notes`} aria-label="Back to debit notes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Debit Note</p>
          <h1 className="text-2xl font-bold">{debitNote.debitNoteNumber}</h1>
        </div>
        <Badge className={statusColors[debitNote.status]}>{statusLabels[debitNote.status]}</Badge>
      </div>

      {/* Draft Actions Card */}
      {debitNote.status === 'draft' && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">This debit note is in draft status</p>
                <p className="text-sm text-muted-foreground">Post it to apply the charge to the patient's account</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${locale}/revenue-cycle/debit-notes/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button onClick={handlePost} disabled={postMutation.isPending}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Post Debit Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Debit Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-red-600">
                {Number(debitNote.amount || 0).toFixed(2)} {debitNote.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              {patientName ? (
                <div>
                  <p className="font-medium">{patientName}</p>
                  {patientMrn && <p className="text-sm text-muted-foreground">MRN: {patientMrn}</p>}
                </div>
              ) : (
                <p className="font-mono text-sm">{debitNote.patientId.slice(0, 8)}...</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(debitNote.debitNoteDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invoice</p>
              {debitNote.invoiceId ? (
                <Link
                  href={`/${locale}/invoices/${debitNote.invoiceId}`}
                  className="text-primary hover:underline"
                >
                  View Invoice
                </Link>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium">{debitNote.reason || '—'}</p>
            </div>
            {debitNote.notes && (
              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p>{debitNote.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      {debitNote.lines && debitNote.lines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debitNote.lines.map((line, index) => (
                  <TableRow key={line.id || index}>
                    <TableCell className="text-muted-foreground">{line.lineNumber}</TableCell>
                    <TableCell>{line.description || '—'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(line.lineAmount || 0).toFixed(2)} {debitNote.currency}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={2} className="text-right">
                    Total
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(debitNote.amount || 0).toFixed(2)} {debitNote.currency}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Void Section (only for posted) */}
      {debitNote.status === 'posted' && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-600">Void Debit Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Voiding this debit note will reverse the charge from the patient's ledger.
            </p>
            <div className="space-y-2">
              <Label>Reason for voiding *</Label>
              <Input
                value={voidReason}
                onChange={(event) => setVoidReason(event.target.value)}
                placeholder="Enter reason for voiding"
              />
            </div>
            <Button variant="destructive" onClick={handleVoid} disabled={voidMutation.isPending}>
              <Ban className="mr-2 h-4 w-4" /> Void Debit Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Voided Info */}
      {debitNote.status === 'voided' && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="py-4">
            <p className="font-medium text-red-600">This debit note has been voided</p>
            {(debitNote as any).voidReason && (
              <p className="text-sm text-muted-foreground">Reason: {(debitNote as any).voidReason}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
