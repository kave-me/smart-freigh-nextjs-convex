"use client";

import { IconReceipt, IconTruck, IconBuilding } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EditDrawer } from "@/components/shared/edit-drawer";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
};

type Invoice = {
  _id: string;
  _creationTime: number;
  invoiceEid: string;
  dateIssued: number;
  status: string;
  totalAmount: number;
  items: InvoiceItem[];
  truckId: string;
  vendorId: string;
  userId: string;
};

const statusColors: Record<string, string> = {
  needs_review: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  approved: "bg-green-100 text-green-800 hover:bg-green-200",
  paid: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  rejected: "bg-red-100 text-red-800 hover:bg-red-200",
};

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceEid",
    header: () => "Invoice ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconReceipt className="size-4" />
        <span className="font-medium">{row.original.invoiceEid}</span>
      </div>
    ),
  },
  {
    accessorKey: "dateIssued",
    header: "Date Issued",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.dateIssued).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <div className="font-medium">${row.original.totalAmount.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
      const displayStatus = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      return (
        <Badge 
          variant="outline" 
          className={colorClass}
        >
          {displayStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "truckId",
    header: "Truck",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconTruck className="size-4" />
        <span>{row.original.truckId.substring(0, 8)}...</span>
      </div>
    ),
  },
  {
    accessorKey: "vendorId",
    header: "Vendor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconBuilding className="size-4" />
        <span>{row.original.vendorId.substring(0, 8)}...</span>
      </div>
    ),
  },
  {
    accessorKey: "dateIssued",
    header: "Date Issued",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {new Date(row.original.dateIssued).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDistance(new Date(row.original.dateIssued), new Date(), { addSuffix: true })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleSave = async (data: Invoice) => {
        // Implement your invoice update logic here
        // await updateInvoice(data);
      };

      return (
        <EditDrawer
          title="Edit Invoice"
          description="Update invoice details"
          fields={[
            { key: "invoiceEid", label: "Invoice ID" },
            { key: "dateIssued", label: "Date Issued", type: "date" },
            { key: "status", label: "Status", type: "select", options: [
              { value: "needs_review", label: "Needs Review" },
              { value: "approved", label: "Approved" },
              { value: "paid", label: "Paid" },
              { value: "rejected", label: "Rejected" },
            ]},
            { key: "totalAmount", label: "Total Amount", type: "number" },
            { key: "truckId", label: "Truck ID" },
            { key: "vendorId", label: "Vendor ID" },
          ]}
          data={row.original}
          onSave={handleSave}
        />
      );
    },
  },
];

export function InvoicesDataTable({ data }: { data: Invoice[] }) {
  const handleAddInvoice = () => {
    // Implement your add invoice logic here
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Invoices"
      addButtonLabel="Add Invoice"
      onAdd={handleAddInvoice}
    />
  );
}