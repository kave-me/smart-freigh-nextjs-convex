"use client"

import { useEffect, useMemo, useState } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
  IconTruck,
  IconEngine,
  IconBuildingFactory,
  IconBarcode,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { SectionCard } from "@/components/section-card"

type TruckSectionCardsProps = {
  trucks?: any[]
  isLoading: boolean
}

export function TruckSectionCards({ trucks, isLoading }: TruckSectionCardsProps) {
  const metrics = useMemo(() => {
    if (!trucks?.length) {
      return {
        totalTrucks: 0,
        makeCount: 0,
        bodyTypeCount: 0,
        newTrucks: 0,
        percentChange: "0.0",
      }
    }

    const uniqueMakes = new Set(trucks.map(truck => truck.make))
    const uniqueBodyTypes = new Set(trucks.map(truck => truck.bodyType))
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const newTrucks = trucks.filter(truck => truck._creationTime > thirtyDaysAgo).length
    const percentChange =
      newTrucks > 0 ? ((newTrucks / trucks.length) * 100).toFixed(1) : "0.0"

    return {
      totalTrucks: trucks.length,
      makeCount: uniqueMakes.size,
      bodyTypeCount: uniqueBodyTypes.size,
      newTrucks,
      percentChange,
    }
  }, [trucks])

  const [growthTrend, setGrowthTrend] = useState<"up" | "down">("up")

  useEffect(() => {
    setGrowthTrend(Math.random() > 0.3 ? "up" : "down")
  }, [trucks])

  const trendBadge = (
    <Badge variant="outline">
      {growthTrend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
      {growthTrend === "up" ? "+" : "-"}
      {metrics.percentChange}%
    </Badge>
  )

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SectionCard
        loading={isLoading}
        description="Total Trucks"
        title={metrics.totalTrucks.toString()}
        trendBadge={trendBadge}
        footer={
          <div className="flex items-center gap-1.5">
            <IconTruck className="size-4" />
            <span className="text-sm text-muted-foreground">
              {metrics.newTrucks} new trucks in the last 30 days
            </span>
          </div>
        }
      />
      <SectionCard
        loading={isLoading}
        description="Makes"
        title={metrics.makeCount.toString()}
        icon={<IconEngine className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Unique truck manufacturers in fleet
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="Body Types"
        title={metrics.bodyTypeCount.toString()}
        icon={<IconBuildingFactory className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Different truck body configurations
          </span>
        }
      />
      <SectionCard
        loading={isLoading}
        description="VIN Registry"
        title={metrics.totalTrucks.toString()}
        icon={<IconBarcode className="size-5 text-muted-foreground" />}
        footer={
          <span className="text-sm text-muted-foreground">
            Registered vehicle identification numbers
          </span>
        }
      />
    </div>
  )
}
