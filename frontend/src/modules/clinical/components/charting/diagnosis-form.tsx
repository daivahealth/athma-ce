'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DiagnosisType } from '../../types/charting';
import { useCreateDiagnosis } from '../../hooks/use-charting';

const diagnosisSchema = z.object({
  icdCode: z.string().min(1, 'ICD code is required'),
  diagnosisName: z.string().min(1, 'Diagnosis name is required'),
  diagnosisType: z.nativeEnum(DiagnosisType),
  chronicCondition: z.boolean().optional(),
  notes: z.string().optional(),
});

type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

interface DiagnosisFormProps {
  encounterId: string;
  patientId: string;
  addedBy: string;
  onSuccess?: () => void;
}

export function DiagnosisForm({ encounterId, patientId, addedBy, onSuccess }: DiagnosisFormProps) {
  const createDiagnosisMutation = useCreateDiagnosis();

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      diagnosisType: DiagnosisType.PRIMARY,
      chronicCondition: false,
    },
  });

  const onSubmit = async (values: DiagnosisFormValues) => {
    await createDiagnosisMutation.mutateAsync({
      encounterId,
      patientId,
      addedBy,
      ...values,
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
            name="icdCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICD-10 Code*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., E11.9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diagnosisType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnosis Type*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={DiagnosisType.PRIMARY}>Primary</SelectItem>
                    <SelectItem value={DiagnosisType.SECONDARY}>Secondary</SelectItem>
                    <SelectItem value={DiagnosisType.RULE_OUT}>Rule Out</SelectItem>
                    <SelectItem value={DiagnosisType.DIFFERENTIAL}>Differential</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diagnosisName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis Name*</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Type 2 Diabetes Mellitus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronicCondition"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Chronic Condition</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createDiagnosisMutation.isPending}>
          {createDiagnosisMutation.isPending ? 'Adding...' : 'Add Diagnosis'}
        </Button>
      </form>
    </Form>
  );
}