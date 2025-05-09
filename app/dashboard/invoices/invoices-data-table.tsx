"use client";

import { IconReceipt, IconTruck, IconBuilding } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge, InvoiceStatus } from "@/app/hooks/use-status-badge";
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

export function InvoicesDataTable({ data }: { data: Invoice[] }) {
  const router = useRouter();

  // Define row click handler
  const handleRowClick = (invoiceEid: string) => {
    router.push(`/dashboard/invoices/${invoiceEid}`);
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceEid",
      header: () => "Invoice ID",
      cell: ({ row }) => (
        <div
          className="flex items-center gap-2 cursor-pointer hover:underline truncate max-w-[120px]"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row.original.invoiceEid);
          }}
        >
          <IconReceipt className="size-4 flex-shrink-0" />
          <span className="font-medium truncate">
            {row.original.invoiceEid}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "dateIssued",
      header: "Date Issued",
      cell: ({ row }) => (
        <div className="truncate max-w-[100px]">
          {formatDate(row.original.dateIssued)}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[100px]">
          {formatCurrency(row.original.totalAmount)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="max-w-[120px]">
          <StatusBadge
            invoiceId={row.original._id}
            initialStatus={row.original.status as InvoiceStatus}
          />
        </div>
      ),
    },
    {
      accessorKey: "truckId",
      header: "Truck",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 truncate max-w-[100px]">
          <IconTruck className="size-4 flex-shrink-0" />
          <span className="truncate">
            {row.original.truckId.substring(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      accessorKey: "vendorId",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 truncate max-w-[100px]">
          <IconBuilding className="size-4 flex-shrink-0" />
          <span className="truncate">
            {row.original.vendorId.substring(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      accessorKey: "analysis",
      header: "Analysis",
      cell: ({ row }) => {
        const analysis = row.original.analysis;
        if (!analysis)
          return (
            <div className="text-muted-foreground truncate max-w-[200px]">
              No analysis available
            </div>
          );

        return (
          <div className="max-w-[200px] truncate text-sm text-muted-foreground">
            {analysis.description}
          </div>
        );
      },
    },
  ];

  const handleAddInvoice = () => {
    // Implement add invoice functionality
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Invoices"
      addButtonLabel="Add Invoice"
      onAdd={handleAddInvoice}
      onRowClick={(invoice) => handleRowClick(invoice.invoiceEid)}
    />
  );
}
