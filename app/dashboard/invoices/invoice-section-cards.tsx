"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSignIcon,
  BarChart3Icon,
  TimerIcon,
  ActivityIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowRightIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Invoice {
  _id: string;
  invoiceEid: string;
  status: "need_action" | "escalated"; // Updated to match database schema
  totalAmount: number;
  _creationTime: number;
  dateIssued?: number;
  resolvedDate?: number; // Added for tracking when escalated issues are resolved
}

interface InvoiceSectionCardsProps {
  invoices?: Invoice[];
  isLoading: boolean;
}

export function InvoiceSectionCards({
  invoices,
  isLoading,
}: InvoiceSectionCardsProps) {
  // Calculate invoice metrics
  const statistics = useMemo(() => {
    const counts = {
      need_action: 0,
      escalated: 0,
      escalated_resolved: 0,
    };

    let totalAmount = 0;
    let needActionAmount = 0;
    let escalatedAmount = 0;
    let escalatedResolvedAmount = 0;
    let newestInvoice = 0;
    let oldestPendingInvoice = Date.now();
    const processingTimes: number[] = [];

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Current month metrics
    let currentMonthInvoicesCount = 0;
    let currentMonthAmount = 0;
    let currentMonthEscalatedCount = 0;
    let currentMonthEscalatedAmount = 0;
    let currentMonthEscalatedResolvedCount = 0;
    let currentMonthEscalatedResolvedAmount = 0;

    // Previous month metrics
    let previousMonthInvoicesCount = 0;
    let previousMonthAmount = 0;
    let previousMonthEscalatedCount = 0;
    let previousMonthEscalatedAmount = 0;
    let previousMonthEscalatedResolvedCount = 0;
    let previousMonthEscalatedResolvedAmount = 0;

    let newInvoicesCount = 0;
    let processingEfficiencyScore = 0;

    if (invoices?.length) {
      invoices.forEach((invoice) => {
        const status = invoice.status;
        const creationTime = invoice.dateIssued || invoice._creationTime;

        // Count by status
        counts[status]++;

        // Track amounts by status
        totalAmount += invoice.totalAmount;

        if (status === "need_action") {
          needActionAmount += invoice.totalAmount;
          // Track oldest pending invoice for aging metric
          if (creationTime < oldestPendingInvoice) {
            oldestPendingInvoice = creationTime;
          }
        } else if (status === "escalated") {
          escalatedAmount += invoice.totalAmount;

          // Check if this escalated invoice was resolved
          if (invoice.resolvedDate) {
            counts.escalated_resolved++;
            escalatedResolvedAmount += invoice.totalAmount;
            // Add to processing times array (assumption: resolution time - creation time)
            processingTimes.push(invoice.resolvedDate - creationTime);
          }
        }

        // Track newest invoice
        if (invoice._creationTime > newestInvoice) {
          newestInvoice = invoice._creationTime;
        }

        // Current month (last 30 days) metrics
        if (creationTime > thirtyDaysAgo) {
          currentMonthInvoicesCount++;
          currentMonthAmount += invoice.totalAmount;

          if (status === "escalated") {
            currentMonthEscalatedCount++;
            currentMonthEscalatedAmount += invoice.totalAmount;

            if (invoice.resolvedDate && invoice.resolvedDate > thirtyDaysAgo) {
              currentMonthEscalatedResolvedCount++;
              currentMonthEscalatedResolvedAmount += invoice.totalAmount;
            }
          }

          newInvoicesCount++; // Keep original counter for backward compatibility
        }
        // Previous month (30-60 days ago) metrics
        else if (creationTime > sixtyDaysAgo) {
          previousMonthInvoicesCount++;
          previousMonthAmount += invoice.totalAmount;

          if (status === "escalated") {
            previousMonthEscalatedCount++;
            previousMonthEscalatedAmount += invoice.totalAmount;

            if (
              invoice.resolvedDate &&
              invoice.resolvedDate > sixtyDaysAgo &&
              invoice.resolvedDate < thirtyDaysAgo
            ) {
              previousMonthEscalatedResolvedCount++;
              previousMonthEscalatedResolvedAmount += invoice.totalAmount;
            }
          }
        }
      });
    }

    // Calculate month-over-month change percentages
    const invoiceCountChange = previousMonthInvoicesCount
      ? ((currentMonthInvoicesCount - previousMonthInvoicesCount) /
          previousMonthInvoicesCount) *
        100
      : 0;

    const invoiceAmountChange = previousMonthAmount
      ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      : 0;

    const escalatedCountChange = previousMonthEscalatedCount
      ? ((currentMonthEscalatedCount - previousMonthEscalatedCount) /
          previousMonthEscalatedCount) *
        100
      : 0;

    const escalatedAmountChange = previousMonthEscalatedAmount
      ? ((currentMonthEscalatedAmount - previousMonthEscalatedAmount) /
          previousMonthEscalatedAmount) *
        100
      : 0;

    const escalatedResolvedCountChange = previousMonthEscalatedResolvedCount
      ? ((currentMonthEscalatedResolvedCount -
          previousMonthEscalatedResolvedCount) /
          previousMonthEscalatedResolvedCount) *
        100
      : 0;

    const escalatedResolvedAmountChange = previousMonthEscalatedResolvedAmount
      ? ((currentMonthEscalatedResolvedAmount -
          previousMonthEscalatedResolvedAmount) /
          previousMonthEscalatedResolvedAmount) *
        100
      : 0;

    // Calculate average invoice amount
    const avgInvoiceAmount = invoices?.length
      ? totalAmount / invoices.length
      : 0;

    // Calculate average processing time in days
    const avgProcessingTime = processingTimes.length
      ? processingTimes.reduce((sum, time) => sum + time, 0) /
        processingTimes.length /
        (24 * 60 * 60 * 1000)
      : 0;

    // Calculate invoice aging (oldest pending invoice in days)
    const invoiceAging = (now - oldestPendingInvoice) / (24 * 60 * 60 * 1000);

    // Calculate processing efficiency (resolved escalated invoices / total escalated invoices) * 100
    if (counts.escalated > 0) {
      processingEfficiencyScore =
        (counts.escalated_resolved / counts.escalated) * 100;
    }

    // Calculate cost per invoice based on a hypothetical overhead cost
    // In a real scenario, you would use actual overhead costs
    const overheadCost = 50000; // Example: $50,000 monthly overhead
    const costPerInvoice = invoices?.length
      ? overheadCost / invoices.length
      : 0;

    return {
      counts,
      totalAmount,
      needActionAmount,
      escalatedAmount,
      escalatedResolvedAmount,
      newestInvoice,
      totalInvoices: invoices?.length || 0,
      avgInvoiceAmount,
      newInvoicesCount,
      avgProcessingTime,
      invoiceAging,
      processingEfficiencyScore,
      costPerInvoice,
      // Month-over-month metrics
      currentMonthInvoicesCount,
      currentMonthAmount,
      currentMonthEscalatedCount,
      currentMonthEscalatedAmount,
      currentMonthEscalatedResolvedCount,
      currentMonthEscalatedResolvedAmount,
      previousMonthInvoicesCount,
      previousMonthAmount,
      previousMonthEscalatedCount,
      previousMonthEscalatedAmount,
      previousMonthEscalatedResolvedCount,
      previousMonthEscalatedResolvedAmount,
      // Change percentages
      invoiceCountChange,
      invoiceAmountChange,
      escalatedCountChange,
      escalatedAmountChange,
      escalatedResolvedCountChange,
      escalatedResolvedAmountChange,
    };
  }, [invoices]);

  // Helper to render trend indicator
  const renderTrend = (changePercent: number) => {
    if (changePercent > 0) {
      return <TrendingUpIcon className="h-3 w-3 text-green-500 ml-1" />;
    } else if (changePercent < 0) {
      return <TrendingDownIcon className="h-3 w-3 text-red-500 ml-1" />;
    }
    return <ArrowRightIcon className="h-3 w-3 text-gray-500 ml-1" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Invoice Volume
          </CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {statistics.currentMonthInvoicesCount} invoices
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatCurrency(statistics.currentMonthAmount)}</span>
                <span className="flex items-center ml-1">
                  {statistics.invoiceAmountChange.toFixed(1)}%
                  {renderTrend(statistics.invoiceAmountChange)}
                </span>
              </div>
              <div className="mt-3 text-xs">
                <span className="flex items-center">
                  vs last month: {statistics.previousMonthInvoicesCount}{" "}
                  invoices
                  <span className="flex items-center ml-1">
                    {statistics.invoiceCountChange.toFixed(1)}%
                    {renderTrend(statistics.invoiceCountChange)}
                  </span>
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Escalated Invoices
          </CardTitle>
          <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {statistics.currentMonthEscalatedCount} escalated
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>
                  {formatCurrency(statistics.currentMonthEscalatedAmount)}
                </span>
                <span className="flex items-center ml-1">
                  {statistics.escalatedAmountChange.toFixed(1)}%
                  {renderTrend(statistics.escalatedAmountChange)}
                </span>
              </div>
              <div className="mt-3 text-xs">
                <span className="flex items-center">
                  vs last month: {statistics.previousMonthEscalatedCount}
                  <span className="flex items-center ml-1">
                    {statistics.escalatedCountChange.toFixed(1)}%
                    {renderTrend(statistics.escalatedCountChange)}
                  </span>
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Resolved Escalations
          </CardTitle>
          <div className="flex items-center">
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {statistics.currentMonthEscalatedResolvedCount} resolved
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>
                  {formatCurrency(
                    statistics.currentMonthEscalatedResolvedAmount,
                  )}
                </span>
                <span className="flex items-center ml-1">
                  {statistics.escalatedResolvedAmountChange.toFixed(1)}%
                  {renderTrend(statistics.escalatedResolvedAmountChange)}
                </span>
              </div>
              <div className="mt-3 text-xs">
                <span className="flex items-center">
                  Resolution rate:{" "}
                  {statistics.currentMonthEscalatedCount
                    ? (
                        (statistics.currentMonthEscalatedResolvedCount /
                          statistics.currentMonthEscalatedCount) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Processing Summary
          </CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 text-center">
                <div className="group relative">
                  <div className="text-lg font-bold text-yellow-500">
                    {statistics.counts.need_action}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center">
                    Need Action
                    <span className="ml-1 text-gray-400 text-[10px]">(?)</span>
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black bg-opacity-90 text-white text-xs rounded p-2 w-48 z-10">
                    Invoices in parsing stage or requiring action before
                    escalation
                  </div>
                </div>
                <div className="group relative">
                  <div className="text-lg font-bold text-purple-500">
                    {statistics.counts.escalated}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center">
                    Escalated
                    <span className="ml-1 text-gray-400 text-[10px]">(?)</span>
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black bg-opacity-90 text-white text-xs rounded p-2 w-48 z-10">
                    Invoices that have been parsed, enriched, analyzed, and
                    emails generated
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                <span className="flex items-center justify-center">
                  Avg. processing time:{" "}
                  {statistics.avgProcessingTime.toFixed(1)} days
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
