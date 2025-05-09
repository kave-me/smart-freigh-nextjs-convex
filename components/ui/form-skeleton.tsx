"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton({
  rows = 4,
  columns = 2,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {Array(rows * columns)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
    </div>
  );
}
