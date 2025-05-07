'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmailTemplatesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template List */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[180px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-[120px]" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-[100px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}