"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, Calendar, AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { realApi } from "@/lib/query";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: realApi.getDashboardKPIs,
  });

  const quickActions = [
    { label: "New Patient", href: "/patients", icon: Users },
    { label: "New Appointment", href: "/appointments", icon: Calendar },
    { label: "New Claim", href: "/claims", icon: DollarSign },
    { label: "View Reports", href: "/reports", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your practice management"
      />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Admissions"
          value={kpis?.admissions || 0}
          change={{
            value: 12,
            label: "from last month",
            trend: "up",
          }}
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Collections"
          value={formatCurrency(kpis?.collections || 0)}
          change={{
            value: 8,
            label: "from last month",
            trend: "up",
          }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="AR Days"
          value={kpis?.arDays || 0}
          change={{
            value: -5,
            label: "from last month",
            trend: "down",
          }}
          icon={<Calendar className="h-4 w-4" />}
        />
        <KPICard
          title="Denial Rate"
          value={`${kpis?.denialRate || 0}%`}
          change={{
            value: -2,
            label: "from last month",
            trend: "down",
          }}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  asChild
                >
                  <a href={action.href}>
                    <Icon className="h-6 w-6" />
                    <span>{action.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No recent appointments</p>
                <p className="text-xs">Appointments will appear here when available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No recent claims</p>
                <p className="text-xs">Claims will appear here when available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
