'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCreateAssessmentTemplate } from '@/modules/wellness/hooks/use-wellness-assessments';

// Validation Schema
const questionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z.enum(['text', 'number', 'select', 'multiselect', 'scale', 'boolean']),
    optionsString: z.string().optional(), // Helper for comma-separated options input
    scaleMin: z.coerce.number().optional(),
    scaleMax: z.coerce.number().optional(),
    required: z.boolean().default(false),
    weight: z.coerce.number().optional(),
});

const sectionSchema = z.object({
    sectionName: z.string().min(1, 'Section name is required'),
    sectionOrder: z.number(),
    questions: z.array(questionSchema),
});

const templateFormSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    code: z.string().min(1, 'Template code is required').regex(/^[a-zA-Z0-9_-]+$/, 'Code must be alphanumeric'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    sections: z.array(sectionSchema),
    maxScore: z.coerce.number().optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export function CreateTemplateForm({ locale }: { locale: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const createTemplate = useCreateAssessmentTemplate();

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            category: 'General',
            sections: [
                {
                    sectionName: 'General Information',
                    sectionOrder: 1,
                    questions: [
                        {
                            questionText: '',
                            questionType: 'text',
                            required: true,
                        },
                    ],
                },
            ],
        },
    });

    const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
        control: form.control,
        name: 'sections',
    });

    const onSubmit = async (data: TemplateFormValues) => {
        try {
            // transform optionsString to options array
            const formattedSections = data.sections.map((section) => ({
                ...section,
                questions: section.questions.map((q) => {
                    const { optionsString, ...rest } = q;
                    const options =
                        q.questionType === 'select' || q.questionType === 'multiselect'
                            ? optionsString?.split(',').map((o) => o.trim()).filter(Boolean)
                            : undefined;

                    // Ensure types match API expectations (stripping undefined/empty values if needed)

                    return {
                        ...rest,
                        questionId: crypto.randomUUID(),
                        options,
                    };
                }),
            }));

            await createTemplate.mutateAsync({
                ...data,
                sections: formattedSections,
            });

            toast({
                title: 'Template Created',
                description: 'The assessment template has been successfully created.',
            });

            router.push(`/${locale}/wellness/templates`);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create template. Please check your input.',
            });
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push(`/${locale}/wellness/templates`)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Templates
                </Button>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/${locale}/wellness/templates`)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={createTemplate.isPending}>
                        {createTemplate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Template
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Details</CardTitle>
                            <CardDescription>Basic information about the assessment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Annual Wellness Check"
                                    {...form.register('name')}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="code">Unique Code *</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. WELLNESS_ANNUAL"
                                    {...form.register('code')}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Alphanumeric identifier for system use.
                                </p>
                                {form.formState.errors.code && (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.code.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Controller
                                    name="category"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                <SelectItem value="Mental Health">Mental Health</SelectItem>
                                                <SelectItem value="Nutrition">Nutrition</SelectItem>
                                                <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.category && (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of this assessment..."
                                    {...form.register('description')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sections and Questions */}
                <div className="md:col-span-2 space-y-6">
                    {sectionFields.map((section, index) => (
                        <SectionEditor
                            key={section.id}
                            control={form.control}
                            register={form.register}
                            sectionIndex={index}
                            removeSection={() => removeSection(index)}
                            errors={form.formState.errors}
                        />
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed py-6"
                        onClick={() =>
                            appendSection({
                                sectionName: `New Section ${sectionFields.length + 1}`,
                                sectionOrder: sectionFields.length + 1,
                                questions: [],
                            })
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                    </Button>
                </div>
            </div>
        </form>
    );
}

// Sub-component for Section Editing
function SectionEditor({
    control,
    register,
    sectionIndex,
    removeSection,
    errors,
}: {
    control: any;
    register: any;
    sectionIndex: number;
    removeSection: () => void;
    errors: any;
}) {
    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.questions`,
    });

    return (
        <Card className="relative group">
            <CardHeader className="pb-3 flex flex-row items-center gap-4 space-y-0">
                <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Section {sectionIndex + 1}
                    </Label>
                    <Input
                        className="font-semibold text-lg border-transparent px-0 hover:border-input focus:border-input focus:ring-0 h-auto py-1"
                        placeholder="Section Name"
                        {...register(`sections.${sectionIndex}.sectionName`)}
                    />
                    {errors?.sections?.[sectionIndex]?.sectionName && (
                        <p className="text-xs text-destructive">
                            {errors.sections[sectionIndex].sectionName.message}
                        </p>
                    )}
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeSection}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {questionFields.map((question, qIndex) => (
                    <div key={question.id} className="relative pl-4 border-l-2 border-muted hover:border-primary/50 transition-colors">
                        <div className="grid gap-4 sm:grid-cols-12 items-start">
                            {/* Question Text */}
                            <div className="sm:col-span-7 space-y-2">
                                <Input
                                    placeholder="Question text..."
                                    {...register(`sections.${sectionIndex}.questions.${qIndex}.questionText`)}
                                />

                                {/* Conditional Inputs based on Type */}
                                <QuestionTypeInputs
                                    control={control}
                                    register={register}
                                    sectionIndex={sectionIndex}
                                    qIndex={qIndex}
                                />
                            </div>

                            {/* Type Selection */}
                            <div className="sm:col-span-3">
                                <Controller
                                    name={`sections.${sectionIndex}.questions.${qIndex}.questionType`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text Answer</SelectItem>
                                                <SelectItem value="number">Numeric</SelectItem>
                                                <SelectItem value="boolean">Yes/No</SelectItem>
                                                <SelectItem value="select">Single Select</SelectItem>
                                                <SelectItem value="multiselect">Multi Select</SelectItem>
                                                <SelectItem value="scale">Scale (1-N)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {/* Required Toggle */}
                            <div className="sm:col-span-1 flex items-center justify-center pt-2">
                                <Controller
                                    name={`sections.${sectionIndex}.questions.${qIndex}.required`}
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex flex-col items-center gap-1">
                                            <Switch checked={field.value} onCheckedChange={field.onChange} id={`req-${sectionIndex}-${qIndex}`} />
                                            <Label htmlFor={`req-${sectionIndex}-${qIndex}`} className="text-[10px] text-muted-foreground">Req</Label>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Remove Question */}
                            <div className="sm:col-span-1 flex justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeQuestion(qIndex)}
                                >
                                    <Trash2 className="h-4 w-4 text-muted-foreground/50 hover:text-destructive" />
                                </Button>
                            </div>
                        </div>
                        {errors?.sections?.[sectionIndex]?.questions?.[qIndex]?.questionText && (
                            <p className="text-xs text-destructive mt-1">
                                {errors.sections[sectionIndex].questions[qIndex].questionText.message}
                            </p>
                        )}
                    </div>
                ))}

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() =>
                        appendQuestion({
                            questionText: '',
                            questionType: 'text',
                            required: true,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                </Button>
            </CardContent>
        </Card>
    );
}

