'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Vitals, UpdateVitalsInput } from '../types/vitals';
import { vitalsService } from '../services/vitals-service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Activity, Heart, Wind, Droplet, Weight, Ruler, Thermometer } from 'lucide-react';

const vitalsSchema = z.object({
  temperature: z.number().min(30).max(45).optional().or(z.literal('')),
  temperatureUnit: z.enum(['celsius', 'fahrenheit']).optional(),
  systolicBP: z.number().min(50).max(250).optional().or(z.literal('')),
  diastolicBP: z.number().min(30).max(150).optional().or(z.literal('')),
  heartRate: z.number().min(30).max(250).optional().or(z.literal('')),
  respiratoryRate: z.number().min(5).max(60).optional().or(z.literal('')),
  oxygenSaturation: z.number().min(70).max(100).optional().or(z.literal('')),
  weight: z.number().min(0.5).max(500).optional().or(z.literal('')),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  height: z.number().min(30).max(250).optional().or(z.literal('')),
  heightUnit: z.enum(['cm', 'in']).optional(),
  bmi: z.number().min(10).max(60).optional().or(z.literal('')),
  painScale: z.number().min(0).max(10).optional().or(z.literal('')),
  bloodGlucose: z.number().min(20).max(600).optional().or(z.literal('')),
  bloodGlucoseUnit: z.enum(['mg/dL', 'mmol/L']).optional(),
  headCircumference: z.number().min(20).max(70).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  encounterId: string;
  initialData?: Vitals;
  onSuccess?: () => void;
}

export function VitalsForm({ encounterId, initialData, onSuccess }: VitalsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperature: initialData?.temperature || ('' as any),
      temperatureUnit: initialData?.temperatureUnit || 'celsius',
      systolicBP: initialData?.systolicBP || ('' as any),
      diastolicBP: initialData?.diastolicBP || ('' as any),
      heartRate: initialData?.heartRate || ('' as any),
      respiratoryRate: initialData?.respiratoryRate || ('' as any),
      oxygenSaturation: initialData?.oxygenSaturation || ('' as any),
      weight: initialData?.weight || ('' as any),
      weightUnit: initialData?.weightUnit || 'kg',
      height: initialData?.height || ('' as any),
      heightUnit: initialData?.heightUnit || 'cm',
      bmi: initialData?.bmi || ('' as any),
      painScale: initialData?.painScale || ('' as any),
      bloodGlucose: initialData?.bloodGlucose || ('' as any),
      bloodGlucoseUnit: initialData?.bloodGlucoseUnit || 'mg/dL',
      headCircumference: initialData?.headCircumference || ('' as any),
      notes: initialData?.notes || '',
    },
  });

  const updateVitalsMutation = useMutation({
    mutationFn: (data: UpdateVitalsInput) => vitalsService.updateVitals(encounterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals', encounterId] });
      queryClient.invalidateQueries({ queryKey: ['encounter', encounterId] });
      toast({
        title: 'Success',
        description: 'Vitals updated successfully',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update vitals',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: VitalsFormValues) => {
    // Convert empty strings to undefined
    const cleanedData: UpdateVitalsInput = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        (cleanedData as any)[key] = value;
      }
    });

    updateVitalsMutation.mutate(cleanedData);
  };

  // Auto-calculate BMI when weight and height change
  const calculateBMI = () => {
    const weight = form.watch('weight');
    const height = form.watch('height');
    const weightUnit = form.watch('weightUnit');
    const heightUnit = form.watch('heightUnit');

    if (weight && height && weight !== ('' as any) && height !== ('' as any)) {
      let weightKg = typeof weight === 'number' ? weight : parseFloat(weight);
      let heightM = typeof height === 'number' ? height : parseFloat(height);

      // Convert to metric
      if (weightUnit === 'lbs') {
        weightKg = weightKg * 0.453592;
      }
      if (heightUnit === 'in') {
        heightM = heightM * 0.0254;
      } else {
        heightM = heightM / 100; // cm to m
      }

      const bmi = weightKg / (heightM * heightM);
      form.setValue('bmi', parseFloat(bmi.toFixed(1)));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Temperature */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Temperature</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="temperature">Value</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="37.0"
                {...form.register('temperature', { valueAsNumber: true })}
              />
              {form.formState.errors.temperature && (
                <p className="text-sm text-red-500">{form.formState.errors.temperature.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="temperatureUnit">Unit</Label>
              <Select
                value={form.watch('temperatureUnit')}
                onValueChange={(value) => form.setValue('temperatureUnit', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Blood Pressure</CardTitle>
            </div>
            <CardDescription>Systolic/Diastolic (mmHg)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="systolicBP">Systolic</Label>
              <Input
                id="systolicBP"
                type="number"
                placeholder="120"
                {...form.register('systolicBP', { valueAsNumber: true })}
              />
              {form.formState.errors.systolicBP && (
                <p className="text-sm text-red-500">{form.formState.errors.systolicBP.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="diastolicBP">Diastolic</Label>
              <Input
                id="diastolicBP"
                type="number"
                placeholder="80"
                {...form.register('diastolicBP', { valueAsNumber: true })}
              />
              {form.formState.errors.diastolicBP && (
                <p className="text-sm text-red-500">{form.formState.errors.diastolicBP.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Heart Rate</CardTitle>
            </div>
            <CardDescription>Beats per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="heartRate"
              type="number"
              placeholder="72"
              {...form.register('heartRate', { valueAsNumber: true })}
            />
            {form.formState.errors.heartRate && (
              <p className="text-sm text-red-500">{form.formState.errors.heartRate.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Respiratory Rate */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Respiratory Rate</CardTitle>
            </div>
            <CardDescription>Breaths per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="respiratoryRate"
              type="number"
              placeholder="16"
              {...form.register('respiratoryRate', { valueAsNumber: true })}
            />
            {form.formState.errors.respiratoryRate && (
              <p className="text-sm text-red-500">{form.formState.errors.respiratoryRate.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Oxygen Saturation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Oxygen Saturation</CardTitle>
            </div>
            <CardDescription>SpO2 %</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="oxygenSaturation"
              type="number"
              placeholder="98"
              {...form.register('oxygenSaturation', { valueAsNumber: true })}
            />
            {form.formState.errors.oxygenSaturation && (
              <p className="text-sm text-red-500">{form.formState.errors.oxygenSaturation.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Weight */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Weight</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="weight">Value</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                {...form.register('weight', { valueAsNumber: true })}
                onBlur={calculateBMI}
              />
              {form.formState.errors.weight && (
                <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="weightUnit">Unit</Label>
              <Select
                value={form.watch('weightUnit')}
                onValueChange={(value) => {
                  form.setValue('weightUnit', value as any);
                  calculateBMI();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Height */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Height</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="height">Value</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="175"
                {...form.register('height', { valueAsNumber: true })}
                onBlur={calculateBMI}
              />
              {form.formState.errors.height && (
                <p className="text-sm text-red-500">{form.formState.errors.height.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="heightUnit">Unit</Label>
              <Select
                value={form.watch('heightUnit')}
                onValueChange={(value) => {
                  form.setValue('heightUnit', value as any);
                  calculateBMI();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="in">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* BMI */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">BMI</CardTitle>
            <CardDescription>Body Mass Index</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              placeholder="23.0"
              {...form.register('bmi', { valueAsNumber: true })}
              readOnly
              className="bg-muted"
            />
          </CardContent>
        </Card>

        {/* Pain Scale */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pain Scale</CardTitle>
            <CardDescription>0 (No pain) - 10 (Worst pain)</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="painScale"
              type="number"
              min="0"
              max="10"
              placeholder="0"
              {...form.register('painScale', { valueAsNumber: true })}
            />
            {form.formState.errors.painScale && (
              <p className="text-sm text-red-500">{form.formState.errors.painScale.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Blood Glucose */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Blood Glucose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="bloodGlucose">Value</Label>
              <Input
                id="bloodGlucose"
                type="number"
                step="0.1"
                placeholder="95"
                {...form.register('bloodGlucose', { valueAsNumber: true })}
              />
              {form.formState.errors.bloodGlucose && (
                <p className="text-sm text-red-500">{form.formState.errors.bloodGlucose.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="bloodGlucoseUnit">Unit</Label>
              <Select
                value={form.watch('bloodGlucoseUnit')}
                onValueChange={(value) => form.setValue('bloodGlucoseUnit', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">mg/dL</SelectItem>
                  <SelectItem value="mmol/L">mmol/L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Head Circumference (Pediatric) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Head Circumference</CardTitle>
            <CardDescription>Pediatric measurement (cm)</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="headCircumference"
              type="number"
              step="0.1"
              placeholder="50"
              {...form.register('headCircumference', { valueAsNumber: true })}
            />
            {form.formState.errors.headCircumference && (
              <p className="text-sm text-red-500">{form.formState.errors.headCircumference.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
          <CardDescription>Additional vitals observations</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Enter any additional notes about vitals..."
            rows={3}
            {...form.register('notes')}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={updateVitalsMutation.isPending}>
          {updateVitalsMutation.isPending ? 'Saving...' : 'Save Vitals'}
        </Button>
      </div>
    </form>
  );
}
