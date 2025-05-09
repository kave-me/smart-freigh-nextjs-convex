"use client";

import { Skeleton } from "@/components/ui/skeleton";

// Loading component for /dashboard/settings
// This component will show while the layout and redirect is being handled
export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Tabs get displayed in the actual layout, so we just need to show a skeleton for the content */}
      <div className="animate-pulse">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Generic content skeleton */}
      <div className="space-y-6">
        <div className="h-[400px] rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end mt-6">
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