function QuestionTypeInputs({
    control,
    register,
    sectionIndex,
    qIndex,
}: {
    control: any;
    register: any;
    sectionIndex: number;
    qIndex: number;
}) {
    const type = useWatchControl(control, `sections.${sectionIndex}.questions.${qIndex}.questionType`);

    if (type === 'select' || type === 'multiselect') {
        return (
            <Input
                className="text-sm bg-muted/50"
                placeholder="Options (comma separated), e.g. Yes, No, Maybe"
                {...register(`sections.${sectionIndex}.questions.${qIndex}.optionsString`)}
            />
        );
    }

    if (type === 'scale') {
        return (
            <div className="flex gap-2">
                <Input
                    type="number"
                    placeholder="Min (e.g. 1)"
                    className="text-sm w-24"
                    {...register(`sections.${sectionIndex}.questions.${qIndex}.scaleMin`)}
                />
                <Input
                    type="number"
                    placeholder="Max (e.g. 5)"
                    className="text-sm w-24"
                    {...register(`sections.${sectionIndex}.questions.${qIndex}.scaleMax`)}
                />
            </div>
        );
    }

    return null;
}

// Helper to watch a control value
function useWatchControl(control: any, name: string) {
    const value = useWatch({
        control,
        name,
    });
    return value;
}
