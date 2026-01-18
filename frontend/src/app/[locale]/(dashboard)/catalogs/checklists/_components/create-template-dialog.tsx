'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChecklistCategory, ChecklistTemplateStatus } from '@/modules/clinical/types/checklist';
import { useCreateChecklistTemplate } from '@/modules/clinical/hooks/use-checklists';

const formSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').max(50),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    category: z.nativeEnum(ChecklistCategory),
});

interface CreateTemplateDialogProps {
    children?: React.ReactNode;
}

export function CreateTemplateDialog({ children }: CreateTemplateDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const createTemplate = useCreateChecklistTemplate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            name: '',
            description: '',
            category: ChecklistCategory.DISCHARGE,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        createTemplate.mutate(
            {
                ...values,
                status: ChecklistTemplateStatus.DRAFT,
                requiresVerification: true, // Default to true for now
                autoCreateEnabled: false,
                items: [],
            },
            {
                onSuccess: (data) => {
                    setOpen(false);
                    form.reset();
                    // Redirect to the new template's detail page
                    // Assuming locale is available in the URL or context, but here we can't easily access it without params.
                    // We can use window.location or just refresh the list. 
                    // Better: just push to the new ID.
                    // Note: In the page component we have the locale.
                    // For now, let's just close the dialog and maybe refresh functionality will handle list update.
                    // Actually, let's redirect.
                    const locale = window.location.pathname.split('/')[1]; // Hacky but works for now if we don't pass locale
                    router.push(`/${locale}/catalogs/checklists/${data.id}`);
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>New Template</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Checklist Template</DialogTitle>
                    <DialogDescription>
                        Add a new checklist template. You can add items and configure rules after creation.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. SURGERY_PRE_OP_V1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Pre-Operative Checklist" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChecklistCategory).map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category.replace(/_/g, ' ')}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of when this checklist is used."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={createTemplate.isPending}>
                                {createTemplate.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Template
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
