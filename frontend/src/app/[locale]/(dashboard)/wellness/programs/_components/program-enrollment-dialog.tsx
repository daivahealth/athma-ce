'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

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
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useProgramTemplates, useEnrollPatient } from '@/modules/wellness/hooks/use-wellness-programs';

const formSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    templateId: z.string().min(1, 'Program is required'),
    startDate: z.date({
        required_error: 'Start date is required',
    }),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProgramEnrollmentDialog({
    children,
    defaultPatient,
}: {
    children: React.ReactNode;
    defaultPatient?: any;
}) {
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(defaultPatient || null);
    const { toast } = useToast();

    const { data: templates, isLoading: isLoadingTemplates } = useProgramTemplates({ isActive: true });
    const enrollPatient = useEnrollPatient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientId: defaultPatient?.id || '',
            templateId: '',
            startDate: new Date(),
            notes: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await enrollPatient.mutateAsync({
                patientId: values.patientId,
                templateId: values.templateId,
                startDate: values.startDate.toISOString(),
                notes: values.notes,
            });

            toast({
                title: 'Patient enrolled successfully',
                description: 'The patient has been enrolled in the wellness program.',
                variant: 'success',
            });

            setOpen(false);
            form.reset({
                patientId: '',
                templateId: '',
                startDate: new Date(),
                notes: '',
            });
            setSelectedPatient(null);
        } catch (error) {
            toast({
                title: 'Enrollment failed',
                description: 'An error occurred while enrolling the patient.',
                variant: 'destructive',
            });
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Program Enrollment</DialogTitle>
                    <DialogDescription>
                        Enroll a patient in a wellness program. This will create a schedule of sessions and milestones.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <PatientSearchSelect
                                        label="Patient"
                                        required
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
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="templateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a program" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingTemplates ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Loading programs...
                                                </div>
                                            ) : (
                                                templates?.map((template) => (
                                                    <SelectItem key={template.id} value={template.id}>
                                                        {template.programName} ({template.durationWeeks} weeks)
                                                    </SelectItem>
                                                ))
                                            )}
                                            {!isLoadingTemplates && templates?.length === 0 && (
                                                <div className="p-2 text-sm text-muted-foreground text-center">
                                                    No active programs found
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
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
                                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date('1900-01-01')}
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
                                            placeholder="Add any specific instructions or notes for this enrollment..."
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
                            <Button type="submit" disabled={enrollPatient.isPending}>
                                {enrollPatient.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enroll Patient
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
