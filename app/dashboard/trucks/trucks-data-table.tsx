/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { IconTruck } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export function TrucksDataTable({ data }: { data: Truck[] }) {
  const router = useRouter();

  const handleAddTruck = () => {
    router.push("/dashboard/trucks/new");
  };

  const handleRowClick = (truck: Truck) => {
    router.push(`/dashboard/trucks/${truck.truckEid}`);
  };

  const columns: ColumnDef<Truck>[] = [
    {
      accessorKey: "truckEid",
      header: () => "Truck ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 truncate max-w-[120px]">
          <IconTruck className="size-4 flex-shrink-0" />
          <span className="font-medium truncate">{row.original.truckEid}</span>
        </div>
      ),
    },
    {
      accessorKey: "make",
      header: "Make",
      cell: ({ row }) => (
        <div className="truncate max-w-[100px]">{row.original.make}</div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <div className="truncate max-w-[120px]">{row.original.model}</div>
      ),
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ row }) => (
        <div className="truncate max-w-[80px]">{row.original.year}</div>
      ),
    },
    {
      accessorKey: "bodyType",
      header: "Body Type",
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate">
          <Badge variant="outline" className="truncate max-w-full">
            {row.original.bodyType}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "vin",
      header: "VIN",
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[140px]">
          {row.original.vin}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Trucks"
      addButtonLabel="Add Truck"
      onAdd={handleAddTruck}
      onRowClick={handleRowClick}
    />
  );
}
