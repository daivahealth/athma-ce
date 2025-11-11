'use client';

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ClinicalNotesForm } from '@/modules/clinical/components/charting/clinical-notes-form';
import { DiagnosisForm } from '@/modules/clinical/components/charting/diagnosis-form';
// Import other forms...

export default function ChartingPage() {
  const params = useParams();
  const encounterId = params.id as string;

  // You'll need to get these from context/props
  const patientId = 'patient-id'; // Get from encounter or context
  const currentStaffId = 'staff-id'; // Get from auth context

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Clinical Charting</h1>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card className="p-6">
            <ClinicalNotesForm
              encounterId={encounterId}
              patientId={patientId}
              authorStaffId={currentStaffId}
            />
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses">
          <Card className="p-6">
            <DiagnosisForm
              encounterId={encounterId}
              patientId={patientId}
              addedBy={currentStaffId}
            />
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="p-6">
            {/* Clinical Orders Form */}
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="p-6">
            {/* Prescriptions Form */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}