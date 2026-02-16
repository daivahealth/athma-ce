'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, FileText, Pencil } from 'lucide-react';
import { useAssessmentTemplates } from '@/modules/wellness/hooks/use-wellness-assessments';
import type { WellnessAssessmentTemplate } from '@/modules/wellness/types/wellness-assessment';

function TemplateList({ locale }: { locale: string }) {
    const router = useRouter();
    const { data: templates, isLoading } = useAssessmentTemplates();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!templates || templates.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No templates found</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first assessment template to get started.
                    </p>
                    <Button onClick={() => router.push(`/${locale}/wellness/templates/new`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold line-clamp-1" title={template.name}>
                            {template.name}
                        </CardTitle>
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                            {template.isActive ? 'Active' : 'Draft'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
                            {template.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Code: {template.code}</span>
                            <span>{template.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{template.sections.length} Sections</span>
                            {/* <span>{template.sections.reduce((acc, s) => acc + s.questions.length, 0)} Questions</span> */}
                        </div>
                        <div className="pt-4 mt-auto">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push(`/${locale}/wellness/templates/${template.id}/edit`)}
                            >
                                <Pencil className="mr-2 h-3 w-3" />
                                Edit Template
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function AssessmentTemplatesPage({ params }: { params: { locale: string } }) {
    const t = useTranslations();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Assessment Templates</h1>
                    <p className="text-muted-foreground">
                        Manage templates for wellness assessments
                    </p>
                </div>
                <Link href={`/${params.locale}/wellness/templates/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </Link>
            </div>

            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                }
            >
                <TemplateList locale={params.locale} />
            </Suspense>
        </div>
    );
}
