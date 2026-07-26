'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreateFormMaster } from '@/modules/clinical/hooks/use-form-master';
import { FrequencyType, FrequencyUnit, type OpenMedFormBundle } from '@/modules/clinical/types/form-master';

const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: FrequencyType.EVERY_N_HOURS, label: 'Every N hours' },
  { value: FrequencyType.EVERY_N_DAYS, label: 'Every N days' },
  { value: FrequencyType.DAILY, label: 'Once daily' },
  { value: FrequencyType.WEEKLY, label: 'Weekly' },
  { value: FrequencyType.ONCE_PER_SHIFT, label: 'Once per shift' },
  { value: FrequencyType.ONCE_PER_ADMISSION, label: 'Once per admission' },
  { value: FrequencyType.ONCE_PER_EPISODE, label: 'Once per episode' },
  { value: FrequencyType.ON_DEMAND, label: 'Fill whenever needed' },
  { value: FrequencyType.EVENT_BASED, label: 'Trigger after an event' },
];

// Frequency types where a value/unit pair is meaningful (mirrors the example
// table: Every 4 hours -> EVERY_N_HOURS/4/HOUR, Once daily -> DAILY/1/DAY, etc.
// One-off types like ONCE_PER_SHIFT have no value/unit.
const VALUE_UNIT_TYPES = new Set([FrequencyType.EVERY_N_HOURS, FrequencyType.EVERY_N_DAYS]);
const FIXED_VALUE_UNIT: Partial<Record<FrequencyType, { value: number; unit: FrequencyUnit }>> = {
  [FrequencyType.DAILY]: { value: 1, unit: FrequencyUnit.DAY },
  [FrequencyType.WEEKLY]: { value: 1, unit: FrequencyUnit.WEEK },
};

export default function UploadFormMasterPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawJson, setRawJson] = useState('');
  const [parsedBundle, setParsedBundle] = useState<OpenMedFormBundle | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(FrequencyType.DAILY);
  const [frequencyValue, setFrequencyValue] = useState<string>('1');
  const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>(FrequencyUnit.DAY);

  const createFormMaster = useCreateFormMaster();

  const parseBundle = (text: string) => {
    setRawJson(text);
    if (!text.trim()) {
      setParsedBundle(null);
      setParseError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (!parsed.formCode || !parsed.version || !parsed.dataSchema || !parsed.uiSchema) {
        setParsedBundle(null);
        setParseError(
          'This does not look like an OpenMedForm export bundle — expected formCode, version, dataSchema, and uiSchema.'
        );
        return;
      }
      setParsedBundle(parsed);
      setParseError(null);
    } catch {
      setParsedBundle(null);
      setParseError('Invalid JSON.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    parseBundle(text);
  };

  const needsValueUnit = VALUE_UNIT_TYPES.has(frequencyType);

  const handleSubmit = async () => {
    if (!parsedBundle) return;

    const fixed = FIXED_VALUE_UNIT[frequencyType];
    const payload = {
      bundle: parsedBundle,
      frequencyType,
      ...(needsValueUnit
        ? { frequencyValue: Number(frequencyValue) || undefined, frequencyUnit }
        : fixed
          ? { frequencyValue: fixed.value, frequencyUnit: fixed.unit }
          : {}),
    };

    try {
      await createFormMaster.mutateAsync(payload);
      toast({ title: 'Form uploaded', description: `${parsedBundle.name} is now available for clinicians to fill.` });
      router.push(`/${params.locale}/catalogs/form-master`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to upload form',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.locale}/catalogs/form-master`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Form</h1>
          <p className="text-muted-foreground">
            Paste or upload the JSON bundle exported from OpenMedForm.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form definition</CardTitle>
          <CardDescription>
            Download the form from OpenMedForm (Forms → your form → Download), then paste its JSON here or choose the file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Choose JSON file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <Textarea
            value={rawJson}
            onChange={(e) => parseBundle(e.target.value)}
            placeholder="Paste the OpenMedForm export JSON here..."
            className="min-h-[220px] font-mono text-xs"
          />

          {parseError && <p className="text-sm text-destructive">{parseError}</p>}

          {parsedBundle && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium text-foreground">{parsedBundle.name}</p>
                <p className="text-muted-foreground">
                  formCode: <span className="font-mono">{parsedBundle.formCode}</span> · version{' '}
                  {parsedBundle.version} · engine {parsedBundle.engine}
                  {parsedBundle.language ? ` · ${parsedBundle.language}` : ''}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequency</CardTitle>
          <CardDescription>How often should this form be filled?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Frequency type</Label>
              <Select value={frequencyType} onValueChange={(v) => setFrequencyType(v as FrequencyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsValueUnit && (
              <>
                <div className="space-y-1.5">
                  <Label>Every</Label>
                  <Input
                    type="number"
                    min={1}
                    value={frequencyValue}
                    onChange={(e) => setFrequencyValue(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit</Label>
                  <Select value={frequencyUnit} onValueChange={(v) => setFrequencyUnit(v as FrequencyUnit)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FrequencyUnit.HOUR}>Hour</SelectItem>
                      <SelectItem value={FrequencyUnit.DAY}>Day</SelectItem>
                      <SelectItem value={FrequencyUnit.WEEK}>Week</SelectItem>
                      <SelectItem value={FrequencyUnit.MONTH}>Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push(`/${params.locale}/catalogs/form-master`)}>
          Cancel
        </Button>
        <Button disabled={!parsedBundle || createFormMaster.isPending} onClick={handleSubmit}>
          {createFormMaster.isPending ? 'Uploading...' : 'Upload Form'}
        </Button>
      </div>
    </div>
  );
}
