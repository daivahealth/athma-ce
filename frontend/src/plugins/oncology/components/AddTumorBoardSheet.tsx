'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useCancerDiagnoses, useCreateTumorBoardCase, useUpdateTumorBoardCase } from '../hooks/use-oncology';
import type { CancerDiagnosis, TumorBoardCase } from '../types';

interface AddTumorBoardSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardCase?: TumorBoardCase;
}

interface AttendeeRow {
  role: string;
  specialty: string;
}

const TREATMENT_INTENTS = [
  { value: 'curative', label: 'Curative' },
  { value: 'adjuvant', label: 'Adjuvant' },
  { value: 'neoadjuvant', label: 'Neoadjuvant' },
  { value: 'palliative', label: 'Palliative' },
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'supportive', label: 'Supportive' },
];

const REVIEW_OUTCOMES = [
  { value: 'approved', label: 'Approved' },
  { value: 'deferred_for_more_info', label: 'Deferred — Needs more info' },
  { value: 'second_opinion', label: 'Second opinion required' },
  { value: 'clinical_trial', label: 'Clinical trial referral' },
];

const STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'deferred', label: 'Deferred' },
];

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

function defaultAttendees(existing?: TumorBoardCase['attendees']): AttendeeRow[] {
  if (existing && existing.length > 0) {
    return existing.map((a) => ({ role: a.role, specialty: a.specialty }));
  }
  return [{ role: '', specialty: '' }];
}

