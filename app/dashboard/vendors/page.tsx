"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { VendorSectionCards } from "./vendor-section-cards";
import { DataTable } from "./vendors-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function VendorsPage() {
  const [isLoading, setLoading] = useState(true);
  const vendors = useQuery(api.vendors.getAllVendors, {});
  
  useEffect(() => {
    // Only set loading to false when vendorDocs is no longer undefined
    if (vendors !== undefined) {
      setLoading(false);
    }
  }, [vendors]);

  return (
    <div className="space-y-8">
      <VendorSectionCards vendors={vendors} isLoading={isLoading} />
      {isLoading ? (
        <div className="px-4 lg:px-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable data={vendors || []} />
      )}
    </div>
  );
}