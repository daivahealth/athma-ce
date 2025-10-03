"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(getStatusColor(status), className)}
    >
      {status}
    </Badge>
  );
}



