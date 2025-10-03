"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal } from "lucide-react";

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
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  emiratesId?: string;
  nationality?: string;
  city?: string;
  emirate?: string;
}

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return formatDate(date);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

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
            <DropdownMenuItem>Edit patient</DropdownMenuItem>
            <DropdownMenuItem>Schedule appointment</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PatientsPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: realApi.getPatients,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        subtitle="Manage patient records"
        actions={
          <Button onClick={() => router.push("/patients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="firstName"
        searchPlaceholder="Search patients..."
      />
    </div>
  );
}
