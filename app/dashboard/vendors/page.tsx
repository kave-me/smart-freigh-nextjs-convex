"use client";

import { VendorSectionCards } from "./vendor-section-cards";
import { DataTable } from "./vendors-data-table";
import { useVendorsQuery } from "./vendor-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsPage() {
  const { vendors, isLoading } = useVendorsQuery();

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
