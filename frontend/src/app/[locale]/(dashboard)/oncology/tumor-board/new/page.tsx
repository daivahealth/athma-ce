'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCancerDiagnoses, useCreateTumorBoardCase } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis } from '@/plugins/oncology/types';

const SPECIALTIES = [
  'Medical Oncology', 'Surgical Oncology', 'Radiation Oncology',
  'Pathology', 'Radiology', 'Palliative Care', 'Gynecologic Oncology',
  'Hematology', 'Neurosurgery', 'Plastic Surgery', 'Other',
];

const ROLES = [
  'Presenter', 'Chairperson', 'Surgeon', 'Medical Oncologist',
  'Radiation Oncologist', 'Pathologist', 'Radiologist',
  'Palliative Care Physician', 'Nurse Navigator', 'Other',
];

interface AttendeeRow { role: string; specialty: string }

export default function NewTumorBoardPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/tumor-board`);

  // Step 1 — Patient
  const [selectedPatient, setSelectedPatient] = useState<{ id: string } | null>(null);

  // Step 2 — Diagnosis (auto-listed once patient is selected)
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');

  const [meetingDate, setMeetingDate] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [treatmentIntent, setTreatmentIntent] = useState('');
  const [reviewOutcome, setReviewOutcome] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [imagingFindings, setImagingFindings] = useState('');
  const [pathologyReport, setPathologyReport] = useState('');
  const [molecularProfile, setMolecularProfile] = useState('');
  const [mdtRecommendation, setMdtRecommendation] = useState('');
  const [attendees, setAttendees] = useState<AttendeeRow[]>([{ role: '', specialty: '' }]);

  // Active diagnoses for the selected patient
  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient
      ? { patientId: selectedPatient.id, clinicalStatus: 'active' }
      : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];

  const createCase = useCreateTumorBoardCase();
  const isValid = cancerDiagnosisId && meetingDate;

  const handleSelectPatient = (p: { id: string }) => {
    setSelectedPatient(p);
    setCancerDiagnosisId('');
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setCancerDiagnosisId('');
  };

  const addAttendee = () => setAttendees((p) => [...p, { role: '', specialty: '' }]);
  const removeAttendee = (i: number) => setAttendees((p) => p.filter((_, idx) => idx !== i));
  const updateAttendee = (i: number, field: keyof AttendeeRow, v: string) =>
    setAttendees((p) => p.map((a, idx) => idx === i ? { ...a, [field]: v } : a));

  const handleSubmit = async () => {
    if (!isValid) return;
    const filledAttendees = attendees.filter((a) => a.role || a.specialty);
    await createCase.mutateAsync({
      cancerDiagnosisId,
      meetingDate,
      status,
      treatmentIntent: treatmentIntent || undefined,
      reviewOutcome: reviewOutcome || undefined,
      clinicalSummary: clinicalSummary || undefined,
      imagingFindings: imagingFindings || undefined,
      pathologyReport: pathologyReport || undefined,
      molecularProfile: molecularProfile || undefined,
      mdtRecommendation: mdtRecommendation || undefined,
      attendees: filledAttendees,
    } as Record<string, unknown>);
    back();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Schedule Tumor Board Case</h1>
          <p className="text-muted-foreground text-sm">Schedule a new MDT tumor board review</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Step 1 — Patient */}
        <Card>
          <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
          <CardContent>
            <PatientSearchSelect
              required
              selectedPatient={selectedPatient}
              onSelect={handleSelectPatient}
              onClear={handleClearPatient}
            />
          </CardContent>
        </Card>

        {/* Step 2 — Active Cancer Diagnoses */}
        {selectedPatient && (
          <Card>
            <CardHeader><CardTitle>Active Cancer Diagnosis</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active cancer diagnoses found for this patient.{' '}
                  <button
                    className="underline text-primary"
                    onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}
                  >
                    Add one first
                  </button>
                </p>
              ) : (
                <>
                  <Label>Select Diagnosis *</Label>
                  <div className="space-y-2">
                    {diagnoses.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setCancerDiagnosisId(d.id)}
                        className={[
                          'w-full text-left px-4 py-3 rounded-md border text-sm transition-colors',
                          cancerDiagnosisId === d.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:bg-muted/40',
                        ].join(' ')}
                      >
                        <div className="font-medium">{d.cancer_type}</div>
                        <div className="text-muted-foreground mt-0.5">
                          {d.primary_site}
                          {d.primary_site_code && (
                            <span className="ml-2 font-mono text-xs">{d.primary_site_code}</span>
                          )}
                          <span className="ml-3">
                            Diagnosed {new Date(d.diagnosis_date).toLocaleDateString()}
                          </span>
                          {d.grade && <span className="ml-3">{d.grade}</span>}
                        </div>
                        {d.histology_morphology && (
                          <div className="text-xs text-muted-foreground mt-0.5">{d.histology_morphology}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Remaining cards — only shown once a diagnosis is selected */}
        {cancerDiagnosisId && (
          <>
            {/* Meeting Details */}
            <Card>
              <CardHeader><CardTitle>Meeting Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meeting Date *</Label>
                    <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="deferred">Deferred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendees */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Attendees</CardTitle>
                  <Button type="button" variant="ghost" size="sm" onClick={addAttendee}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {attendees.map((attendee, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Select value={attendee.role || '__none'} onValueChange={(v) => updateAttendee(i, 'role', v === '__none' ? '' : v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">— Role —</SelectItem>
                          {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={attendee.specialty || '__none'} onValueChange={(v) => updateAttendee(i, 'specialty', v === '__none' ? '' : v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Specialty" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">— Specialty —</SelectItem>
                          {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {attendees.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeAttendee(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Clinical Information */}
            <Card>
              <CardHeader><CardTitle>Clinical Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clinical Summary</Label>
                  <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Current clinical status, history, performance status..." value={clinicalSummary} onChange={(e) => setClinicalSummary(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Imaging Findings</Label>
                  <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="CT, MRI, PET-CT findings..." value={imagingFindings} onChange={(e) => setImagingFindings(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Pathology Report</Label>
                  <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Biopsy results, receptor status..." value={pathologyReport} onChange={(e) => setPathologyReport(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Molecular / Genomic Profile</Label>
                  <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="NGS findings, biomarkers, mutation status..." value={molecularProfile} onChange={(e) => setMolecularProfile(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* MDT Decision */}
            <Card>
              <CardHeader><CardTitle>MDT Decision</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Treatment Intent</Label>
                    <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Not decided —</SelectItem>
                        <SelectItem value="curative">Curative</SelectItem>
                        <SelectItem value="adjuvant">Adjuvant</SelectItem>
                        <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
                        <SelectItem value="palliative">Palliative</SelectItem>
                        <SelectItem value="surveillance">Surveillance</SelectItem>
                        <SelectItem value="supportive">Supportive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Review Outcome</Label>
                    <Select value={reviewOutcome || '__none'} onValueChange={(v) => setReviewOutcome(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Pending —</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="deferred_for_more_info">Deferred — Needs more info</SelectItem>
                        <SelectItem value="second_opinion">Second opinion required</SelectItem>
                        <SelectItem value="clinical_trial">Clinical trial referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>MDT Recommendation</Label>
                  <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Board decision, recommended treatment pathway..." value={mdtRecommendation} onChange={(e) => setMdtRecommendation(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={back} disabled={createCase.isPending}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!isValid || createCase.isPending}>
                {createCase.isPending ? 'Saving...' : 'Schedule Case'}
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
