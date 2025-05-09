"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CompanyInfoLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px]" />
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
            {[
              "Company Name",
              "Email",
              "SCAC",
              "Home Domicile",
              "Phone Number",
              "Currency",
            ].map((field, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <div className="flex justify-end col-span-1 md:col-span-2">
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
