'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Loader2, Info } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useCreateMembershipPlan } from '@/modules/wellness/hooks/use-membership';

const benefitSchema = z.object({
    name: z.string().min(1, 'Benefit name is required'),
    description: z.string().optional(),
    value: z.string().optional(),
    included: z.boolean().default(true),
});

const formSchema = z.object({
    name: z.string().min(1, 'Plan name is required'),
    code: z.string().min(1, 'Plan code is required'),
    description: z.string().optional(),
    tier: z.string().min(1, 'Tier is required'),
    monthlyPrice: z.coerce.number().min(0),
    yearlyPrice: z.coerce.number().min(0),
    currency: z.string().default('USD'),
    benefits: z.array(benefitSchema).min(1, 'At least one benefit is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function MembershipPlanDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const createPlan = useCreateMembershipPlan();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            tier: 'standard',
            monthlyPrice: 0,
            yearlyPrice: 0,
            currency: 'USD',
            benefits: [{ name: 'Basic Monitoring', included: true }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'benefits',
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await createPlan.mutateAsync(values);
            toast({ title: 'Membership plan created successfully', variant: 'success' });
            setOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: 'Failed to create membership plan', variant: 'destructive' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Membership Plan</DialogTitle>
                    <DialogDescription>
                        Define a new membership tier, pricing, and benefits.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Name</FormLabel>
                                        <FormControl><Input placeholder="e.g. Platinum Health" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Code</FormLabel>
                                        <FormControl><Input placeholder="e.g. PLAT_V1" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tier</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="basic">Basic</SelectItem>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                            <SelectItem value="platinum">Platinum</SelectItem>
                                            <SelectItem value="vip">VIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="monthlyPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Price</FormLabel>
                                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="yearlyPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Yearly Price</FormLabel>
                                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl><Input {...field} readOnly /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea className="resize-none" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Benefits</div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: '', included: true })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Benefit
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start border p-3 rounded-md bg-muted/30">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`benefits.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl><Input placeholder="Benefit Name" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`benefits.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/3">
                                                            <FormControl><Input placeholder="Value (e.g. 5 sessions)" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`benefits.${index}.included`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onChange={(e) => field.onChange(e.target.checked)}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal text-xs">Included in plan</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive h-8 w-8"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={createPlan.isPending}>
                                {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Membership Plan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
