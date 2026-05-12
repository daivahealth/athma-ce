'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
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
