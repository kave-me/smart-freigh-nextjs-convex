"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "./trucks-data-table"
import { TruckSectionCards } from "./truck-section-cards"
import { useTrucksQuery } from "./truck-query"

export default function TrucksPage() {
  const { trucks, isLoading } = useTrucksQuery();

  return (
    <div className="space-y-8">
      <TruckSectionCards trucks={trucks} isLoading={isLoading} />
      
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}

      <div className="px-4 lg:px-6">
        <DataTable data={trucks || []} />
      </div>
    </div>
  )
}
