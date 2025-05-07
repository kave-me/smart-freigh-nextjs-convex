"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTruck } from "@tabler/icons-react";

export default function TruckDetailPage() {
  const params = useParams();
  const truckId = params.truckId as string;
  const truck = useQuery(api.trucks.getTruckById, { truckEid: truckId });

  if (truck === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (truck === null) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-muted-foreground">Truck not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center gap-2">
              <IconTruck className="size-6" />
              {truck.truckEid}
            </div>
          </CardTitle>
          <Badge variant="outline">{truck.bodyType}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Make</h3>
              <p>{truck.make}</p>
            </div>
            <div>
              <h3 className="font-semibold">Model</h3>
              <p>{truck.model}</p>
            </div>
            <div>
              <h3 className="font-semibold">Year</h3>
              <p>{truck.year}</p>
            </div>
            <div>
              <h3 className="font-semibold">VIN</h3>
              <p className="font-mono text-sm">{truck.vin}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}