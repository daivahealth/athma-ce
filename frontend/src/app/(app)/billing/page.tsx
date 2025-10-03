"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle="Manage invoices and billing"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Billing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Billing management features coming soon. This will include invoice creation,
            payment tracking, and financial reporting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}



