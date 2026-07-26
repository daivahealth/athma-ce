'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { JsonFormsRenderer } from '@openmedform/react-form-renderer/jsonforms';
import type { JsonFormsFormDefinition } from '@openmedform/form-schema-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useFormMaster } from '@/modules/clinical/hooks/use-form-master';
import { FrequencyType, FrequencyUnit } from '@/modules/clinical/types/form-master';

const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  [FrequencyType.EVERY_N_HOURS]: 'Every {n} hours',
  [FrequencyType.EVERY_N_DAYS]: 'Every {n} days',
  [FrequencyType.DAILY]: 'Daily',
  [FrequencyType.WEEKLY]: 'Weekly',
  [FrequencyType.ONCE_PER_SHIFT]: 'Once per shift',
  [FrequencyType.ONCE_PER_ADMISSION]: 'Once per admission',
  [FrequencyType.ONCE_PER_EPISODE]: 'Once per episode',
  [FrequencyType.ON_DEMAND]: 'Fill whenever needed',
  [FrequencyType.EVENT_BASED]: 'Trigger after an event',
};

function formatFrequency(type: FrequencyType, value?: number | null, unit?: FrequencyUnit | null): string {
  const label = FREQUENCY_LABELS[type] ?? type;
  if ((type === FrequencyType.EVERY_N_HOURS || type === FrequencyType.EVERY_N_DAYS) && value != null && unit) {
    return `Every ${value} ${unit.toLowerCase()}${value === 1 ? '' : 's'}`;
  }
  return label;
}

export default function FormMasterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) ?? 'en';
  const id = params.id as string;

  const { data: formMaster, isLoading, error } = useFormMaster(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading form..." />
      </div>
    );
  }

  if (error || !formMaster || !formMaster.bundle) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">Form not found</p>
        <p className="text-sm text-muted-foreground">Please return to Form Master and try again.</p>
      </div>
    );
  }

  const bundle = formMaster.bundle;

  const definition = {
    id: formMaster.id,
    formCode: bundle.formCode,
    name: bundle.name,
    version: bundle.version,
    language: (bundle.language ?? 'en') as JsonFormsFormDefinition['language'],
    status: 'PUBLISHED',
    audit: {
      createdAt: formMaster.createdAt,
      createdBy: formMaster.uploadedBy,
      updatedAt: formMaster.updatedAt,
      updatedBy: formMaster.uploadedBy,
    },
    engine: 'jsonforms',
    dataSchema: bundle.dataSchema,
    uiSchema: bundle.uiSchema,
    printSchema: bundle.printSchema ?? {},
    translations: bundle.translations ?? {},
    assets: bundle.assets ?? [],
  } as unknown as JsonFormsFormDefinition;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/${locale}/catalogs/form-master`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{formMaster.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formMaster.formCode} · v{formMaster.formVersion} · {formMaster.engine}
          </p>
        </div>
        <Badge variant={formMaster.status === 'ACTIVE' ? 'default' : 'secondary'} className="capitalize">
          {formMaster.status.toLowerCase()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-sm font-medium">
              {formatFrequency(formMaster.frequencyType, formMaster.frequencyValue, formMaster.frequencyUnit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="text-sm font-medium">{formMaster.language ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uploaded</p>
            <p className="text-sm font-medium">{new Date(formMaster.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
          <CardDescription>
            Read-only preview of the fields exactly as clinicians will see them when filling this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JsonFormsRenderer definition={definition} data={{}} readOnly validationMode="NoValidation" />
        </CardContent>
      </Card>
    </div>
  );
}
