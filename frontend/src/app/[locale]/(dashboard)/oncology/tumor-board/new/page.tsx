'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarDays, Gavel, Plus, Save, Stethoscope, Trash2, Users, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FIELD_CONTROL, FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import {
  DiagnosisContextCard,
  DiagnosisPickerCard,
  PatientContextCard,
  PatientPickerCard,
  diagnosisFromCancerDiagnosis,
  patientFromSearch,
} from '@/plugins/oncology/components/FormContextCards';
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

/** A patient picked in `PatientSearchSelect`; only its id is read here. */
type SelectedPatient = { id: string } & Record<string, unknown>;

export default function NewTumorBoardPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/tumor-board`);

  const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
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

  const handleSelectPatient = (p: SelectedPatient) => { setSelectedPatient(p); setCancerDiagnosisId(''); };
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

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Schedule Tumor Board Case"
        subtitle="Schedule a new MDT tumor board review"
        icon={Users}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/tumor-board`, label: 'Tumor Board' }, { label: 'New' }]} />
        }
      />

      <div className="space-y-6">
        {!selectedPatient ? (
          <PatientPickerCard onSelect={handleSelectPatient} onClear={handleClearPatient} />
        ) : (
          <PatientContextCard patient={patientFromSearch(selectedPatient)} onChange={handleClearPatient} />
        )}

        {selectedPatient && !cancerDiagnosisId && (
          <DiagnosisPickerCard
            diagnoses={diagnoses}
            loading={diagnosesLoading}
            onPick={setCancerDiagnosisId}
            onAddNew={() => router.push(`/${params.locale}/oncology/registry/new`)}
          />
        )}

        {selectedDiagnosis && (
          <DiagnosisContextCard
            diagnosis={diagnosisFromCancerDiagnosis(selectedDiagnosis)}
            onChange={diagnoses.length > 1 ? () => setCancerDiagnosisId('') : undefined}
          />
        )}

        {cancerDiagnosisId && (
          <>
            <FormSection icon={CalendarDays} title="Meeting Details" description="When the board meets and where the case stands">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="meetingDate" label="Meeting Date" required>
                  <Input id="meetingDate" type="date" className={FIELD_CONTROL} value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
                </FormField>
                <FormField id="status" label="Status">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="deferred">Deferred</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              icon={UsersRound}
              title="Attendees"
              description="Who sits on the board for this case, by role and specialty"
              contentClassName="space-y-3"
              actions={
                <Button type="button" variant="ghost" size="sm" onClick={addAttendee}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              }
            >
              {attendees.map((attendee, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Select value={attendee.role || '__none'} onValueChange={(v) => updateAttendee(i, 'role', v === '__none' ? '' : v)}>
                      <SelectTrigger className="h-9" aria-label={`Attendee ${i + 1} role`}><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Role —</SelectItem>
                        {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={attendee.specialty || '__none'} onValueChange={(v) => updateAttendee(i, 'specialty', v === '__none' ? '' : v)}>
                      <SelectTrigger className="h-9" aria-label={`Attendee ${i + 1} specialty`}><SelectValue placeholder="Specialty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Specialty —</SelectItem>
                        {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {attendees.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeAttendee(i)} aria-label={`Remove attendee ${i + 1}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </FormSection>

            <FormSection icon={Stethoscope} title="Clinical Information" description="Summary, imaging, pathology and molecular findings for the board">
              <FormField id="clinicalSummary" label="Clinical Summary">
                <Textarea id="clinicalSummary" className="min-h-[80px]" placeholder="Current clinical status, history, performance status..." value={clinicalSummary} onChange={(e) => setClinicalSummary(e.target.value)} />
              </FormField>
              <FormField id="imagingFindings" label="Imaging Findings">
                <Textarea id="imagingFindings" className="min-h-[60px]" placeholder="CT, MRI, PET-CT findings..." value={imagingFindings} onChange={(e) => setImagingFindings(e.target.value)} />
              </FormField>
              <FormField id="pathologyReport" label="Pathology Report">
                <Textarea id="pathologyReport" className="min-h-[60px]" placeholder="Biopsy results, receptor status..." value={pathologyReport} onChange={(e) => setPathologyReport(e.target.value)} />
              </FormField>
              <FormField id="molecularProfile" label="Molecular / Genomic Profile">
                <Textarea id="molecularProfile" className="min-h-[60px]" placeholder="NGS findings, biomarkers, mutation status..." value={molecularProfile} onChange={(e) => setMolecularProfile(e.target.value)} />
              </FormField>
            </FormSection>

            <FormSection icon={Gavel} title="MDT Decision" description="The board's treatment intent, outcome and recommendation">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="treatmentIntent" label="Treatment Intent">
                  <Select value={treatmentIntent || '__none'} onValueChange={(v) => setTreatmentIntent(v === '__none' ? '' : v)}>
                    <SelectTrigger id="treatmentIntent"><SelectValue placeholder="Select..." /></SelectTrigger>
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
                </FormField>
                <FormField id="reviewOutcome" label="Review Outcome">
                  <Select value={reviewOutcome || '__none'} onValueChange={(v) => setReviewOutcome(v === '__none' ? '' : v)}>
                    <SelectTrigger id="reviewOutcome"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Pending —</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="deferred_for_more_info">Deferred — Needs more info</SelectItem>
                      <SelectItem value="second_opinion">Second opinion required</SelectItem>
                      <SelectItem value="clinical_trial">Clinical trial referral</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField id="mdtRecommendation" label="MDT Recommendation">
                <Textarea id="mdtRecommendation" className="min-h-[80px]" placeholder="Board decision, recommended treatment pathway..." value={mdtRecommendation} onChange={(e) => setMdtRecommendation(e.target.value)} />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createCase.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createCase.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createCase.isPending ? 'Saving...' : 'Schedule Case'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
