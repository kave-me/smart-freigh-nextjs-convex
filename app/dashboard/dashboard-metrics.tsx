"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconTruck,
  IconBuildingStore,
  IconReceipt,
  IconCurrencyDollar,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { SectionCard } from "@/components/section-card";

export function DashboardMetrics() {
  const trucks = useQuery(api.trucks.getAllTrucks, {});
  const vendors = useQuery(api.vendors.getAllVendors, {});
  const invoices = useQuery(api.invoices.getAllInvoices, {});

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (
      trucks !== undefined &&
      vendors !== undefined &&
      invoices !== undefined
    ) {
      setLoading(false);
    }
  }, [trucks, vendors, invoices]);

  // Calculate key metrics for invoices
  const invoiceMetrics = useMemo(() => {
    if (!invoices?.length) {
      return {
        totalCount: 0,
        totalAmount: 0,
        pendingCount: 0,
        pendingAmount: 0,
        processedCount: 0,
        processedAmount: 0,
        issuesCount: 0,
        issuesAmount: 0,
        avgAmount: 0,
        recentCount: 0,
        percentChange: 0,
      };
    }

    const statusCounts = {
      need_action: 0,
      escalated: 0,
    };

    let totalAmount = 0;
    let pendingAmount = 0;
    let escalatedAmount = 0;
    let recentCount = 0;
    let recentTotal = 0;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Process all invoices
    invoices.forEach((invoice) => {
      const status = invoice.status;
      statusCounts[status]++;

      // Track amounts by status
      totalAmount += invoice.totalAmount;

      if (status === "need_action") {
        pendingAmount += invoice.totalAmount;
      } else if (status === "escalated") {
        escalatedAmount += invoice.totalAmount;
      }

      // Count recent invoices (last 30 days)
      const creationTime = invoice.dateIssued || invoice._creationTime;
      if (creationTime > thirtyDaysAgo) {
        recentCount++;
        recentTotal += invoice.totalAmount;
      }
    });

    const avgAmount = invoices.length ? totalAmount / invoices.length : 0;
    const avgRecentAmount = recentCount ? recentTotal / recentCount : 0;
    const percentChange =
      avgRecentAmount && avgAmount
        ? ((avgRecentAmount - avgAmount) / avgAmount) * 100
        : 0;

    return {
      totalCount: invoices.length,
      totalAmount,
      pendingCount: statusCounts.need_action,
      pendingAmount,
      processedCount: statusCounts.escalated,
      processedAmount: escalatedAmount,
      issuesCount: statusCounts.escalated,
      issuesAmount: escalatedAmount,
      avgAmount,
      recentCount,
      percentChange,
    };
  }, [invoices]);

  // Calculate key metrics for trucks
  const truckMetrics = useMemo(() => {
    if (!trucks?.length) {
      return {
        totalCount: 0,
        makeCount: 0,
        bodyTypeCount: 0,
        newCount: 0,
        percentChange: 0,
      };
    }

    const uniqueMakes = new Set(trucks.map((truck) => truck.make));
    const uniqueBodyTypes = new Set(trucks.map((truck) => truck.bodyType));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newCount = trucks.filter(
      (truck) => truck._creationTime > thirtyDaysAgo,
    ).length;
    const percentChange = newCount > 0 ? (newCount / trucks.length) * 100 : 0;

    return {
      totalCount: trucks.length,
      makeCount: uniqueMakes.size,
      bodyTypeCount: uniqueBodyTypes.size,
      newCount,
      percentChange,
    };
  }, [trucks]);

  // Calculate key metrics for vendors
  const vendorMetrics = useMemo(() => {
    if (!vendors?.length) {
      return {
        totalCount: 0,
        stateCount: 0,
        cityCount: 0,
        newCount: 0,
        percentChange: 0,
      };
    }

    const uniqueStates = new Set(vendors.map((v) => v.state));
    const uniqueCities = new Set(vendors.map((v) => v.city));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newCount = vendors.filter(
      (v) => v._creationTime > thirtyDaysAgo,
    ).length;
    const percentChange = newCount > 0 ? (newCount / vendors.length) * 100 : 0;

    return {
      totalCount: vendors.length,
      stateCount: uniqueStates.size,
      cityCount: uniqueCities.size,
      newCount,
      percentChange,
    };
  }, [vendors]);

  // Calculate overall business metrics
  const overallMetrics = useMemo(() => {
    const avgInvoicePerVendor = vendorMetrics.totalCount
      ? invoiceMetrics.totalCount / vendorMetrics.totalCount
      : 0;

    const avgInvoicePerTruck = truckMetrics.totalCount
      ? invoiceMetrics.totalCount / truckMetrics.totalCount
      : 0;

    const avgAmountPerVendor = vendorMetrics.totalCount
      ? invoiceMetrics.totalAmount / vendorMetrics.totalCount
      : 0;

    const avgAmountPerTruck = truckMetrics.totalCount
      ? invoiceMetrics.totalAmount / truckMetrics.totalCount
      : 0;

    return {
      avgInvoicePerVendor,
      avgInvoicePerTruck,
      avgAmountPerVendor,
      avgAmountPerTruck,
    };
  }, [invoiceMetrics, vendorMetrics, truckMetrics]);

  const getTrendBadge = (value: number) => (
    <Badge variant="outline">
      {value >= 0 ? (
        <IconTrendingUp className="size-4" />
      ) : (
        <IconTrendingDown className="size-4" />
      )}
      {value >= 0 ? "+" : ""}
      {value.toFixed(1)}%
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Business KPIs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <IconReceipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {invoiceMetrics.totalCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(invoiceMetrics.totalAmount)} total value
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
            <IconTruck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {truckMetrics.totalCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {truckMetrics.makeCount} unique manufacturers
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {vendorMetrics.totalCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  In {vendorMetrics.stateCount} states,{" "}
                  {vendorMetrics.cityCount} cities
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(invoiceMetrics.pendingAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {invoiceMetrics.pendingCount} invoices pending review
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="trucks">Trucks</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SectionCard
              loading={isLoading}
              description="Total Amount"
              title={formatCurrency(invoiceMetrics.totalAmount)}
              trendBadge={getTrendBadge(invoiceMetrics.percentChange)}
              footer={
                <div className="flex items-center gap-1.5">
                  <IconCurrencyDollar className="size-4" />
                  <span className="text-sm text-muted-foreground">
                    Avg {formatCurrency(invoiceMetrics.avgAmount)} per invoice
                  </span>
                </div>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Pending Review"
              title={invoiceMetrics.pendingCount.toString()}
              icon={<IconReceipt className="size-5 text-yellow-500" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(invoiceMetrics.pendingAmount)} awaiting
                  approval
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Processed"
              title={invoiceMetrics.processedCount.toString()}
              icon={<IconReceipt className="size-5 text-green-500" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(invoiceMetrics.processedAmount)} total
                  processed
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Issues & Escalations"
              title={invoiceMetrics.issuesCount.toString()}
              icon={<IconReceipt className="size-5 text-red-500" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(invoiceMetrics.issuesAmount)} in dispute
                </span>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="trucks" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SectionCard
              loading={isLoading}
              description="Total Trucks"
              title={truckMetrics.totalCount.toString()}
              trendBadge={getTrendBadge(truckMetrics.percentChange)}
              footer={
                <div className="flex items-center gap-1.5">
                  <IconTruck className="size-4" />
                  <span className="text-sm text-muted-foreground">
                    {truckMetrics.newCount} new trucks in the last 30 days
                  </span>
                </div>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Makes"
              title={truckMetrics.makeCount.toString()}
              icon={<IconTruck className="size-5 text-muted-foreground" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  Unique truck manufacturers in fleet
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Body Types"
              title={truckMetrics.bodyTypeCount.toString()}
              icon={<IconTruck className="size-5 text-muted-foreground" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  Different truck body configurations
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Avg Invoices"
              title={overallMetrics.avgInvoicePerTruck.toFixed(1)}
              icon={<IconReceipt className="size-5 text-muted-foreground" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(overallMetrics.avgAmountPerTruck)} avg per
                  truck
                </span>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <SectionCard
              loading={isLoading}
              description="Total Vendors"
              title={vendorMetrics.totalCount.toString()}
              trendBadge={getTrendBadge(vendorMetrics.percentChange)}
              footer={
                <div className="flex items-center gap-1.5">
                  <IconBuildingStore className="size-4" />
                  <span className="text-sm text-muted-foreground">
                    {vendorMetrics.newCount} new vendors in the last 30 days
                  </span>
                </div>
              }
            />

            <SectionCard
              loading={isLoading}
              description="States"
              title={vendorMetrics.stateCount.toString()}
              icon={
                <IconBuildingStore className="size-5 text-muted-foreground" />
              }
              footer={
                <span className="text-sm text-muted-foreground">
                  States with at least one vendor
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Cities"
              title={vendorMetrics.cityCount.toString()}
              icon={
                <IconBuildingStore className="size-5 text-muted-foreground" />
              }
              footer={
                <span className="text-sm text-muted-foreground">
                  Unique cities with vendor presence
                </span>
              }
            />

            <SectionCard
              loading={isLoading}
              description="Avg Invoices"
              title={overallMetrics.avgInvoicePerVendor.toFixed(1)}
              icon={<IconReceipt className="size-5 text-muted-foreground" />}
              footer={
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(overallMetrics.avgAmountPerVendor)} avg per
                  vendor
                </span>
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
