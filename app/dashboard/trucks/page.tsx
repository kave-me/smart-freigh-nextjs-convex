"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"

import { TruckSectionCards } from "./truck-section-cards"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { TrucksDataTable } from "./trucks-data-table";
// import { useTrucksQuery } from "./truck-query"

export default function TrucksPage() {
  const trucks = useQuery(api.trucks.getAllTrucks, {});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // Only set loading to false when vendorDocs is no longer undefined
    if (trucks !== undefined) {
      setLoading(false);
    }
  }, [trucks]);
  return (
    <div className="space-y-6">
      <TruckSectionCards trucks={trucks} isLoading={isLoading} />

      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}

      <TrucksDataTable data={trucks || []} />
    </div>
  )
}
