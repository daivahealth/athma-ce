'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, User, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useTumorBoardCase, useUpdateTumorBoardCase } from '@/plugins/oncology/hooks/use-oncology';

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

export default function EditTumorBoardPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/tumor-board`);

  const { data: boardCase, isLoading } = useTumorBoardCase(params.id);
  const updateCase = useUpdateTumorBoardCase();

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

  useEffect(() => {
    if (boardCase) {
      setMeetingDate(boardCase.meeting_date?.substring(0, 10) ?? '');
      setStatus(boardCase.status ?? 'scheduled');
      setTreatmentIntent(boardCase.treatment_intent ?? '');
      setReviewOutcome(boardCase.review_outcome ?? '');
      setClinicalSummary(boardCase.clinical_summary ?? '');
      setImagingFindings(boardCase.imaging_findings ?? '');
      setPathologyReport(boardCase.pathology_report ?? '');
      setMolecularProfile(boardCase.molecular_profile ?? '');
      setMdtRecommendation(boardCase.mdt_recommendation ?? '');
      const existing = boardCase.attendees ?? [];
      setAttendees(existing.length > 0
        ? existing.map((a) => ({ role: a.role, specialty: a.specialty }))
        : [{ role: '', specialty: '' }]);
    }
  }, [boardCase]);

  const addAttendee = () => setAttendees((p) => [...p, { role: '', specialty: '' }]);
  const removeAttendee = (i: number) => setAttendees((p) => p.filter((_, idx) => idx !== i));
  const updateAttendee = (i: number, field: keyof AttendeeRow, v: string) =>
    setAttendees((p) => p.map((a, idx) => idx === i ? { ...a, [field]: v } : a));

  const isValid = meetingDate;

  const handleSubmit = async () => {
    if (!isValid) return;
    const filledAttendees = attendees.filter((a) => a.role || a.specialty);
    await updateCase.mutateAsync({
      id: params.id,
      data: {
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
      },
    });
    back();
  };

  if (isLoading) return <div className="text-muted-foreground p-8">Loading...</div>;

  const age = boardCase?.patient_date_of_birth
    ? Math.floor((Date.now() - new Date(boardCase.patient_date_of_birth).getTime()) / 31557600000)
    : null;

  const grade = boardCase?.diagnosis_grade;
  const histology = boardCase?.diagnosis_histology;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Tumor Board Case</h1>
          <p className="text-muted-foreground text-sm">
            {boardCase?.cancer_type && `${boardCase.cancer_type}`}
            {boardCase?.primary_site && ` · ${boardCase.primary_site}`}
          </p>
        </div>
      </div>

      {/* Patient + Diagnosis context banner */}
      {boardCase && (
        <div className="grid grid-cols-2 gap-4">

          {/* Patient — blue */}
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">
                {boardCase.patient_display_name ||
                  `${boardCase.patient_first_name ?? ''} ${boardCase.patient_last_name ?? ''}`.trim() ||
                  '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {boardCase.patient_mrn && (
                  <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                    {boardCase.patient_mrn}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {age} yrs
                  </span>
                )}
                {boardCase.patient_gender && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {boardCase.patient_gender}
                  </span>
                )}
                {boardCase.patient_phone_number && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {boardCase.patient_phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cancer Diagnosis — rose/purple */}
          <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                  <Dna className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">{boardCase.cancer_type}</p>
              <div className="flex flex-wrap gap-2">
                {boardCase.primary_site && (
                  <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                    {boardCase.primary_site}
                    {boardCase.primary_site_code && (
                      <span className="font-mono ml-1 opacity-70">({boardCase.primary_site_code})</span>
                    )}
                  </span>
                )}
                {boardCase.laterality && boardCase.laterality !== 'not_applicable' && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {boardCase.laterality}
                  </span>
                )}
                {boardCase.diagnosis_date && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    Dx {new Date(boardCase.diagnosis_date).toLocaleDateString()}
                  </span>
                )}
                {boardCase.metastatic_status && boardCase.metastatic_status !== 'unknown' && (
                  <span className="inline-flex items-center rounded-md bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 text-xs capitalize font-medium text-amber-700 dark:text-amber-400">
                    {boardCase.metastatic_status}
                  </span>
                )}
                {boardCase.clinical_status && (
                  <span className="inline-flex items-center rounded-md bg-emerald-100/70 dark:bg-emerald-900/30 px-2 py-0.5 text-xs capitalize font-medium text-emerald-700 dark:text-emerald-400">
                    {boardCase.clinical_status}
                  </span>
                )}
                {boardCase.icd_code && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    {boardCase.icd_code}
                  </span>
                )}
                {grade && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                    <span className="opacity-70">Grade</span> {grade}
                  </span>
                )}
                {histology && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    <span className="opacity-70">Histology</span>
                    <span className="font-medium text-foreground">{histology}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      <div className="space-y-6">
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
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={clinicalSummary} onChange={(e) => setClinicalSummary(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Imaging Findings</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={imagingFindings} onChange={(e) => setImagingFindings(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Pathology Report</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={pathologyReport} onChange={(e) => setPathologyReport(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Molecular / Genomic Profile</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={molecularProfile} onChange={(e) => setMolecularProfile(e.target.value)} />
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
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={mdtRecommendation} onChange={(e) => setMdtRecommendation(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={back} disabled={updateCase.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || updateCase.isPending}>
            {updateCase.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
