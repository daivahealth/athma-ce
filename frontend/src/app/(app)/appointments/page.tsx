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
import { formatDateTime } from "@/lib/utils";

interface Appointment {
  id: string;
  patient_first_name: string;
  patient_last_name: string;
  staff_first_name: string;
  staff_last_name: string;
  start_time: string;
  end_time: string;
  status: string;
  appointment_type: string;
  notes?: string;
}

const columns: ColumnDef<Appointment>[] = [
  {
    id: "patientName",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original;
      return `${patient.patient_first_name} ${patient.patient_last_name}`;
    },
  },
  {
    id: "providerName",
    header: "Provider",
    cell: ({ row }) => {
      const appointment = row.original;
      return `${appointment.staff_first_name} ${appointment.staff_last_name}`;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const date = row.getValue("start_time") as string;
      return formatDateTime(date);
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const date = row.getValue("end_time") as string;
      return formatDateTime(date);
    },
  },
  {
    accessorKey: "appointment_type",
    header: "Type",
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
      const appointment = row.original;

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
            <DropdownMenuItem>Edit appointment</DropdownMenuItem>
            <DropdownMenuItem>Reschedule</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Cancel appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: realApi.getAppointments,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Schedule and manage appointments"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="patient_first_name"
        searchPlaceholder="Search appointments..."
      />
    </div>
  );
}
