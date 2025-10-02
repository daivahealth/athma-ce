"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal } from "lucide-react";
// import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/app-shell/page-header";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { realApi } from "@/lib/query";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Claim {
  id: string;
  claimNumber: string;
  patientName: string;
  payer: string;
  amount: number;
  status: string;
  dateOfService: string;
}

export default function ClaimsPage() {
  // const t = useTranslations("claims");
  const { data, isLoading } = useQuery({
    queryKey: ["claims"],
    queryFn: realApi.getClaims,
  });

  const columns: ColumnDef<Claim>[] = [
    {
      accessorKey: "claimNumber",
      header: "Claim Number",
    },
    {
      accessorKey: "patientName",
      header: "Patient",
    },
    {
      accessorKey: "payer",
      header: "Payer",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return formatCurrency(amount);
      },
    },
    {
      accessorKey: "dateOfService",
      header: "Date of Service",
      cell: ({ row }) => {
        const date = row.getValue("dateOfService") as string;
        return formatDate(date);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const claim = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit claim</DropdownMenuItem>
              <DropdownMenuItem>Submit claim</DropdownMenuItem>
              <DropdownMenuItem>View timeline</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete claim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        subtitle="Manage insurance claims and submissions"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="claimNumber"
        searchPlaceholder="Search claims..."
      />
    </div>
  );
}
