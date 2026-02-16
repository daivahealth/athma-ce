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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useLongevityProtocols, useCreateLongevityTreatment } from '@/modules/wellness/hooks/use-longevity';

const formSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    protocolId: z.string().min(1, 'Protocol is required'),
    scheduledAt: z.date({
        required_error: 'Scheduled date is required',
    }),
    preTreatmentNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TreatmentProtocolDialog({
    children,
    defaultPatient,
}: {
    children: React.ReactNode;
    defaultPatient?: any;
}) {
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(defaultPatient || null);
    const { toast } = useToast();

    const { data: protocols, isLoading: isLoadingProtocols } = useLongevityProtocols({ isActive: true });
    const createTreatment = useCreateLongevityTreatment();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientId: defaultPatient?.id || '',
            protocolId: '',
            scheduledAt: new Date(),
            preTreatmentNotes: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await createTreatment.mutateAsync({
                patientId: values.patientId,
                protocolId: values.protocolId,
                scheduledAt: values.scheduledAt.toISOString(),
                preTreatmentNotes: values.preTreatmentNotes,
                facilityId: '11111111-1111-1111-1111-111111111111', // Default facility for now
            });

            toast({
                title: 'Treatment scheduled successfully',
                description: 'The longevity treatment protocol has been scheduled.',
                variant: 'success',
            });

            setOpen(false);
            form.reset({
                patientId: '',
                protocolId: '',
                scheduledAt: new Date(),
                preTreatmentNotes: '',
            });
            setSelectedPatient(null);
        } catch (error) {
            toast({
                title: 'Scheduling failed',
                description: 'An error occurred while scheduling the treatment.',
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
                    <DialogTitle>New Treatment Protocol</DialogTitle>
                    <DialogDescription>
                        Schedule a longevity treatment protocol for a patient.
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
                            name="protocolId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Protocol</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a protocol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingProtocols ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Loading protocols...
                                                </div>
                                            ) : (
                                                protocols?.map((protocol) => (
                                                    <SelectItem key={protocol.id} value={protocol.id}>
                                                        {protocol.name} ({protocol.administrationRoute.toUpperCase()})
                                                    </SelectItem>
                                                ))
                                            )}
                                            {!isLoadingProtocols && protocols?.length === 0 && (
                                                <div className="p-2 text-sm text-muted-foreground text-center">
                                                    No active protocols found
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
                            name="scheduledAt"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Scheduled At</FormLabel>
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
                                                    {field.value ? format(field.value, 'PPP HH:mm') : <span>Pick a date</span>}
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
                            name="preTreatmentNotes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pre-treatment Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add any specific instructions or notes for this treatment..."
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
                            <Button type="submit" disabled={createTreatment.isPending}>
                                {createTreatment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Schedule Treatment
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
