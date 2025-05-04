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

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Vendor } from "./vendor-schema";

interface VendorSectionCardsProps {
  vendors?: Vendor[];
  isLoading: boolean;
}

export function VendorSectionCards({ vendors, isLoading }: VendorSectionCardsProps) {
  // Compute metrics
  const { totalVendors, stateCount, cityCount, newVendors, percentChange } = useMemo(() => {
    if (!vendors || vendors.length === 0) {
      return { totalVendors: 0, stateCount: 0, cityCount: 0, newVendors: 0, percentChange: "0.0" };
    }
    const uniqueStates = new Set(vendors.map((v) => v.state));
    const uniqueCities = new Set(vendors.map((v) => v.city));
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newCount = vendors.filter((v) => v._creationTime > thirtyDaysAgo).length;
    const pct = ((newCount / vendors.length) * 100).toFixed(1);
    return {
      totalVendors: vendors.length,
      stateCount: uniqueStates.size,
      cityCount: uniqueCities.size,
      newVendors: newCount,
      percentChange: pct,
    };
  }, [vendors]);

  // Randomized trend arrow (demo only)
  const [trend, setTrend] = useState<"up" | "down">("up");
  useEffect(() => {
    setTrend(Math.random() > 0.3 ? "up" : "down");
  }, [vendors]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2 5xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
              <CardTitle><Skeleton className="h-8 w-32" /></CardTitle>
            </CardHeader>
            <CardFooter>
              <CardAction><Skeleton className="h-6 w-16" /></CardAction>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2 5xl:grid-cols-4">
      {/* Total Vendors */}
      <Card>
        <CardHeader>
          <CardDescription>Total Vendors</CardDescription>
          <CardTitle>{totalVendors}</CardTitle>
        </CardHeader>
      </Card>

      {/* States Represented */}
      <Card>
        <CardHeader>
          <CardDescription>States Represented</CardDescription>
          <CardTitle>{stateCount}</CardTitle>
        </CardHeader>
      </Card>

      {/* Cities Represented */}
      <Card>
        <CardHeader>
          <CardDescription>Cities Represented</CardDescription>
          <CardTitle>{cityCount}</CardTitle>
        </CardHeader>
      </Card>

      {/* New Vendors (30d) */}
      <Card>
        <CardHeader>
          <CardDescription>New Vendors (30d)</CardDescription>
          <CardTitle>{newVendors}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center space-x-2">
          {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
          <span>{percentChange}%</span>
        </CardFooter>
      </Card>
    </div>
  );
}
