'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useBiomarkers, useRecordBiomarkerResult } from '@/modules/wellness/hooks/use-biomarkers';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    biomarkerId: z.string().min(1, 'Biomarker is required'),
    value: z.coerce.number().refine((val) => !isNaN(val), {
        message: 'Value must be a number',
    }),
    unit: z.string().optional(),
    recordedAt: z.date({
        required_error: 'Date is required',
    }),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BiomarkerResultDialog({
    children,
    defaultPatient,
}: {
    children: React.ReactNode;
    defaultPatient?: any;
}) {
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(defaultPatient || null);
    const { data: biomarkers, isLoading: isLoadingBiomarkers } = useBiomarkers({ isActive: true });
    const recordResult = useRecordBiomarkerResult();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientId: defaultPatient?.id || '',
            value: undefined,
            recordedAt: new Date(),
            notes: '',
        },
    });

    // Update unit when biomarker changes
    const onBiomarkerChange = (id: string) => {
        form.setValue('biomarkerId', id);
        const biomarker = biomarkers?.find((b) => b.id === id);
        if (biomarker) {
            form.setValue('unit', biomarker.unit);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            await recordResult.mutateAsync({
                patientId: values.patientId,
                biomarkerId: values.biomarkerId,
                value: values.value,
                unit: values.unit,
                recordedAt: values.recordedAt.toISOString(),
                notes: values.notes,
                source: 'manual_entry',
            });
            toast({
                title: 'Biomarker result recorded',
                description: 'The result has been successfully added.',
                variant: 'success',
            });
            setOpen(false);
            form.reset({
                patientId: '',
                value: undefined,
                recordedAt: new Date(),
                notes: '',
                unit: '',
            });
            setSelectedPatient(null);
        } catch (error) {
            toast({
                title: 'Failed to record result',
                description: 'An error occurred while saving the result.',
                variant: 'destructive',
            });
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Biomarker Result</DialogTitle>
                    <DialogDescription>
                        Manually record a biomarker test result for a patient.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Patient</FormLabel>
                                    <FormControl>
                                        <PatientSearchSelect
                                            selectedPatient={selectedPatient}
                                            onSelect={(patient) => {
                                                setSelectedPatient(patient);
                                                field.onChange(patient.id);
                                            }}
                                            onClear={() => {
                                                setSelectedPatient(null);
                                                field.onChange('');
                                            }}
                                            error={form.formState.errors.patientId?.message}
                                            placeholder="Select a patient"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="biomarkerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Biomarker</FormLabel>
                                    <Select onValueChange={onBiomarkerChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select biomarker" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingBiomarkers ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                </div>
                                            ) : (
                                                biomarkers?.map((biomarker) => (
                                                    <SelectItem key={biomarker.id} value={biomarker.id}>
                                                        {biomarker.biomarkerName} ({biomarker.unit})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly className="bg-muted" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="recordedAt"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date Recorded</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date('1900-01-01')
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional context..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={recordResult.isPending}>
                                {recordResult.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Result
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
