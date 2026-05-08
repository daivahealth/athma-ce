'use client';

import { useState } from 'react';
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
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import type { Patient } from '@/modules/clinical/types/patient';
import { useCreateCancerDiagnosis } from '../hooks/use-oncology';

interface AddDiagnosisSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LATERALITY_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'bilateral', label: 'Bilateral' },
  { value: 'not_applicable', label: 'Not Applicable' },
];

const METASTATIC_OPTIONS = [
  { value: 'localized', label: 'Localized' },
  { value: 'regional', label: 'Regional' },
  { value: 'distant', label: 'Distant (Metastatic)' },
  { value: 'unknown', label: 'Unknown' },
];

const CLINICAL_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'remission', label: 'Remission' },
  { value: 'recurrence', label: 'Recurrence' },
  { value: 'relapsed', label: 'Relapsed' },
  { value: 'resolved', label: 'Resolved' },
];

const VERIFICATION_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'provisional', label: 'Provisional' },
  { value: 'differential', label: 'Differential' },
  { value: 'refuted', label: 'Refuted' },
];

const GRADE_OPTIONS = [
  { value: 'G1', label: 'G1 - Well differentiated' },
  { value: 'G2', label: 'G2 - Moderately differentiated' },
  { value: 'G3', label: 'G3 - Poorly differentiated' },
  { value: 'G4', label: 'G4 - Undifferentiated' },
  { value: 'GX', label: 'GX - Cannot be assessed' },
];

export function AddDiagnosisSheet({ open, onOpenChange }: AddDiagnosisSheetProps) {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState('');

  const [cancerType, setCancerType] = useState('');
  const [primarySite, setPrimarySite] = useState('');
  const [primarySiteCode, setPrimarySiteCode] = useState('');
  const [laterality, setLaterality] = useState('');
  const [histologyMorphology, setHistologyMorphology] = useState('');
  const [morphologyCode, setMorphologyCode] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [clinicalStatus, setClinicalStatus] = useState('active');
  const [verificationStatus, setVerificationStatus] = useState('confirmed');
  const [grade, setGrade] = useState('');
  const [metastaticStatus, setMetastaticStatus] = useState('unknown');
  const [isRecurrence, setIsRecurrence] = useState(false);
  const [ecogAtDiagnosis, setEcogAtDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const { data: patientsData } = usePatients(
    { search: patientSearch, limit: 10 },
    { enabled: patientSearch.length >= 2 },
  );
  const createDiagnosis = useCreateCancerDiagnosis();

  const patients = patientsData?.data ?? [];

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientName(
      `${patient.firstName} ${patient.lastName}` +
      (patient.mrn ? ` (MRN: ${patient.mrn})` : ''),
    );
    setPatientSearch('');
  };

  const handleSubmit = async () => {
    if (!selectedPatientId || !cancerType || !primarySite || !diagnosisDate) return;

    await createDiagnosis.mutateAsync({
      patientId: selectedPatientId,
      cancerType,
      primarySite,
      primarySiteCode: primarySiteCode || undefined,
      laterality: laterality || undefined,
      histologyMorphology: histologyMorphology || undefined,
      morphologyCode: morphologyCode || undefined,
      icdCode: icdCode || undefined,
      diagnosisDate,
      clinicalStatus,
      verificationStatus,
      grade: grade || undefined,
      metastaticStatus,
      isRecurrence,
      ecogAtDiagnosis: ecogAtDiagnosis ? parseInt(ecogAtDiagnosis, 10) : undefined,
      notes: notes || undefined,
    } as Record<string, unknown>);

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedPatientId('');
    setSelectedPatientName('');
    setPatientSearch('');
    setCancerType('');
    setPrimarySite('');
    setPrimarySiteCode('');
    setLaterality('');
    setHistologyMorphology('');
    setMorphologyCode('');
    setIcdCode('');
    setDiagnosisDate('');
    setClinicalStatus('active');
    setVerificationStatus('confirmed');
    setGrade('');
    setMetastaticStatus('unknown');
    setIsRecurrence(false);
    setEcogAtDiagnosis('');
    setNotes('');
  };

  const isValid = selectedPatientId && cancerType && primarySite && diagnosisDate;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[540px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add to Oncology Registry</SheetTitle>
          <SheetDescription>
            Register a new cancer diagnosis for a patient
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Patient *</Label>
            {selectedPatientId ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                <span className="text-sm">{selectedPatientName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedPatientId(''); setSelectedPatientName(''); }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  placeholder="Search patient by name or MRN..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                {patients.length > 0 && patientSearch.length >= 2 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {patients.map((p) => (
                      <button
                        key={p.id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 border-b last:border-b-0"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <span className="font-medium">
                          {p.firstName} {p.lastName}
                        </span>
                        {p.mrn && (
                          <span className="ml-2 text-muted-foreground">MRN: {p.mrn}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cancer Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Cancer Identity</h3>

            <div className="space-y-2">
              <Label>Cancer Type *</Label>
              <Input
                placeholder="e.g. Breast Cancer, Lung Adenocarcinoma"
                value={cancerType}
                onChange={(e) => setCancerType(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Primary Site *</Label>
                <Input
                  placeholder="e.g. Upper outer quadrant of breast"
                  value={primarySite}
                  onChange={(e) => setPrimarySite(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Site Code (ICD-O-3)</Label>
                <Input
                  placeholder="e.g. C50.4"
                  value={primarySiteCode}
                  onChange={(e) => setPrimarySiteCode(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Laterality</Label>
                <Select value={laterality} onValueChange={setLaterality}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {LATERALITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ICD-10 Code</Label>
                <Input
                  placeholder="e.g. C50.911"
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Histology / Morphology</Label>
                <Input
                  placeholder="e.g. Infiltrating duct carcinoma"
                  value={histologyMorphology}
                  onChange={(e) => setHistologyMorphology(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Morphology Code (ICD-O-3)</Label>
                <Input
                  placeholder="e.g. 8500/3"
                  value={morphologyCode}
                  onChange={(e) => setMorphologyCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-1">Clinical Assessment</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Diagnosis Date *</Label>
                <Input
                  type="date"
                  value={diagnosisDate}
                  onChange={(e) => setDiagnosisDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Metastatic Status</Label>
                <Select value={metastaticStatus} onValueChange={setMetastaticStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {METASTATIC_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ECOG Performance Status</Label>
                <Select value={ecogAtDiagnosis} onValueChange={setEcogAtDiagnosis}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Fully active</SelectItem>
                    <SelectItem value="1">1 - Restricted strenuous activity</SelectItem>
                    <SelectItem value="2">2 - Ambulatory, capable of self-care</SelectItem>
                    <SelectItem value="3">3 - Limited self-care</SelectItem>
                    <SelectItem value="4">4 - Completely disabled</SelectItem>
                    <SelectItem value="5">5 - Dead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Clinical Status</Label>
                <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CLINICAL_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Verification Status</Label>
                <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurrence"
                checked={isRecurrence}
                onChange={(e) => setIsRecurrence(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRecurrence">This is a recurrence</Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Additional clinical notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || createDiagnosis.isPending}
              className="flex-1"
            >
              {createDiagnosis.isPending ? 'Saving...' : 'Add to Registry'}
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
