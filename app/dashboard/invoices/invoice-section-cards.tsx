"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconReceipt,
  IconCurrency,
  IconAlertTriangle,
  IconCalendarStats,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/section-card";

type InvoiceSectionCardsProps = {
  invoices?: any[];
  isLoading: boolean;
};

export function InvoiceSectionCards({
  invoices,
  isLoading,
}: InvoiceSectionCardsProps) {
  const metrics = useMemo(() => {
    if (!invoices?.length) {
      return {
        totalInvoices: 0,
        totalAmount: 0,
        needsReviewCount: 0,
        newInvoices: 0,
        percentChange: "0.0",
      };
    }

    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const needsReviewCount = invoices.filter(inv => inv.status === "needs_review").length;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newInvoices = invoices.filter(
      (inv) => inv._creationTime > thirtyDaysAgo,
    ).length;
    const percentChange =
      newInvoices > 0 ? ((newInvoices / invoices.length) * 100).toFixed(1) : "0.0";

    return {
      totalInvoices: invoices.length,
      totalAmount: totalAmount.toFixed(2),
      needsReviewCount,
      newInvoices,
      percentChange,
    };
  }, [invoices]);

  const [growthTrend, setGrowthTrend] = useState<"up" | "down">("up");

  useEffect(() => {
    setGrowthTrend(Math.random() > 0.3 ? "up" : "down");
  }, [invoices]);

  const trendBadge = (
    <Badge variant="outline">
      {growthTrend === "up" ? (
        <IconTrendingUp className="size-4" />
      ) : (
        <IconTrendingDown className="size-4" />
      )}
      {growthTrend === "up" ? "+" : "-"}
      {metrics.percentChange}%
    </Badge>
  );

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SectionCard
        loading={isLoading}
        description="Total Invoices"
        title={metrics.totalInvoices.toString()}
        trendBadge={trendBadge}
        footer={
          <div className="flex items-center gap-1.5">
            <IconReceipt className="size-4" />
            <span className="text-sm text-muted-foreground">
              {metrics.newInvoices} new invoices in the last 30 days
            </span>
          </div>
        }
      />
      <SectionCard
        loading={isLoading}
        description="Total Amount"
        title={`$${metrics.totalAmount}`}
        icon={<IconCurrency className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Combined value of all invoices
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="Needs Review"
        title={metrics.needsReviewCount.toString()}
        icon={<IconAlertTriangle className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Invoices requiring review and approval
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="New Invoices"
        title={metrics.newInvoices.toString()}
        icon={<IconCalendarStats className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Invoices added in the last 30 days
          </span>
        }
      />
    </div>
  );
}