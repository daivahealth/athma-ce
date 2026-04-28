'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileCheck, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAdmission } from '@/modules/clinical/hooks/use-inpatient';
import {
  useCreateDischargeSummaryVersion,
  useDischargeSummaryByAdmission,
  useDischargeSummaryVersions,
} from '@/modules/clinical/hooks/use-discharge-summary';
import { useNoteTemplates } from '@/modules/foundation/hooks/use-catalogs';
import { NoteTemplateType, TemplateStatus } from '@/modules/foundation/types/catalog';

type TemplateSection = {
  id: string;
  type: string;
  label: { en: string; ar?: string };
  placeholder?: { en: string; ar?: string };
  required: boolean;
  sortOrder: number;
  content: string;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function DischargeSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const admissionId = typeof params?.admissionId === 'string' ? params.admissionId : '';

  const admissionQuery = useAdmission(admissionId);
  const summaryQuery = useDischargeSummaryByAdmission(admissionId);
  const summaryId = summaryQuery.data?.id ?? '';
  const versionsQuery = useDischargeSummaryVersions(summaryId);
  const createVersionMutation = useCreateDischargeSummaryVersion(summaryId);

  // Fetch discharge summary templates
  const templatesQuery = useNoteTemplates({
    templateType: NoteTemplateType.DISCHARGE_SUMMARY,
    status: TemplateStatus.ACTIVE,
  });

  // Get patient display from discharge summary (now includes patientDisplay from API)
  const patientDisplay = (summaryQuery.data as any)?.patientDisplay;
  const patientName = patientDisplay?.displayName || 'Unknown Patient';

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [changeReason, setChangeReason] = useState('');

  // Load existing data if available
  useEffect(() => {
    const currentData = summaryQuery.data?.currentVersion?.data;
    if (currentData && typeof currentData === 'object' && 'sections' in currentData) {
      const existingSections = (currentData as any).sections;
      if (Array.isArray(existingSections) && existingSections.length > 0) {
        setSections(existingSections.map((s: any) => ({
          id: s.id,
          type: s.type || 'textarea',
          label: s.label || { en: 'Section' },
          placeholder: s.placeholder,
          required: s.required || false,
          sortOrder: s.sortOrder || 0,
          content: s.content || '',
        })));
      }
    }
  }, [summaryQuery.data]);

  const handleLoadTemplate = (templateId: string) => {
    if (!templateId) return;

    const template = templatesQuery.data?.find((t) => t.id === templateId);
    if (!template) {
      toast({
        title: 'Template not found',
        description: 'Could not find the selected template.',
        variant: 'destructive',
      });
      return;
    }

    // Get the latest version's schema
    const latestVersion = template.versions?.[0];
    if (!latestVersion) {
      toast({
        title: 'No template version',
        description: 'This template has no versions available.',
        variant: 'destructive',
      });
      return;
    }

    if (!latestVersion.schema) {
      toast({
        title: 'Template has no schema',
        description: 'This template does not have a valid schema.',
        variant: 'destructive',
      });
      return;
    }

    // Parse the schema sections
    const schemaSections = (latestVersion.schema as any)?.sections;
    if (!Array.isArray(schemaSections) || schemaSections.length === 0) {
      toast({
        title: 'Invalid template',
        description: 'This template has no sections defined.',
        variant: 'destructive',
      });
      return;
    }

    // Map schema sections to form sections
    const mappedSections: TemplateSection[] = schemaSections.map((section: any) => ({
      id: section.id,
      type: section.type || 'textarea',
      label: section.label || { en: 'Section' },
      placeholder: section.placeholder,
      required: section.required || false,
      sortOrder: section.sortOrder || 0,
      content: '', // Start with empty content
    }));

    setSections(mappedSections.sort((a, b) => a.sortOrder - b.sortOrder));

    toast({
      title: 'Template loaded',
      description: `${template.name} loaded successfully with ${mappedSections.length} sections.`,
    });
  };

  const handleSectionChange = (sectionId: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, content: value } : section
      )
    );
  };

  const handleSave = async () => {
    if (sections.length === 0) {
      toast({
        title: 'No content',
        description: 'Please load a template first.',
        variant: 'destructive',
      });
      return;
    }

    // Check required fields
    const missingRequired = sections.filter(s => s.required && !s.content.trim());
    if (missingRequired.length > 0) {
      toast({
        title: 'Required fields missing',
        description: `Please fill in: ${missingRequired.map(s => s.label.en).join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const data = {
        version: 1,
        sections: sections.map(s => ({
          id: s.id,
          type: s.type,
          label: s.label,
          placeholder: s.placeholder,
          required: s.required,
          sortOrder: s.sortOrder,
          content: s.content,
        })),
      };

      await createVersionMutation.mutateAsync({
        data,
        changeReason: changeReason.trim() || undefined,
      });
      toast({ title: 'Summary saved', description: 'New discharge summary version created.' });
      setChangeReason('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save discharge summary.';
      toast({ title: 'Save failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.locale}/inpatient/discharge-summaries`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Discharge Summary</h1>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{patientName}</span>
              {patientDisplay && (
                <span className="ml-2">
                  MRN: {patientDisplay.mrn || '—'} · {patientDisplay.gender || '—'} / {patientDisplay.age || '—'}y
                </span>
              )}
              <span className="ml-2">
                · Admission{' '}
                {String(admissionQuery.data?.admissionNumber ?? admissionId)}
              </span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="uppercase text-xs">
          {summaryQuery.data?.status ?? 'Draft'}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Load Template
          </CardTitle>
          <CardDescription>Select a discharge summary template from the catalog to pre-populate the document.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="template-select">Note Template</Label>
              <select
                id="template-select"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={selectedTemplateId ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setSelectedTemplateId(value);
                    handleLoadTemplate(value);
                  }
                }}
              >
                <option value="">Select a discharge summary template</option>
                {templatesQuery.isLoading && (
                  <option value="" disabled>Loading templates...</option>
                )}
                {templatesQuery.data?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} (v{template.currentVersion})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Templates are managed in the{' '}
                <a
                  href={`/${params.locale}/catalogs/note-templates`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  Note Templates catalog
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="h-5 w-5 text-sky-500" />
              Summary Document
            </CardTitle>
            <CardDescription>Fill out the discharge summary sections below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No sections loaded. Please select a discharge summary template above to begin.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <Label htmlFor={section.id} className="flex items-center gap-2">
                        {section.label.en}
                        {section.required && <span className="text-destructive">*</span>}
                      </Label>
                      <Textarea
                        id={section.id}
                        value={section.content}
                        onChange={(event) => handleSectionChange(section.id, event.target.value)}
                        placeholder={section.placeholder?.en || ''}
                        rows={5}
                        className="resize-y"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="change-reason">Change reason (optional)</Label>
                  <Input
                    id="change-reason"
                    value={changeReason}
                    onChange={(event) => setChangeReason(event.target.value)}
                    placeholder="Add notes about this update"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Button onClick={handleSave} disabled={createVersionMutation.isPending || !summaryId}>
                    <Save className="mr-2 h-4 w-4" />
                    {createVersionMutation.isPending ? 'Saving...' : 'Save Discharge Summary'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>Track changes and authorship.</CardDescription>
          </CardHeader>
          <CardContent>
            {versionsQuery.isLoading && <p className="text-sm text-muted-foreground">Loading versions...</p>}
            {!versionsQuery.isLoading && (versionsQuery.data?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground">No versions yet.</p>
            )}
            {(versionsQuery.data?.length ?? 0) > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Author</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versionsQuery.data?.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>v{version.versionNo}</TableCell>
                      <TableCell>{formatDateTime(version.createdAt)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">{version.createdBy}</p>
                          {version.changeReason && (
                            <p className="text-xs text-muted-foreground">{version.changeReason}</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
