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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCreateNutritionPlan, useCreateExercisePrescription } from '@/modules/wellness/hooks/use-lifestyle';

const nutritionSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    planName: z.string().min(1, 'Plan name is required'),
    planType: z.string().min(1, 'Plan type is required'),
    startDate: z.date({ required_error: 'Start date is required' }),
    targetCalories: z.coerce.number().optional(),
    targetProtein: z.coerce.number().optional(),
    targetCarbs: z.coerce.number().optional(),
    targetFat: z.coerce.number().optional(),
    notes: z.string().optional(),
});

const exerciseSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    prescriptionName: z.string().min(1, 'Prescription name is required'),
    goal: z.string().min(1, 'Goal is required'),
    startDate: z.date({ required_error: 'Start date is required' }),
    sessionsPerWeek: z.coerce.number().min(1),
    minutesPerSession: z.coerce.number().min(1),
    notes: z.string().optional(),
});

export function LifestylePlanDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('nutrition');
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const { toast } = useToast();

    const createNutritionPlan = useCreateNutritionPlan();
    const createExercisePrescription = useCreateExercisePrescription();

    const nutritionForm = useForm<z.infer<typeof nutritionSchema>>({
        resolver: zodResolver(nutritionSchema),
        defaultValues: {
            patientId: '',
            planName: '',
            planType: 'maintenance',
            startDate: new Date(),
        },
    });

    const exerciseForm = useForm<z.infer<typeof exerciseSchema>>({
        resolver: zodResolver(exerciseSchema),
        defaultValues: {
            patientId: '',
            prescriptionName: '',
            goal: 'cardiovascular',
            startDate: new Date(),
            sessionsPerWeek: 3,
            minutesPerSession: 30,
        },
    });

    const onNutritionSubmit = async (values: z.infer<typeof nutritionSchema>) => {
        try {
            await createNutritionPlan.mutateAsync({
                ...values,
                startDate: values.startDate.toISOString(),
            });
            toast({ title: 'Nutrition plan created successfully', variant: 'success' });
            setOpen(false);
            nutritionForm.reset();
            setSelectedPatient(null);
        } catch (error) {
            toast({ title: 'Failed to create nutrition plan', variant: 'destructive' });
        }
    };

    const onExerciseSubmit = async (values: z.infer<typeof exerciseSchema>) => {
        try {
            await createExercisePrescription.mutateAsync({
                ...values,
                startDate: values.startDate.toISOString(),
                exercises: [], // In a real app, we'd add fields for specific exercises
            });
            toast({ title: 'Exercise prescription created successfully', variant: 'success' });
            setOpen(false);
            exerciseForm.reset();
            setSelectedPatient(null);
        } catch (error) {
            toast({ title: 'Failed to create exercise prescription', variant: 'destructive' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>New Lifestyle Plan</DialogTitle>
                    <DialogDescription>Create a nutrition plan or exercise prescription for a patient.</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="nutrition">Nutrition Plan</TabsTrigger>
                        <TabsTrigger value="exercise">Exercise Prescription</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nutrition">
                        <Form {...nutritionForm}>
                            <form onSubmit={nutritionForm.handleSubmit(onNutritionSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={nutritionForm.control}
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
                                                    exerciseForm.setValue('patientId', patient.id);
                                                }}
                                                onClear={() => {
                                                    setSelectedPatient(null);
                                                    field.onChange('');
                                                }}
                                                error={nutritionForm.formState.errors.patientId?.message}
                                            />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={nutritionForm.control}
                                        name="planName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Plan Name</FormLabel>
                                                <FormControl><Input placeholder="e.g. Keto Diet" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={nutritionForm.control}
                                        name="planType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Plan Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                                        <SelectItem value="therapeutic">Therapeutic</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={nutritionForm.control}
                                        name="targetCalories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Calories</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={nutritionForm.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col justify-end">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={nutritionForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl><Textarea className="resize-none" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit" disabled={createNutritionPlan.isPending}>
                                        {createNutritionPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Nutrition Plan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="exercise">
                        <Form {...exerciseForm}>
                            <form onSubmit={exerciseForm.handleSubmit(onExerciseSubmit)} className="space-y-4 py-4">
                                {/* Patient Selection already handled link */}
                                <div className="p-2 border rounded-md text-sm mb-4">
                                    {selectedPatient ? (
                                        <div className="flex justify-between items-center">
                                            <span>Selected: <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong></span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic">No patient selected. Please select in Nutrition tab.</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={exerciseForm.control}
                                        name="prescriptionName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prescription Name</FormLabel>
                                                <FormControl><Input placeholder="e.g. Cardio Routine" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={exerciseForm.control}
                                        name="goal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Goal</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                                        <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                                                        <SelectItem value="strength">Strength</SelectItem>
                                                        <SelectItem value="flexibility">Flexibility</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={exerciseForm.control}
                                        name="sessionsPerWeek"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sessions per Week</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={exerciseForm.control}
                                        name="minutesPerSession"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Minutes per Session</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={exerciseForm.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={exerciseForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl><Textarea className="resize-none" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit" disabled={createExercisePrescription.isPending}>
                                        {createExercisePrescription.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Prescription
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
