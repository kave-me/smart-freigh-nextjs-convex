"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFileInvoice, IconLoader2 } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface TruckInvoicesProps {
  truckId: string;
}

export default function TruckInvoices({ truckId }: TruckInvoicesProps) {
  const invoices = useQuery(api.trucks.getInvoicesByTruckId, {
    truckEid: truckId,
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "needs_review":
        return "secondary";
      case "escalated":
        return "destructive";
      case "approved":
        return "default";
      case "rejected":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex items-center gap-2">
            <IconFileInvoice className="size-5" />
            Invoices
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices === undefined ? (
          <div className="flex h-40 items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No invoices for this truck</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceEid}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dateIssued).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{invoice.items.length} items</TableCell>
                  <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
