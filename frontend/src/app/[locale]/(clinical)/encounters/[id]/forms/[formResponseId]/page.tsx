'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { JsonFormsRenderer } from '@openmedform/react-form-renderer/jsonforms';
import type { JsonFormsFormDefinition } from '@openmedform/form-schema-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';
import { useFormResponse, useSaveFormResponse } from '@/modules/clinical/hooks/use-form-master';
import { FormResponseStatus } from '@/modules/clinical/types/form-master';

export default function FillFormPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const locale = (params.locale as string) ?? 'en';
  const encounterId = params.id as string;
  const formResponseId = params.formResponseId as string;

  const { data: response, isLoading } = useFormResponse(formResponseId);
  const saveFormResponse = useSaveFormResponse();

  const [data, setData] = useState<Record<string, unknown>>({});
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [validationMode, setValidationMode] = useState<'ValidateAndShow' | 'ValidateAndHide'>('ValidateAndHide');
  const [isValid, setIsValid] = useState(true);

  if (response && !hasLoadedInitialData) {
    setData(response.data ?? {});
    setHasLoadedInitialData(true);
  }

  const definition: JsonFormsFormDefinition | null = useMemo(() => {
    const bundle = response?.formMaster?.bundle;
    if (!bundle) return null;
    return {
      id: response!.formMasterId,
      formCode: bundle.formCode,
      name: bundle.name,
      version: bundle.version,
      language: (bundle.language ?? 'en') as JsonFormsFormDefinition['language'],
      status: 'PUBLISHED',
      audit: {
        createdAt: response!.createdAt,
        createdBy: response!.createdBy,
        updatedAt: response!.updatedAt,
        updatedBy: response!.createdBy,
      },
      engine: 'jsonforms',
      dataSchema: bundle.dataSchema,
      uiSchema: bundle.uiSchema,
      printSchema: bundle.printSchema ?? {},
      translations: bundle.translations ?? {},
      assets: bundle.assets ?? [],
    } as unknown as JsonFormsFormDefinition;
  }, [response]);

  const isReadOnly = response?.status === FormResponseStatus.FINAL;

  const handleChange = (next: Record<string, unknown>, errors?: unknown[]) => {
    setData(next);
    setIsValid(!errors || errors.length === 0);
  };

  const handleSaveDraft = async () => {
    try {
      await saveFormResponse.mutateAsync({
        id: formResponseId,
        encounterId,
        payload: { data, status: FormResponseStatus.DRAFT },
      });
      toast({ title: 'Draft saved' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to save draft',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setValidationMode('ValidateAndShow');
      toast({
        variant: 'destructive',
        title: 'Form incomplete',
        description: 'Please fix the highlighted fields before submitting.',
      });
      return;
    }
    try {
      await saveFormResponse.mutateAsync({
        id: formResponseId,
        encounterId,
        payload: { data, status: FormResponseStatus.FINAL },
      });
      toast({ title: 'Form submitted', description: 'The response has been recorded.' });
      router.push(`/${locale}/encounters/${encounterId}/charting`);
    } catch (error) {
      setValidationMode('ValidateAndShow');
      toast({
        variant: 'destructive',
        title: 'Unable to submit form',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading form..." />
      </div>
    );
  }

  if (!response || !definition) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">Form not found</p>
        <p className="text-sm text-muted-foreground">Please return to the encounter and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/${locale}/encounters/${encounterId}/charting`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{definition.name}</h1>
          <p className="text-sm text-muted-foreground">
            v{definition.version} · {response.formCode}
          </p>
        </div>
        <Badge variant={response.status === FormResponseStatus.FINAL ? 'default' : 'secondary'} className="capitalize">
          {response.status.toLowerCase()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>
            {isReadOnly ? 'This form has been submitted as final.' : 'Fill the fields below and save your progress at any time.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JsonFormsRenderer
            definition={definition}
            data={data}
            readOnly={isReadOnly}
            onChange={handleChange}
            validationMode={validationMode}
          />
        </CardContent>
      </Card>

      {!isReadOnly && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={saveFormResponse.isPending} onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button disabled={saveFormResponse.isPending} onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
      )}

    </div>
  );
}
