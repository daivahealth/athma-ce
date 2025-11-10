'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLabTest } from '@/modules/foundation/hooks/use-catalogs';

export default function LabTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const labTestId = params.id as string;
  const locale = params.locale as string;

  const { data: labTest, isLoading, error } = useLabTest(labTestId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !labTest) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading lab test details
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${locale}/catalogs/lab-tests`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{labTest.testName}</h1>
            {labTest.testCategory && (
              <p className="text-muted-foreground">{labTest.testCategory}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={labTest.isActive ? 'default' : 'secondary'}>
            {labTest.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {labTest.fastingRequired && (
            <Badge variant="outline">Fasting Required</Badge>
          )}
          {labTest.turnaroundTimeHours && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              TAT: {labTest.turnaroundTimeHours}h
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Deactivate
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Name</label>
              <p className="text-base">{labTest.testName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Category</label>
              <p className="text-base">{labTest.testCategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Test Subcategory</label>
              <p className="text-base">{labTest.testSubcategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Methodology</label>
              <p className="text-base">{labTest.methodology || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coding Information */}
      <Card>
        <CardHeader>
          <CardTitle>Coding Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">LOINC Code</label>
              <p className="text-base font-mono">{labTest.loincCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPT Code</label>
              <p className="text-base font-mono">{labTest.cptCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Local Code</label>
              <p className="text-base font-mono">{labTest.localCode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specimen & Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Specimen & Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Specimen Type</label>
              <p className="text-base">{labTest.specimenType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Collection Method</label>
              <p className="text-base">{labTest.collectionMethod || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fasting Required</label>
              <p className="text-base">{labTest.fastingRequired ? 'Yes' : 'No'}</p>
            </div>
            {labTest.fastingRequired && labTest.fastingDurationHours && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fasting Duration</label>
                <p className="text-base">{labTest.fastingDurationHours} hours</p>
              </div>
            )}
          </div>
          {labTest.preparationInstructions && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preparation Instructions</label>
                <p className="text-base mt-2">{labTest.preparationInstructions}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Normal Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Normal Ranges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {labTest.units && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Units</label>
                <p className="text-base">{labTest.units}</p>
              </div>
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Male)</label>
              <p className="text-base">{labTest.normalRangeMale || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Female)</label>
              <p className="text-base">{labTest.normalRangeFemale || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Normal Range (Pediatric)</label>
              <p className="text-base">{labTest.normalRangePediatric || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Turnaround & Reference Lab */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Turnaround Time</label>
              <p className="text-base">{labTest.turnaroundTimeHours ? `${labTest.turnaroundTimeHours} hours` : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reference Lab</label>
              <p className="text-base">{labTest.referenceLab || 'In-house'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(labTest.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-base">{new Date(labTest.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
