'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardList, Plus, Loader2, AlertCircle } from 'lucide-react';
import {
  useWellnessAssessments,
  useAssessmentTemplates,
  useCreateAssessment,
} from '@/modules/wellness/hooks/use-wellness-assessments';
import { PatientSearchSelect } from '@/components/patient-search-select';
import type { WellnessAssessment } from '@/modules/wellness/types/wellness-assessment';

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function WellnessAssessmentsPage() {
  const t = useTranslations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [templateId, setTemplateId] = useState('');

  const { data: assessments, isLoading: assessmentsLoading } = useWellnessAssessments();
  const { data: templates, isLoading: templatesLoading } = useAssessmentTemplates({ isActive: true });
  const createAssessment = useCreateAssessment();

  const handleCreate = async () => {
    if (!selectedPatient || !templateId) return;

    try {
      await createAssessment.mutateAsync({
        patientId: selectedPatient.id,
        templateId,
      });
      setDialogOpen(false);
      setSelectedPatient(null);
      setTemplateId('');
    } catch {
      // Error is handled by mutation state
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedPatient(null);
      setTemplateId('');
      createAssessment.reset();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.wellnessAssessments')}</h1>
            <p className="text-muted-foreground">
              Create and manage wellness assessments
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
              <DialogDescription>
                Select a patient and assessment template to begin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Patient Search Selection */}
              <PatientSearchSelect
                required
                selectedPatient={selectedPatient}
                onSelect={(patient) => setSelectedPatient(patient)}
                onClear={() => setSelectedPatient(null)}
              />

              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="template">Assessment Template *</Label>
                {templatesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading templates...
                  </div>
                ) : templates && templates.length > 0 ? (
                  <Select value={templateId} onValueChange={setTemplateId}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((tpl) => (
                        <SelectItem key={tpl.id} value={tpl.id}>
                          {tpl.name} ({tpl.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No assessment templates available.{' '}
                    <p className="mt-1">
                      <a href="/en/wellness/templates/new" className="text-primary hover:underline">
                        Create a template
                      </a>{' '}
                      to get started.
                    </p>
                  </div>
                )}
              </div>

              {createAssessment.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Failed to create assessment. Please try again.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleDialogChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!selectedPatient || !templateId || createAssessment.isPending}
              >
                {createAssessment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create Assessment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wellness Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {assessmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading assessments...</span>
            </div>
          ) : assessments && assessments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Template</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment: WellnessAssessment) => (
                    <tr
                      key={assessment.id}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs">
                        {assessment.patientId.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        {assessment.template?.name ?? assessment.templateId.slice(0, 8) + '...'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(assessment.status)}`}
                        >
                          {formatStatus(assessment.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {assessment.overallScore !== undefined
                          ? assessment.overallScore.toFixed(1)
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No assessments yet. Click &quot;New Assessment&quot; to create one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
