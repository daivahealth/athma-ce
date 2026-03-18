'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNoteTemplates } from '@/modules/foundation/hooks/use-catalogs';
import { TemplateStatus } from '@/modules/foundation/types/catalog';
import { NoteType } from '../../types/charting';
import {
  useClinicalNotesByEncounter,
  useCreateClinicalNote,
  useUpdateClinicalNote,
} from '../../hooks/use-charting';

const clinicalNoteSchema = z.object({
  noteType: z.nativeEnum(NoteType),
});

type ClinicalNoteFormValues = z.infer<typeof clinicalNoteSchema>;

type TemplateSection = {
  sectionCode: string;
  sectionName: string;
  placeholder?: string;
  sortOrder: number;
  content: string;
};

interface ClinicalNotesFormProps {
  encounterId: string;
  patientId: string;
  authorStaffId: string;
  onSuccess?: () => void;
}

export function ClinicalNotesForm({
  encounterId,
  patientId,
  authorStaffId,
  onSuccess
}: ClinicalNotesFormProps) {
  const createNoteMutation = useCreateClinicalNote();
  const updateNoteMutation = useUpdateClinicalNote();
  const { data: encounterNotes } = useClinicalNotesByEncounter(encounterId);
  const existingNote = useMemo(
    () => (encounterNotes && encounterNotes.length > 0 ? encounterNotes[0] : null),
    [encounterNotes]
  );
  const { data: templates } = useNoteTemplates({ status: TemplateStatus.ACTIVE });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [sections, setSections] = useState<TemplateSection[]>([]);

  const form = useForm<ClinicalNoteFormValues>({
    resolver: zodResolver(clinicalNoteSchema),
    defaultValues: {
      noteType: NoteType.SOAP,
    },
  });

  const parsedTemplates = useMemo(() => templates ?? [], [templates]);

  useEffect(() => {
    if (existingNote) {
      form.setValue('noteType', existingNote.noteType ?? NoteType.SOAP);
      // Load sections from content JSON
      const noteContent = existingNote.content as Record<string, any> | undefined;
      const contentSections = noteContent?.sections as any[] | undefined;
      const noteSections = (contentSections ?? []).map((section: any, index: number) => ({
        sectionCode: section.code || `section_${index + 1}`,
        sectionName: section.name || `Section ${index + 1}`,
        placeholder: '',
        sortOrder: section.sortOrder || index + 1,
        content: typeof section.text === 'string' ? section.text : '',
      }));
      setSections(noteSections);
      setSelectedTemplateId(null);
    } else if (!selectedTemplateId && parsedTemplates.length === 1) {
      handleTemplateChange(parsedTemplates[0].id);
    }
  }, [existingNote, parsedTemplates, selectedTemplateId, form]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = parsedTemplates.find((entry) => entry.id === templateId);
    if (!template) {
      setSections([]);
      return;
    }

    const latestVersion = template.versions?.[0];
    const schemaSections = (latestVersion?.schema as { sections?: any[] } | undefined)?.sections;
    if (!Array.isArray(schemaSections) || schemaSections.length === 0) {
      setSections([]);
      return;
    }
    const mappedSections: TemplateSection[] = schemaSections.map((section, index) => {
      const sectionCode = section.sectionCode || `section_${index + 1}`;
      const resolveText = (value: any) => {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
          if (typeof value.text === 'string') return value.text;
          if (typeof value.en === 'string') return value.en;
          const firstKey = Object.keys(value)[0];
          if (firstKey && typeof value[firstKey] === 'string') return value[firstKey];
        }
        return '';
      };

      const sectionName =
        resolveText(section.title) ||
        resolveText(section.label) ||
        resolveText(section.sectionName) ||
        resolveText(section.name) ||
        `Section ${index + 1}`;

      let placeholder = '';
      placeholder =
        resolveText(section.placeholder) ||
        resolveText(section.description) ||
        resolveText(section.hint) ||
        '';

      let content = '';
      content =
        resolveText(section.defaultText) ||
        resolveText(section.content) ||
        resolveText(section.initialValue) ||
        '';

      return {
        sectionCode,
        sectionName,
        placeholder,
        sortOrder: section.sortOrder || index + 1,
        content,
      };
    });
    setSections(mappedSections);
  };

  const handleSectionChange = (sectionCode: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sectionCode === sectionCode ? { ...section, content: value } : section
      )
    );
  };

  const onSubmit = async (values: ClinicalNoteFormValues) => {
    if (sections.length === 0 || (!existingNote && !selectedTemplateId)) {
      return;
    }
    const contentSections = sections
      .map((section) => ({
        code: section.sectionCode,
        name: section.sectionName,
        sortOrder: section.sortOrder,
        text: section.content.trim(),
      }))
      .filter((section) => section.text);

    const contentPayload = {
      noteType: values.noteType,
      version: '1.0.0',
      sections: contentSections,
    };

    if (existingNote) {
      await updateNoteMutation.mutateAsync({
        id: existingNote.id,
        encounterId,
        payload: { content: contentPayload },
      });
    } else {
      await createNoteMutation.mutateAsync({
        encounterId,
        patientId,
        noteType: values.noteType,
        title: undefined,
        authorStaffId,
        content: contentPayload,
      });
    }

    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!existingNote ? (
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">Template</p>
            <Select
              value={selectedTemplateId ?? undefined}
              onValueChange={handleTemplateChange}
              disabled={!parsedTemplates.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {parsedTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              {selectedTemplateId
                ? 'Template sections loaded.'
                : parsedTemplates.length
                ? 'Select a template to compose notes.'
                : 'No templates available.'}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-muted p-3 text-sm text-muted-foreground">
            Editing existing note captured on {new Date(existingNote.createdAt).toLocaleString()}.
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.sectionCode} className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{section.sectionName}</p>
              <Textarea
                value={section.content}
                onChange={(event) => handleSectionChange(section.sectionCode, event.target.value)}
                placeholder={section.placeholder || ''}
                rows={3}
              />
            </div>
          ))}
        </div>
        {!sections.length && (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            {existingNote
              ? 'This note has no sections yet.'
              : parsedTemplates.length
              ? 'Select a note template to load its sections.'
              : 'No templates available. Please create templates in the foundation catalog.'}
          </div>
        )}
        <Button
          type="submit"
          disabled={
            sections.length === 0 ||
            (!existingNote && (!selectedTemplateId || createNoteMutation.isPending)) ||
            (existingNote ? updateNoteMutation.isPending : false)
          }
        >
          {existingNote
            ? updateNoteMutation.isPending
              ? 'Updating...'
              : 'Update Clinical Note'
            : createNoteMutation.isPending
            ? 'Saving...'
            : 'Save Clinical Note'}
        </Button>
      </form>
    </Form>
  );
}
