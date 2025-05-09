"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";

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

export function VendorsDataTable({ data }: { data: Vendor[] }) {
  const router = useRouter();

  const handleAddVendor = () => {
    router.push("/dashboard/vendors/new");
  };

  const handleRowClick = (vendor: Vendor) => {
    router.push(`/dashboard/vendors/${vendor.vendorEid}`);
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "vendorEid",
      header: "Vendor ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[100px]">
          {row.original.vendorEid}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 truncate max-w-[150px]">
          <IconBuildingStore className="size-4 flex-shrink-0" />
          <span className="font-medium truncate">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="truncate max-w-[120px]">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]">{row.original.address}</div>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate">
          <Badge variant="outline" className="truncate max-w-full">
            {row.original.city}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="max-w-[80px]">
          <Badge variant="outline">{row.original.state}</Badge>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Vendors"
      addButtonLabel="Add Vendor"
      onAdd={handleAddVendor}
      onRowClick={handleRowClick}
    />
  );
}
