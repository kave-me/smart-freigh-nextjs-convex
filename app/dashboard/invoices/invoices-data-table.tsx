"use client";

import { IconReceipt, IconTruck, IconBuilding } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";

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
  analysis?: {
    description: string;
    items: { description: string }[];
  };
};

const statusColors: Record<string, string> = {
  needs_review: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  approved: "bg-green-100 text-green-800 hover:bg-green-200",
  paid: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  rejected: "bg-red-100 text-red-800 hover:bg-red-200",
};

export function InvoicesDataTable({ data }: { data: Invoice[] }) {
  const router = useRouter();

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceEid",
      header: () => "Invoice ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => router.push(`/dashboard/invoices/${row.original.invoiceEid}`)}>
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
      accessorKey: "analysis",
      header: "Analysis",
      cell: ({ row }) => {
        const analysis = row.original.analysis;
        if (!analysis) return <div className="text-muted-foreground">No analysis available</div>;
        
        return (
          <div className="max-w-[300px] truncate text-sm text-muted-foreground">
            {analysis.description}
          </div>
        );
      },
    },
  ];

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
      onRowClick={(row) => router.push(`/dashboard/invoices/${row.invoiceEid}`)}
    />
  );
}