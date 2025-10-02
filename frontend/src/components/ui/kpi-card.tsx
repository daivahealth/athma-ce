"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ title, value, change, icon, className }: KPICardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span
              className={cn(
                "font-medium",
                change.trend === "up" && "text-green-600 dark:text-green-400",
                change.trend === "down" && "text-red-600 dark:text-red-400",
                change.trend === "neutral" && "text-muted-foreground"
              )}
            >
              {change.trend === "up" && "+"}
              {change.value}%
            </span>{" "}
            {change.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
