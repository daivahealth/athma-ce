"use client";

import * as React from "react";
import { Download } from "lucide-react";
// import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  // const t = useTranslations("reports");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and view practice reports"
        actions={
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Revenue, collections, and financial performance reports.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Patient outcomes, treatment effectiveness, and clinical metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Resource utilization, efficiency metrics, and operational performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Audit reports, regulatory compliance, and quality assurance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
