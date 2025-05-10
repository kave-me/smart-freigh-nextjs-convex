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
  IconBuilding,
  IconEdit,
  IconCheck,
  IconX,
  IconPhone,
  IconMapPin,
  IconAlertTriangle,
  IconArrowLeft,
  IconTruck,
  IconReceipt,
} from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;
  const vendor = useQuery(api.vendors.getById, { id: vendorId });
  const trucks =
    useQuery(api.vendors.getTrucksByVendorId, { vendorEid: vendorId }) || [];
  const invoices =
    useQuery(api.vendors.getInvoicesByVendorId, { vendorEid: vendorId }) || [];
  const updateVendor = useMutation(api.vendors.updateVendor);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    vendorEid: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Load vendor data into form when vendor data is fetched
  useEffect(() => {
    if (vendor) {
      setFormData({
        vendorEid: vendor.vendorEid,
        name: vendor.name,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipCode: vendor.zipCode,
        phone: vendor.phone,
      });
      setError(null);
    }
  }, [vendor]);

  // Handle error case if vendor is null
  useEffect(() => {
    if (vendor === null) {
      setError(`Vendor with ID "${vendorId}" not found`);
    }
  }, [vendor, vendorId]);

  if (vendor === undefined) {
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
              The vendor you&apos;re looking for might have been deleted or the
              ID is incorrect.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/vendors")}
              className="flex items-center"
            >
              <IconArrowLeft className="mr-2 size-4" />
              Back to Vendors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendor === null) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-muted-foreground">Vendor not found</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await updateVendor({
        vendorId: vendor._id,
        vendorEid: formData.vendorEid,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
      });

      setIsEditing(false);
      alert("Vendor information updated successfully");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update vendor information";
      alert(errorMessage);
      console.error("Error updating vendor:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      vendorEid: vendor.vendorEid,
      name: vendor.name,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      zipCode: vendor.zipCode,
      phone: vendor.phone,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-row items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/vendors")}
        >
          <IconArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Vendor Details</h1>
      </div>

      {/* Vendor Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center gap-2">
              <IconBuilding className="size-6" />
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-48"
                />
              ) : (
                vendor.name
              )}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Vendor ID: {vendor.vendorEid}</Badge>
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
              <Label htmlFor="address" className="font-semibold">
                Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="flex items-center gap-2">
                  <IconMapPin className="size-4 text-muted-foreground" />
                  {vendor.address}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="font-semibold">
                Phone
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="flex items-center gap-2">
                  <IconPhone className="size-4 text-muted-foreground" />
                  {vendor.phone}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city" className="font-semibold">
                City
              </Label>
              {isEditing ? (
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{vendor.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state" className="font-semibold">
                State
              </Label>
              {isEditing ? (
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{vendor.state}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode" className="font-semibold">
                ZIP Code
              </Label>
              {isEditing ? (
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{vendor.zipCode}</p>
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

      {/* Trucks Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTruck className="size-5" />
            Serviced Equipment
          </CardTitle>
          <CardDescription>Trucks serviced by this vendor</CardDescription>
        </CardHeader>
        <CardContent>
          {trucks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No trucks serviced by this vendor yet
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {trucks.map((truck) => (
                <Card key={truck._id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconTruck className="size-5" />
                      <span className="font-medium">
                        {truck.make} {truck.model}
                      </span>
                    </div>
                    <Link href={`/dashboard/trucks/${truck.truckEid}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Year:
                        </span>
                        <p>{truck.year}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Type:
                        </span>
                        <p>{truck.bodyType}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          ID:
                        </span>
                        <p>{truck.truckEid}</p>
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
            Service History
          </CardTitle>
          <CardDescription>Service invoices from this vendor</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No invoices from this vendor yet
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
