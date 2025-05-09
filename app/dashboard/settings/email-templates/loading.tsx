import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EmailTemplatesLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="flex flex-row items-start justify-between p-4">
                <Skeleton className="h-5 w-[120px]" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="space-y-1">
                  {[
                    "Subject",
                    "Action",
                    "To",
                    "From",
                    "BCC",
                    "CC",
                    "Company",
                    "Phone",
                  ].map((field, i) => (
                    <div key={i} className="flex">
                      <Skeleton className="h-4 w-[60px] mr-2" />
                      <Skeleton className="h-4 w-[140px]" />
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full mb-1" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
