"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BusinessRulesLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-[150px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-[300px] mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <Card key={categoryIndex} className="border border-gray-200">
              <CardHeader className="flex flex-row items-start justify-between p-2">
                <Skeleton className="h-5 w-[120px]" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {Array.from({ length: 2 }).map((_, ruleIndex) => (
                  <div
                    key={ruleIndex}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
