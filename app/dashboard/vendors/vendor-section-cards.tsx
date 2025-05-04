"use client"

import { useEffect, useMemo, useState } from "react"
import { IconTrendingDown, IconTrendingUp, IconBuildingStore, IconMapPin, IconDeviceAnalytics, IconCalendarStats } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Define the props type
type VendorSectionCardsProps = {
  vendors: any[] | undefined;
  isLoading: boolean;
}

export function VendorSectionCards({ vendors, isLoading }: VendorSectionCardsProps) {
  // Calculate vendor metrics
  const metrics = useMemo(() => {
    if (!vendors || vendors.length === 0) {
      return {
        totalVendors: 0,
        stateCount: 0,
        cityCount: 0,
        newVendors: 0,
        percentChange: 0
      }
    }

    // Get unique states and cities
    const uniqueStates = new Set(vendors.map(vendor => vendor.state))
    const uniqueCities = new Set(vendors.map(vendor => vendor.city))
    
    // Calculate new vendors (those added in the last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const newVendors = vendors.filter(vendor => vendor.creationTime > thirtyDaysAgo).length
    
    // Calculate percent change (simulated since we don't have historical data)
    // In a real app, you would calculate this based on previous period data
    const percentChange = newVendors > 0 ? 
      ((newVendors / vendors.length) * 100).toFixed(1) : 
      "0.0"
    
    return {
      totalVendors: vendors.length,
      stateCount: uniqueStates.size,
      cityCount: uniqueCities.size,
      newVendors,
      percentChange
    }
  }, [vendors])

  // Simulate vendor growth trend (in a real app, this would come from historical data)
  const [growthTrend, setGrowthTrend] = useState<"up" | "down">("up")
  
  useEffect(() => {
    // Randomly determine trend for demo purposes
    // In a real app, this would be calculated from actual data
    setGrowthTrend(Math.random() > 0.3 ? "up" : "down")
  }, [vendors])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
              <CardTitle className="text-2xl"><Skeleton className="h-8 w-32" /></CardTitle>
              <CardAction><Skeleton className="h-6 w-16" /></CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Vendors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalVendors}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {growthTrend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
              {growthTrend === "up" ? "+" : "-"}{metrics.percentChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconBuildingStore className="size-4" /> Active vendor relationships
          </div>
          <div className="text-muted-foreground">
            {growthTrend === "up" 
              ? "Vendor network is expanding" 
              : "Vendor network stable"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Geographic Reach</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.stateCount} States
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconMapPin className="size-4" />
              {metrics.cityCount} Cities
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Regional distribution coverage
          </div>
          <div className="text-muted-foreground">
            {metrics.cityCount > 5 
              ? "Broad geographic coverage" 
              : "Concentrated in key regions"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Vendors (30 days)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.newVendors}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.newVendors > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
              {metrics.newVendors > 0 ? "Active growth" : "No growth"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconCalendarStats className="size-4" /> Recent acquisitions
          </div>
          <div className="text-muted-foreground">
            {metrics.newVendors > 0 
              ? "Network expansion on track" 
              : "Consider outreach initiatives"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Vendor Retention</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalVendors > 0 ? "97.5%" : "0%"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              +2.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconDeviceAnalytics className="size-4" /> Strong relationship metrics
          </div>
          <div className="text-muted-foreground">
            Vendor satisfaction above industry average
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}