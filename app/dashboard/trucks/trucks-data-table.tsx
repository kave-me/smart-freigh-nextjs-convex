"use client";

import React from "react";
import { toast } from "sonner";
import { IconTruck } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EditDrawer } from "@/components/shared/edit-drawer";

type Truck = {
  _id: string;
  _creationTime: number;
  truckEid: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  vin: string;
  userId: string;
};

const columns: ColumnDef<Truck>[] = [
  {
    accessorKey: "truckEid",
    header: () => "Truck ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconTruck className="size-4" />
        <span className="font-medium">{row.original.truckEid}</span>
      </div>
    ),
  },
  {
    accessorKey: "make",
    header: "Make",
    cell: ({ row }) => <div>{row.original.make}</div>,
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => <div>{row.original.model}</div>,
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => <div>{row.original.year}</div>,
  },
  {
    accessorKey: "bodyType",
    header: "Body Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.bodyType}</Badge>
    ),
  },
  {
    accessorKey: "vin",
    header: "VIN",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.vin}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleSave = async (data: Truck) => {
        // Implement your truck update logic here
        // await updateTruck(data);
      };

      return (
        <EditDrawer
          title="Edit Truck"
          description="Update truck details"
          fields={[
            { key: "truckEid", label: "Truck ID" },
            { key: "make", label: "Make" },
            { key: "model", label: "Model" },
            { key: "year", label: "Year" },
            { key: "bodyType", label: "Body Type" },
            { key: "vin", label: "VIN" },
          ]}
          data={row.original}
          onSave={handleSave}
        />
      );
    },
  },
];

export function TrucksDataTable({ data }: { data: Truck[] }) {
  const handleAddTruck = () => {
    // Implement your add truck logic here
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Trucks"
      addButtonLabel="Add Truck"
      onAdd={handleAddTruck}
    />
  );
}