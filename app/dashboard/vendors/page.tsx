"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "./vendors-data-table"
import { VendorSectionCards } from "./vendor-section-cards"
import { useVendorsQuery } from "./vendor-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { IconBuilding, IconUsers } from "@tabler/icons-react"

export default function VendorsPage() {
  const { vendors, isLoading } = useVendorsQuery();

  return (
    <div className="space-y-8">
      {/* <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <IconBuilding className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{vendors?.length || 0}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>  
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* Replace SectionCards with our new VendorSectionCards */}
      <VendorSectionCards vendors={vendors} isLoading={isLoading} />
      
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      
      {isLoading ? (
        <div className="px-4 lg:px-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable data={vendors || []} />
      )}
    </div>
  )
}