'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NoteType } from '../../types/charting';
import { useCreateClinicalNote } from '../../hooks/use-charting';

const clinicalNoteSchema = z.object({
  noteType: z.nativeEnum(NoteType),
  title: z.string().optional(),
  subjectiveText: z.string().optional(),
  objectiveText: z.string().optional(),
  assessmentText: z.string().optional(),
  planText: z.string().optional(),
});

type ClinicalNoteFormValues = z.infer<typeof clinicalNoteSchema>;

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

  const form = useForm<ClinicalNoteFormValues>({
    resolver: zodResolver(clinicalNoteSchema),
    defaultValues: {
      noteType: NoteType.SOAP,
    },
  });

  const onSubmit = async (values: ClinicalNoteFormValues) => {
    const sections = [];

    if (values.subjectiveText) {
      sections.push({
        sectionCode: 'subjective',
        sectionName: 'Subjective',
        content: { text: values.subjectiveText },
        sortOrder: 1,
      });
    }

    if (values.objectiveText) {
      sections.push({
        sectionCode: 'objective',
        sectionName: 'Objective',
        content: { text: values.objectiveText },
        sortOrder: 2,
      });
    }

    if (values.assessmentText) {
      sections.push({
        sectionCode: 'assessment',
        sectionName: 'Assessment',
        content: { text: values.assessmentText },
        sortOrder: 3,
      });
    }

    if (values.planText) {
      sections.push({
        sectionCode: 'plan',
        sectionName: 'Plan',
        content: { text: values.planText },
        sortOrder: 4,
      });
    }

    await createNoteMutation.mutateAsync({
      encounterId,
      patientId,
      noteType: values.noteType,
      title: values.title,
      authorStaffId,
      sections,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="noteType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NoteType.SOAP}>SOAP Note</SelectItem>
                    <SelectItem value={NoteType.PROGRESS}>Progress Note</SelectItem>
                    <SelectItem value={NoteType.H_AND_P}>H&P</SelectItem>
                    <SelectItem value={NoteType.DISCHARGE}>Discharge Summary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Note title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subjectiveText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjective</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Patient complaints, history..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectiveText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Physical exam findings, vitals..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Clinical assessment, diagnoses..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Treatment plan, follow-up..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createNoteMutation.isPending}>
          {createNoteMutation.isPending ? 'Saving...' : 'Save Clinical Note'}
        </Button>
      </form>
    </Form>
  );
}