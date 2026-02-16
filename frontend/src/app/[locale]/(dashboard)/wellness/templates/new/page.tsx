'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { CreateTemplateForm } from '../_components/create-template-form';

function NewTemplatePageContent({ params }: { params: { locale: string } }) {
    const t = useTranslations();

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Template</h1>
                <p className="text-muted-foreground">
                    Design a new wellness assessment template with custom sections and questions.
                </p>
            </div>

            <CreateTemplateForm locale={params.locale} />
        </div>
    );
}

export default function NewAssessmentTemplatePage({ params }: { params: { locale: string } }) {
    return (
        <Suspense fallback={null}>
            <NewTemplatePageContent params={params} />
        </Suspense>
    );
}
