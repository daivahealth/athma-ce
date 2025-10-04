"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Manage payments and remittances"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Payment
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Payments Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Payment management features coming soon. This will include payment posting,
            ERA/EP remittance processing, and payment reconciliation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}





