"use client"

import { useEffect, useMemo, useState } from "react"
import { IconTrendingDown, IconTrendingUp, IconTruck, IconEngine, IconBuildingFactory, IconBarcode } from "@tabler/icons-react"

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
type TruckSectionCardsProps = {
  trucks: any[] | undefined;
  isLoading: boolean;
}

export function TruckSectionCards({ trucks, isLoading }: TruckSectionCardsProps) {
  // Calculate truck metrics
  const metrics = useMemo(() => {
    if (!trucks || trucks.length === 0) {
      return {
        totalTrucks: 0,
        makeCount: 0,
        bodyTypeCount: 0,
        newTrucks: 0,
        percentChange: 0
      }
    }

    // Get unique makes and body types
    const uniqueMakes = new Set(trucks.map(truck => truck.make))
    const uniqueBodyTypes = new Set(trucks.map(truck => truck.bodyType))
    
    // Calculate new trucks (those added in the last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const newTrucks = trucks.filter(truck => truck._creationTime > thirtyDaysAgo).length
    
    // Calculate percent change
    const percentChange = newTrucks > 0 ? 
      ((newTrucks / trucks.length) * 100).toFixed(1) : 
      "0.0"
    
    return {
      totalTrucks: trucks.length,
      makeCount: uniqueMakes.size,
      bodyTypeCount: uniqueBodyTypes.size,
      newTrucks,
      percentChange
    }
  }, [trucks])

  // Simulate truck growth trend
  const [growthTrend, setGrowthTrend] = useState<"up" | "down">("up")
  
  useEffect(() => {
    setGrowthTrend(Math.random() > 0.3 ? "up" : "down")
  }, [trucks])

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
          <CardDescription>Total Trucks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalTrucks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {growthTrend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
              {growthTrend === "up" ? "+" : "-"}{metrics.percentChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="flex items-center gap-1.5">
            <IconTruck className="size-4" />
            <span className="text-sm text-muted-foreground">
              {metrics.newTrucks} new trucks in the last 30 days
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Makes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.makeCount}
          </CardTitle>
          <CardAction>
            <IconEngine className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">
              Unique truck manufacturers in fleet
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Body Types</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.bodyTypeCount}
          </CardTitle>
          <CardAction>
            <IconBuildingFactory className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">
              Different truck body configurations
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>VIN Registry</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalTrucks}
          </CardTitle>
          <CardAction>
            <IconBarcode className="size-5 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">
              Registered vehicle identification numbers
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}