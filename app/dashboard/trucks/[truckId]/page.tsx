"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconTruck,
  IconEdit,
  IconCheck,
  IconX,
  IconBuilding,
  IconReceipt,
  IconAlertTriangle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TruckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const truckId = params.truckId as string;
  const truck = useQuery(api.trucks.getById, { id: truckId });
  const vendors =
    useQuery(api.trucks.getVendorsByTruckId, { truckEid: truckId }) || [];
  const invoices =
    useQuery(api.trucks.getInvoicesByTruckId, { truckEid: truckId }) || [];
  const updateTruck = useMutation(api.trucks.updateTruck);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    truckEid: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    bodyType: "",
  });

  // Load truck data into form when truck data is fetched
  useEffect(() => {
    if (truck) {
      setFormData({
        truckEid: truck.truckEid,
        make: truck.make,
        model: truck.model,
        year: truck.year.toString(),
        vin: truck.vin,
        bodyType: truck.bodyType,
      });
      setError(null);
    }
  }, [truck]);

  // Handle error case if truck is null
  useEffect(() => {
    if (truck === null) {
      setError(`Truck with ID "${truckId}" not found`);
    }
  }, [truck, truckId]);

  if (truck === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-500">
              <IconAlertTriangle className="mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              The truck you&apos;re looking for might have been deleted or the
              ID is incorrect.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/trucks")}
              className="flex items-center"
            >
              <IconArrowLeft className="mr-2 size-4" />
              Back to Trucks
            </Button>
          </CardContent>
        </Card>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      await updateTruck({
        truckId: truck._id,
        truckEid: formData.truckEid,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        vin: formData.vin,
        bodyType: formData.bodyType,
      });

      setIsEditing(false);
      alert("Truck information updated successfully");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update truck information";
      alert(errorMessage);
      console.error("Error updating truck:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      truckEid: truck.truckEid,
      make: truck.make,
      model: truck.model,
      year: truck.year.toString(),
      vin: truck.vin,
      bodyType: truck.bodyType,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-row items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/trucks")}
        >
          <IconArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Truck Details</h1>
      </div>

      {/* Truck Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center gap-2">
              <IconTruck className="size-6" />
              {isEditing ? (
                <Input
                  name="truckEid"
                  value={formData.truckEid}
                  onChange={handleInputChange}
                  className="w-48"
                />
              ) : (
                truck.truckEid
              )}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {isEditing ? (
                <Select
                  value={formData.bodyType}
                  onValueChange={(value) =>
                    handleSelectChange(value, "bodyType")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Box Truck">Box Truck</SelectItem>
                    <SelectItem value="Semi">Semi</SelectItem>
                    <SelectItem value="Flatbed">Flatbed</SelectItem>
                    <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                    <SelectItem value="Tanker">Tanker</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                truck.bodyType
              )}
            </Badge>
            {!isEditing && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <IconEdit className="size-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make" className="font-semibold">
                Make
              </Label>
              {isEditing ? (
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{truck.make}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model" className="font-semibold">
                Model
              </Label>
              {isEditing ? (
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{truck.model}</p>
              )}
            </div>
            <div>
              <Label htmlFor="year" className="font-semibold">
                Year
              </Label>
              {isEditing ? (
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  type="number"
                />
              ) : (
                <p>{truck.year}</p>
              )}
            </div>
            <div>
              <Label htmlFor="vin" className="font-semibold">
                VIN
              </Label>
              {isEditing ? (
                <Input
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{truck.vin}</p>
              )}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center"
            >
              <IconX className="mr-2 size-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              className="flex items-center"
            >
              <IconCheck className="mr-2 size-4" />
              Save
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Vendors Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="size-5" />
            Vendor Service History
          </CardTitle>
          <CardDescription>
            Vendors that have serviced this truck
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No vendors have serviced this truck yet
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {vendors.map((vendor) => (
                <Card key={vendor._id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconBuilding className="size-5" />
                      <span className="font-medium">{vendor.name}</span>
                    </div>
                    <Link href={`/dashboard/vendors/${vendor.vendorEid}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Phone:
                        </span>
                        <p>{vendor.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Location:
                        </span>
                        <p>
                          {vendor.city}, {vendor.state}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconReceipt className="size-5" />
            Maintenance & Service History
          </CardTitle>
          <CardDescription>Invoices related to this truck</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No invoices found for this truck
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {invoices.map((invoice) => (
                <Card key={invoice._id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconReceipt className="size-5" />
                      <span className="font-medium">
                        Invoice #{invoice.invoiceEid}
                      </span>
                    </div>
                    <Link href={`/dashboard/invoices/${invoice.invoiceEid}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Date:
                        </span>
                        <p>{formatDate(invoice.dateIssued)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Amount:
                        </span>
                        <p>{formatCurrency(invoice.totalAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Status:
                        </span>
                        <Badge
                          className={cn(
                            "rounded-full px-2 py-1 text-xs font-semibold",
                            invoice.status === "need_action"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800",
                          )}
                        >
                          {invoice.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
