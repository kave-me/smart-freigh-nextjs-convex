"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_COLORS } from "@/app/hooks/use-status-badge";

interface Invoice {
  _id: string;
  invoiceEid: string;
  status: string;
  totalAmount: number;
  _creationTime: number;
}

interface InvoiceSectionCardsProps {
  invoices?: Invoice[];
  isLoading: boolean;
}

export function InvoiceSectionCards({
  invoices,
  isLoading,
}: InvoiceSectionCardsProps) {
  // Count invoices by status
  const statusCounts = useMemo(() => {
    const counts = {
      needs_review: 0,
      approved: 0,
      rejected: 0,
      escalated: 0,
    };

    if (invoices?.length) {
      invoices.forEach((invoice) => {
        const status = invoice.status as keyof typeof counts;
        if (status in counts) {
          counts[status]++;
        }
      });
    }

    return counts;
  }, [invoices]);

  const totalInvoices = invoices?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatusCard
        title="Needs Review"
        value={statusCounts.needs_review}
        total={totalInvoices}
        statusColor={STATUS_COLORS.needs_review}
        isLoading={isLoading}
      />
      <StatusCard
        title="Approved"
        value={statusCounts.approved}
        total={totalInvoices}
        statusColor={STATUS_COLORS.approved}
        isLoading={isLoading}
      />
      <StatusCard
        title="Rejected"
        value={statusCounts.rejected}
        total={totalInvoices}
        statusColor={STATUS_COLORS.rejected}
        isLoading={isLoading}
      />
      <StatusCard
        title="Escalated"
        value={statusCounts.escalated}
        total={totalInvoices}
        statusColor={STATUS_COLORS.escalated}
        isLoading={isLoading}
      />
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: number;
  total: number;
  statusColor: string;
  isLoading: boolean;
}

function StatusCard({
  title,
  value,
  total,
  statusColor,
  isLoading,
}: StatusCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`w-4 h-4 rounded-full ${statusColor}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
              {percentage}% of all invoices
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
