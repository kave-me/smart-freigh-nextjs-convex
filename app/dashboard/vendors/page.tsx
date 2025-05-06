
"use client"

import { useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "@/convex/_generated/api"
import {  VendorSectionCards } from "./vendor-section-cards"
import { VendorsDataTable } from "./vendors-data-table"




export default function TrucksPage() {
  const vendors = useQuery(api.vendors.getAllVendors, {})
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (vendors !== undefined) {
      setLoading(false)
    }
  }, [vendors])

  return (
    <div className="space-y-6">
     <VendorSectionCards vendors={vendors} isLoading={isLoading} />
        <VendorsDataTable data={vendors || []} />
    </div>
  )
}