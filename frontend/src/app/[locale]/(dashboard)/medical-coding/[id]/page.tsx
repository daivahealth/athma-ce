'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  useCodingSession,
  useStartCodingReview,
  useUpdateCodingSession,
  useSubmitCodingSession,
  useAddDiagnosis,
  useUpdateDiagnosis,
  useDeleteDiagnosis,
  useAddProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
  useCodingAudit,
} from '@/modules/rcm/hooks/use-medical-coding';
import type { CreateDiagnosisInput, CreateProcedureInput } from '@/modules/rcm/types/medical-coding';
import { CodingSessionStatus } from '@/modules/rcm/types/medical-coding';

const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function CodingSessionDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const sessionId = params.id as string;
  const toast = useToast();

  const { data: session, isLoading, error } = useCodingSession(sessionId);
  const startReview = useStartCodingReview();
  const updateSession = useUpdateCodingSession();
  const submitSession = useSubmitCodingSession();
  const addDiagnosis = useAddDiagnosis(sessionId);
  const updateDiagnosis = useUpdateDiagnosis(sessionId);
  const deleteDiagnosis = useDeleteDiagnosis(sessionId);
  const addProcedure = useAddProcedure(sessionId);
  const updateProcedure = useUpdateProcedure(sessionId);
  const deleteProcedure = useDeleteProcedure(sessionId);
  const { data: auditLogs } = useCodingAudit(sessionId);

  const [diagnosisForm, setDiagnosisForm] = useState({ code: '', codeSystem: 'ICD-10', description: '', isPrimary: false });
  const [procedureForm, setProcedureForm] = useState({ code: '', codeSystem: 'CPT', description: '', modifier: '', units: '1' });
  const [sessionNotes, setSessionNotes] = useState('');

  const handleStartReview = async () => {
    if (!session) return;
    await startReview.mutateAsync(session.id);
    toast({ title: 'Review started' });
  };

  const handleUpdateSession = async () => {
    await updateSession.mutateAsync({ id: sessionId, payload: { notes: sessionNotes || undefined } });
    toast({ title: 'Session updated' });
    setSessionNotes('');
  };

  const handleSubmitSession = async () => {
    await submitSession.mutateAsync(sessionId);
    toast({ title: 'Session submitted for claim generation' });
  };

  const handleAddDiagnosis = async () => {
    if (!diagnosisForm.code.trim()) return;
    const payload: CreateDiagnosisInput = {
      code: diagnosisForm.code.trim(),
      codeSystem: diagnosisForm.codeSystem,
      description: diagnosisForm.description || undefined,
      isPrimary: diagnosisForm.isPrimary,
    };
    await addDiagnosis.mutateAsync(payload);
    toast({ title: 'Diagnosis added' });
    setDiagnosisForm({ code: '', codeSystem: diagnosisForm.codeSystem, description: '', isPrimary: false });
  };

  const handleAddProcedure = async () => {
    if (!procedureForm.code.trim()) return;
    const payload: CreateProcedureInput = {
      code: procedureForm.code.trim(),
      codeSystem: procedureForm.codeSystem,
      description: procedureForm.description || undefined,
      modifier: procedureForm.modifier || undefined,
      units: Number(procedureForm.units) || 1,
    };
    await addProcedure.mutateAsync(payload);
    toast({ title: 'Procedure added' });
    setProcedureForm({ code: '', codeSystem: procedureForm.codeSystem, description: '', modifier: '', units: '1' });
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !session) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load session: ${(error as Error).message}` : 'Session not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/medical-coding`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to sessions
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Session {session.id.slice(0, 8)}…</h1>
        <Badge className="ml-auto" variant={session.status === CodingSessionStatus.IN_REVIEW ? 'default' : 'secondary'}>
          {toLabel(session.status)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Patient</p>
            <p className="font-mono text-xs" title={session.patientId}>
              {session.patientId}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Encounter</p>
            <p className="font-mono text-xs" title={session.encounterId}>
              {session.encounterId}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coder</p>
            <p>{session.coderId || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{format(new Date(session.updatedAt), 'PPP p')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {session.status === CodingSessionStatus.PENDING && (
          <Button onClick={handleStartReview} disabled={startReview.isPending}>
            {startReview.isPending ? 'Starting…' : 'Start review'}
          </Button>
        )}
        <Button variant="outline" onClick={handleUpdateSession} disabled={updateSession.isPending}>
          Save notes
        </Button>
        <Button variant="default" onClick={handleSubmitSession} disabled={submitSession.isPending}>
          {submitSession.isPending ? 'Submitting…' : 'Submit session'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coder notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            rows={3}
            value={sessionNotes}
            onChange={(event) => setSessionNotes(event.target.value)}
            placeholder={session.notes || 'Add notes for billing/coding...'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnoses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.diagnoses && session.diagnoses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.diagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>
                      <div className="font-medium">{diagnosis.code}</div>
                      <p className="text-xs text-muted-foreground">{diagnosis.codeSystem}</p>
                    </TableCell>
                    <TableCell>{diagnosis.description || '—'}</TableCell>
                    <TableCell>{diagnosis.isPrimary ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateDiagnosis.mutateAsync({
                            id: diagnosis.id,
                            payload: { isPrimary: !diagnosis.isPrimary },
                          })
                        }
                      >
                        Toggle primary
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteDiagnosis.mutateAsync(diagnosis.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No diagnoses captured yet.</p>
          )}

          <div className="rounded-md border p-4 space-y-3">
            <h3 className="font-medium">Add diagnosis</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={diagnosisForm.code} onChange={(event) => setDiagnosisForm((prev) => ({ ...prev, code: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>System</Label>
                <Input value={diagnosisForm.codeSystem} onChange={(event) => setDiagnosisForm((prev) => ({ ...prev, codeSystem: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={diagnosisForm.description} onChange={(event) => setDiagnosisForm((prev) => ({ ...prev, description: event.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={diagnosisForm.isPrimary} onCheckedChange={(value) => setDiagnosisForm((prev) => ({ ...prev, isPrimary: value }))} />
              <span className="text-sm">Primary diagnosis</span>
            </div>
            <Button onClick={handleAddDiagnosis} disabled={addDiagnosis.isPending}>
              {addDiagnosis.isPending ? 'Adding…' : 'Add diagnosis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Procedures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.procedures && session.procedures.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Modifier</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.procedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell>
                      <div className="font-medium">{procedure.code}</div>
                      <p className="text-xs text-muted-foreground">{procedure.codeSystem}</p>
                    </TableCell>
                    <TableCell>{procedure.description || '—'}</TableCell>
                    <TableCell>{procedure.modifier || '—'}</TableCell>
                    <TableCell>{procedure.units ?? '1'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateProcedure.mutateAsync({
                            id: procedure.id,
                            payload: { units: (procedure.units ?? 1) + 1 },
                          })
                        }
                      >
                        +1 unit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteProcedure.mutateAsync(procedure.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No procedures captured yet.</p>
          )}

          <div className="rounded-md border p-4 space-y-3">
            <h3 className="font-medium">Add procedure</h3>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={procedureForm.code} onChange={(event) => setProcedureForm((prev) => ({ ...prev, code: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>System</Label>
                <Input value={procedureForm.codeSystem} onChange={(event) => setProcedureForm((prev) => ({ ...prev, codeSystem: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={procedureForm.description} onChange={(event) => setProcedureForm((prev) => ({ ...prev, description: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Modifier</Label>
                <Input value={procedureForm.modifier} onChange={(event) => setProcedureForm((prev) => ({ ...prev, modifier: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Units</Label>
                <Input
                  type="number"
                  min="1"
                  value={procedureForm.units}
                  onChange={(event) => setProcedureForm((prev) => ({ ...prev, units: event.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleAddProcedure} disabled={addProcedure.isPending}>
              {addProcedure.isPending ? 'Adding…' : 'Add procedure'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {auditLogs && auditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{entry.actorName || entry.actorId || '—'}</TableCell>
                    <TableCell>{entry.notes || '—'}</TableCell>
                    <TableCell>{format(new Date(entry.createdAt), 'PPP p')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No audit activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
