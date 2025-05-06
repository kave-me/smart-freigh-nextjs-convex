"use client";

import React from "react";
import { toast } from "sonner";
import { IconBuildingStore } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EditDrawer } from "@/components/shared/edit-drawer";

type Vendor = {
  _id: string;
  _creationTime: number;
  vendorEid: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
};

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconBuildingStore className="size-4" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.original.phone}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <div>{row.original.address}</div>,
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.city}</Badge>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.state}</Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleSave = async (data: Vendor) => {
        // Implement your vendor update logic here
        // await updateVendor(data);
      };

      return (
        <EditDrawer
          title="Edit Vendor"
          description="Update vendor details"
          fields={[
            { key: "vendorEid", label: "Vendor ID" },
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "city", label: "City" },
            { key: "state", label: "State" },
            { key: "zipCode", label: "ZIP Code" },
          ]}
          data={row.original}
          onSave={handleSave}
        />
      );
    },
  },
];

export function VendorsDataTable({ data }: { data: Vendor[] }) {
  const handleAddVendor = () => {
    // Implement your add vendor logic here
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Vendors"
      addButtonLabel="Add Vendor"
      onAdd={handleAddVendor}
    />
  );
}