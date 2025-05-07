"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBuildingStore, IconLoader2 } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TruckVendorsProps {
  truckId: string;
}

export default function TruckVendors({ truckId }: TruckVendorsProps) {
  const vendors = useQuery(api.trucks.getVendorsByTruckId, { truckEid: truckId });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex items-center gap-2">
            <IconBuildingStore className="size-5" />
            Vendors
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vendors === undefined ? (
          <div className="flex h-40 items-center justify-center">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No vendors associated with this truck</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{vendor.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div>{vendor.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {vendor.city}, {vendor.state} {vendor.zipCode}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}