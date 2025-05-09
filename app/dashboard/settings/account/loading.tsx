"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AccountLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and file upload */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-[250px]" />
          </div>
        </div>

        {/* Form fields */}
        {["Name", "Email", "Phone Number", "Password"].map((field, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Submit button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  );
}