export function AddTumorBoardSheet({ open, onOpenChange, boardCase }: AddTumorBoardSheetProps) {
  const isEditMode = !!boardCase;

  const [cancerDiagnosisId, setCancerDiagnosisId] = useState(boardCase?.cancer_diagnosis_id ?? '');
  const [meetingDate, setMeetingDate] = useState(
    boardCase?.meeting_date ? boardCase.meeting_date.split('T')[0] : '',
  );
  const [status, setStatus] = useState<string>(boardCase?.status ?? 'scheduled');
  const [treatmentIntent, setTreatmentIntent] = useState(boardCase?.treatment_intent ?? '');
  const [reviewOutcome, setReviewOutcome] = useState(boardCase?.review_outcome ?? '');
  const [clinicalSummary, setClinicalSummary] = useState(boardCase?.clinical_summary ?? '');
  const [imagingFindings, setImagingFindings] = useState(boardCase?.imaging_findings ?? '');
  const [pathologyReport, setPathologyReport] = useState(boardCase?.pathology_report ?? '');
  const [molecularProfile, setMolecularProfile] = useState(boardCase?.molecular_profile ?? '');
  const [mdtRecommendation, setMdtRecommendation] = useState(boardCase?.mdt_recommendation ?? '');
  const [attendees, setAttendees] = useState<AttendeeRow[]>(defaultAttendees(boardCase?.attendees));

  useEffect(() => {
    if (boardCase) {
      setCancerDiagnosisId(boardCase.cancer_diagnosis_id);
      setMeetingDate(boardCase.meeting_date ? boardCase.meeting_date.split('T')[0] : '');
      setStatus(boardCase.status);
      setTreatmentIntent(boardCase.treatment_intent ?? '');
      setReviewOutcome(boardCase.review_outcome ?? '');
      setClinicalSummary(boardCase.clinical_summary ?? '');
      setImagingFindings(boardCase.imaging_findings ?? '');
      setPathologyReport(boardCase.pathology_report ?? '');
      setMolecularProfile(boardCase.molecular_profile ?? '');
      setMdtRecommendation(boardCase.mdt_recommendation ?? '');
      setAttendees(defaultAttendees(boardCase.attendees));
    }
  }, [boardCase]);

  const { data: diagnosesData } = useCancerDiagnoses();
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];

  const createCase = useCreateTumorBoardCase();
  const updateCase = useUpdateTumorBoardCase();
  const isPending = createCase.isPending || updateCase.isPending;

  const addAttendee = () => setAttendees((prev) => [...prev, { role: '', specialty: '' }]);
  const removeAttendee = (i: number) => setAttendees((prev) => prev.filter((_, idx) => idx !== i));
  const updateAttendee = (i: number, field: keyof AttendeeRow, value: string) => {
    setAttendees((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  const handleSubmit = async () => {
    if (!cancerDiagnosisId || !meetingDate) return;

    const filledAttendees = attendees.filter((a) => a.role || a.specialty);

    const payload: Record<string, unknown> = {
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
      attendees: filledAttendees.length > 0 ? filledAttendees : [],
    };

    if (isEditMode && boardCase) {
      await updateCase.mutateAsync({ id: boardCase.id, data: payload });
    } else {
      await createCase.mutateAsync(payload as Parameters<typeof createCase.mutateAsync>[0]);
      resetForm();
    }
    onOpenChange(false);
  };

  const resetForm = () => {
    setCancerDiagnosisId('');
    setMeetingDate('');
    setStatus('scheduled');
    setTreatmentIntent('');
    setReviewOutcome('');
    setClinicalSummary('');
    setImagingFindings('');
    setPathologyReport('');
    setMolecularProfile('');
    setMdtRecommendation('');
    setAttendees([{ role: '', specialty: '' }]);
  };

  const isValid = cancerDiagnosisId && meetingDate;
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[580px] sm:max-w-[580px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Tumor Board Case' : 'Schedule Tumor Board Case'}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Update the MDT case details and decisions'
              : 'Schedule a new MDT tumor board review for a cancer diagnosis'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">

          {/* Cancer Diagnosis */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Cancer Diagnosis *</Label>
            <Select
              value={cancerDiagnosisId}
              onValueChange={setCancerDiagnosisId}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diagnosis..." />
              </SelectTrigger>
              <SelectContent>
                {diagnoses.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex flex-col">
                      <span>
                        {d.patientDisplay?.displayName
                          ? `${d.patientDisplay.displayName} — `
                          : ''}
                        {d.cancer_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {d.primary_site} · {new Date(d.diagnosis_date).toLocaleDateString()}
                        {d.patientDisplay?.mrn ? ` · MRN: ${d.patientDisplay.mrn}` : ''}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDiagnosis && (
              <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
                {selectedDiagnosis.patientDisplay && (
                  <p className="text-xs font-medium">
                    {selectedDiagnosis.patientDisplay.displayName}
                    {selectedDiagnosis.patientDisplay.mrn && (
                      <span className="ml-2 font-normal text-muted-foreground">
                        MRN: {selectedDiagnosis.patientDisplay.mrn}
                      </span>
                    )}
                    {selectedDiagnosis.patientDisplay.gender && (
                      <span className="ml-2 font-normal text-muted-foreground capitalize">
                        {selectedDiagnosis.patientDisplay.gender}
                        {selectedDiagnosis.patientDisplay.age != null
                          ? `, ${selectedDiagnosis.patientDisplay.age}y`
                          : ''}
                      </span>
                    )}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {selectedDiagnosis.clinical_status} ·{' '}
                  {selectedDiagnosis.metastatic_status}
                  {selectedDiagnosis.grade && ` · Grade: ${selectedDiagnosis.grade}`}
                </p>
              </div>
            )}
            {!isEditMode && diagnoses.length === 0 && (
              <p className="text-xs text-yellow-600">
                No diagnoses found. Add one in the Oncology Registry first.
              </p>
            )}
          </div>

          {/* Meeting Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Meeting Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Meeting Date *</Label>
                <Input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-sm font-semibold">Attendees</h3>
              <Button type="button" variant="ghost" size="sm" onClick={addAttendee}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>

            {attendees.map((attendee, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Select value={attendee.role || '__none'} onValueChange={(v) => updateAttendee(i, 'role', v === '__none' ? '' : v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Role —</SelectItem>
                      {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={attendee.specialty || '__none'} onValueChange={(v) => updateAttendee(i, 'specialty', v === '__none' ? '' : v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Specialty" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Specialty —</SelectItem>
                      {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {attendees.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeAttendee(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Clinical Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Clinical Information</h3>

            <div className="space-y-2">
              <Label>Clinical Summary</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Current clinical status, history, performance status..."
                value={clinicalSummary}
                onChange={(e) => setClinicalSummary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Imaging Findings</Label>
              <textarea
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="CT, MRI, PET-CT findings..."
                value={imagingFindings}
                onChange={(e) => setImagingFindings(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Pathology Report</Label>
              <textarea
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Biopsy results, receptor status, pathology reference..."
                value={pathologyReport}
                onChange={(e) => setPathologyReport(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Molecular / Genomic Profile</Label>
              <textarea
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="NGS findings, biomarkers, mutation status..."
                value={molecularProfile}
                onChange={(e) => setMolecularProfile(e.target.value)}
              />
            </div>
          </div>

          {/* MDT Decision */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">MDT Decision</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Treatment Intent</Label>
                <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not decided —</SelectItem>
                    {TREATMENT_INTENTS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Review Outcome</Label>
                <Select value={reviewOutcome || '__none'} onValueChange={(v) => setReviewOutcome(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Pending —</SelectItem>
                    {REVIEW_OUTCOMES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>MDT Recommendation</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Board decision, recommended treatment pathway, follow-up plan..."
                value={mdtRecommendation}
                onChange={(e) => setMdtRecommendation(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSubmit} disabled={!isValid || isPending} className="flex-1">
              {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Schedule Case'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
