'use client';

import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-8 w-[150px]" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </div>
    </div>
  );
}