'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus } from 'lucide-react';

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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChecklistItemType } from '@/modules/clinical/types/checklist';
import { useAddChecklistTemplateItem } from '@/modules/clinical/hooks/use-checklists';

const formSchema = z.object({
    label: z.string().min(3, 'Label must be at least 3 characters'),
    itemKey: z.string().min(3, 'Key must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Key must be lowercase alphanumeric with underscores'),
    itemType: z.nativeEnum(ChecklistItemType),
    sectionName: z.string().optional(),
    helpText: z.string().optional(),
    isRequired: z.boolean().default(false),
});

interface AddItemDialogProps {
    templateId: string;
}

export function AddItemDialog({ templateId }: AddItemDialogProps) {
    const [open, setOpen] = useState(false);
    const addItem = useAddChecklistTemplateItem(templateId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: '',
            itemKey: '',
            itemType: ChecklistItemType.BOOLEAN,
            sectionName: '',
            helpText: '',
            isRequired: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        addItem.mutate(
            values,
            {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Checklist Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to this checklist template.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Verify patient ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="itemKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. patient_id_verified" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Unique key for this item.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="itemType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChecklistItemType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.replace(/_/g, ' ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sectionName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Preparation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="helpText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Help Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Optional help text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isRequired"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm col-span-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Required
                                            </FormLabel>
                                            <FormDescription>
                                                This item must be completed before the checklist can be submitted.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={addItem.isPending}>
                                {addItem.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Item
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
