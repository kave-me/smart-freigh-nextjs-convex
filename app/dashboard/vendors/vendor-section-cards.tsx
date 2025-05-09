"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconBuildingStore,
  IconMapPin,
  IconDeviceAnalytics,
  IconCalendarStats,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/section-card";

type VendorSectionCardsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vendors?: any[];
  isLoading: boolean;
};

export function VendorSectionCards({
  vendors,
  isLoading,
}: VendorSectionCardsProps) {
  const metrics = useMemo(() => {
    if (!vendors?.length) {
      return {
        totalVendors: 0,
        stateCount: 0,
        cityCount: 0,
        newVendors: 0,
        percentChange: "0.0",
      };
    }

    const uniqueStates = new Set(vendors.map((v) => v.state));
    const uniqueCities = new Set(vendors.map((v) => v.city));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newVendors = vendors.filter(
      (v) => v._creationTime > thirtyDaysAgo,
    ).length;
    const percentChange =
      newVendors > 0 ? ((newVendors / vendors.length) * 100).toFixed(1) : "0.0";

    return {
      totalVendors: vendors.length,
      stateCount: uniqueStates.size,
      cityCount: uniqueCities.size,
      newVendors,
      percentChange,
    };
  }, [vendors]);

  const [growthTrend, setGrowthTrend] = useState<"up" | "down">("up");

  useEffect(() => {
    setGrowthTrend(Math.random() > 0.3 ? "up" : "down");
  }, [vendors]);

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
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SectionCard
        loading={isLoading}
        description="Total Vendors"
        title={metrics.totalVendors.toString()}
        trendBadge={trendBadge}
        footer={
          <div className="flex items-center gap-1.5">
            <IconBuildingStore className="size-4" />
            <span className="text-sm text-muted-foreground">
              {metrics.newVendors} new vendors in the last 30 days
            </span>
          </div>
        }
      />
      <SectionCard
        loading={isLoading}
        description="States"
        title={metrics.stateCount.toString()}
        icon={<IconMapPin className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            States with at least one vendor
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="Cities"
        title={metrics.cityCount.toString()}
        icon={<IconDeviceAnalytics className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Unique cities with vendor presence
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="New Vendors"
        title={metrics.newVendors.toString()}
        icon={<IconCalendarStats className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Vendors added in the last 30 days
          </span>
        }
      />
    </div>
  );
}
