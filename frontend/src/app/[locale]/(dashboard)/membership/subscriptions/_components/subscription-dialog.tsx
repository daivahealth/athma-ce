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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useMembershipPlans, useCreateMembershipSubscription } from '@/modules/wellness/hooks/use-membership';
import { BillingCycle } from '@/modules/wellness/types/membership';

const formSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    planId: z.string().min(1, 'Membership plan is required'),
    billingCycle: z.nativeEnum(BillingCycle),
    startDate: z.date({
        required_error: 'Start date is required',
    }),
    autoRenew: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function SubscriptionDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const { toast } = useToast();

    const { data: plans, isLoading: isLoadingPlans } = useMembershipPlans({ isActive: true });
    const createSubscription = useCreateMembershipSubscription();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientId: '',
            planId: '',
            billingCycle: BillingCycle.MONTHLY,
            startDate: new Date(),
            autoRenew: true,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await createSubscription.mutateAsync({
                ...values,
                startDate: values.startDate,
            });

            toast({
                title: 'Subscription created successfully',
                description: 'The patient has been enrolled in the membership plan.',
                variant: 'success',
            });

            setOpen(false);
            form.reset();
            setSelectedPatient(null);
        } catch (error) {
            toast({
                title: 'Subscription failed',
                description: 'An error occurred while creating the subscription.',
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
                    <DialogTitle>New Subscription</DialogTitle>
                    <DialogDescription>
                        Enroll a patient into a membership plan.
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
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Membership Plan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a plan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingPlans ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Loading plans...
                                                </div>
                                            ) : (
                                                plans?.map((plan) => (
                                                    <SelectItem key={plan.id} value={plan.id}>
                                                        {plan.name} ({plan.tier.toUpperCase()})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="billingCycle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billing Cycle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={BillingCycle.MONTHLY}>Monthly</SelectItem>
                                                <SelectItem value={BillingCycle.YEARLY}>Yearly</SelectItem>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="autoRenew"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Auto-Renew</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Automatically renew subscription at the end of cycle.
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createSubscription.isPending}>
                                {createSubscription.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Subscribe Patient
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
