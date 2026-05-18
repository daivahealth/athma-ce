'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, User, Dna, Search } from 'lucide-react';
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

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
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

  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  // Auto-select when patient has exactly one active diagnosis — no manual pick needed
  useEffect(() => {
    if (!diagnosesLoading && diagnoses.length === 1 && !cancerDiagnosisId) {
      setCancerDiagnosisId(diagnoses[0].id);
    }
  }, [diagnosesLoading, diagnoses.length, cancerDiagnosisId]);

  const createCase = useCreateTumorBoardCase();
  const isValid = cancerDiagnosisId && meetingDate;

  const handleSelectPatient = (p: any) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
  const handleClearPatient = () => { setSelectedPatient(null); setCancerDiagnosisId(''); };

  const addAttendee = () => setAttendees((p) => [...p, { role: '', specialty: '' }]);
  const removeAttendee = (i: number) => setAttendees((p) => p.filter((_, idx) => idx !== i));
  const updateAttendee = (i: number, field: keyof AttendeeRow, v: string) =>
    setAttendees((p) => p.map((a, idx) => idx === i ? { ...a, [field]: v } : a));

  const handleSubmit = async () => {
    if (!isValid) return;
    await createCase.mutateAsync({
      cancerDiagnosisId, meetingDate, status,
      treatmentIntent: treatmentIntent || undefined,
      reviewOutcome: reviewOutcome || undefined,
      clinicalSummary: clinicalSummary || undefined,
      imagingFindings: imagingFindings || undefined,
      pathologyReport: pathologyReport || undefined,
      molecularProfile: molecularProfile || undefined,
      mdtRecommendation: mdtRecommendation || undefined,
      attendees: attendees.filter((a) => a.role || a.specialty),
    } as Record<string, unknown>);
    back();
  };

  const age = selectedPatient?.dateOfBirth
    ? Math.floor((Date.now() - new Date(selectedPatient.dateOfBirth).getTime()) / 31557600000)
    : null;

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

        {/* Step 1 — Patient (search card or blue banner) */}
        {!selectedPatient ? (
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Select Patient</span>
              </div>
              <PatientSearchSelect
                required
                selectedPatient={selectedPatient}
                onSelect={handleSelectPatient}
                onClear={handleClearPatient}
              />
            </div>
          </div>
        ) : (
          /* Blue patient banner (selected state) */
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
                </div>
                <Button
                  type="button" variant="outline" size="sm"
                  className="h-7 text-xs bg-white/70 dark:bg-white/10 border-blue-200 dark:border-blue-800"
                  onClick={handleClearPatient}
                >
                  Change
                </Button>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">
                {selectedPatient.fullName ||
                  `${selectedPatient.firstName ?? ''} ${selectedPatient.lastName ?? ''}`.trim() || '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.mrn && (
                  <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                    {selectedPatient.mrn}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {age} yrs
                  </span>
                )}
                {selectedPatient.gender && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {selectedPatient.gender}
                  </span>
                )}
                {selectedPatient.phoneNumber && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {selectedPatient.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Cancer Diagnosis selection (only shown when patient has multiple active diagnoses) */}
        {selectedPatient && !cancerDiagnosisId && (
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                  <Dna className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Select Cancer Diagnosis</span>
              </div>
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active cancer diagnoses found.{' '}
                  <button className="underline text-primary" onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}>
                    Add one first
                  </button>
                </p>
              ) : (
                <div className="space-y-2">
                  {diagnoses.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setCancerDiagnosisId(d.id)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-rose-200/60 bg-white/60 dark:bg-white/5 dark:border-rose-900/30 hover:bg-white/90 dark:hover:bg-white/10 text-sm transition-colors"
                    >
                      <div className="font-semibold text-foreground">{d.cancer_type}</div>
                      <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-muted-foreground">
                        <span>{d.primary_site}{d.primary_site_code && <span className="font-mono ml-1">({d.primary_site_code})</span>}</span>
                        <span>Dx {new Date(d.diagnosis_date).toLocaleDateString()}</span>
                        {d.grade && <span>{d.grade}</span>}
                      </div>
                      {d.histology_morphology && (
                        <div className="text-xs text-muted-foreground mt-0.5">{d.histology_morphology}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rose/purple diagnosis banner (after selection) */}
        {selectedDiagnosis && (
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                    <Dna className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
                </div>
                {diagnoses.length > 1 && (
                  <Button
                    type="button" variant="outline" size="sm"
                    className="h-7 text-xs bg-white/70 dark:bg-white/10 border-rose-200 dark:border-rose-800"
                    onClick={() => setCancerDiagnosisId('')}
                  >
                    Change
                  </Button>
                )}
              </div>
              <p className="text-base font-bold text-foreground leading-tight">{selectedDiagnosis.cancer_type}</p>
              <div className="flex flex-wrap gap-2">
                {selectedDiagnosis.primary_site && (
                  <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                    {selectedDiagnosis.primary_site}
                    {selectedDiagnosis.primary_site_code && (
                      <span className="font-mono ml-1 opacity-70">({selectedDiagnosis.primary_site_code})</span>
                    )}
                  </span>
                )}
                {selectedDiagnosis.laterality && selectedDiagnosis.laterality !== 'not_applicable' && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {selectedDiagnosis.laterality}
                  </span>
                )}
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                  Dx {new Date(selectedDiagnosis.diagnosis_date).toLocaleDateString()}
                </span>
                {selectedDiagnosis.metastatic_status && selectedDiagnosis.metastatic_status !== 'unknown' && (
                  <span className="inline-flex items-center rounded-md bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 text-xs capitalize font-medium text-amber-700 dark:text-amber-400">
                    {selectedDiagnosis.metastatic_status}
                  </span>
                )}
                {selectedDiagnosis.clinical_status && (
                  <span className="inline-flex items-center rounded-md bg-emerald-100/70 dark:bg-emerald-900/30 px-2 py-0.5 text-xs capitalize font-medium text-emerald-700 dark:text-emerald-400">
                    {selectedDiagnosis.clinical_status}
                  </span>
                )}
                {selectedDiagnosis.grade && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                    <span className="opacity-70">Grade</span> {selectedDiagnosis.grade}
                  </span>
                )}
                {selectedDiagnosis.histology_morphology && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    <span className="opacity-70">Histology</span>
                    <span className="font-medium text-foreground">{selectedDiagnosis.histology_morphology}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form cards — gated on both patient + diagnosis */}
        {cancerDiagnosisId && (
          <>
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
