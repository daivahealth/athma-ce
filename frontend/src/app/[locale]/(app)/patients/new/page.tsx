"use client";

import { useRouter } from "next/navigation";
import { NewPatientForm } from "@/components/forms/new-patient-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewPatientPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/patients");
  };

  const handleCancel = () => {
    router.push("/patients");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/patients")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Patient</h1>
          <p className="text-muted-foreground">
            Create a new patient record in the system
          </p>
        </div>
      </div>

      {/* Form */}
      <NewPatientForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}



