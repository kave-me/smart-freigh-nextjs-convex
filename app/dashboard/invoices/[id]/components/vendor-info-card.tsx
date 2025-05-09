import { useState } from "react";
import {
  Building,
  PenLine,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface VendorInfoCardProps {
  vendorId: Id<"vendors"> | string;
  vendorDetails: {
    vendorName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  onUpdate: (
    updatedData: Partial<VendorInfoCardProps["vendorDetails"]>,
  ) => void;
  isUpdated: boolean;
}

export default function VendorInfoCard({
  vendorId,
  vendorDetails: initialVendorDetails,
  onUpdate,
  isUpdated,
}: VendorInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get the updateVendor mutation
  const updateVendor = useMutation(api.vendors.updateVendor);

  // Initialize with defaults or provided values
  const defaultVendorDetails = {
    vendorName: "Hermiston, Kreiger and West",
    contactPerson: "John Smith",
    email: "contact@hkw.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
  };

  const vendorDetails = initialVendorDetails || defaultVendorDetails;

  const [editableVendorDetails, setEditableVendorDetails] =
    useState(vendorDetails);

  // Handler for cancel button
  const handleCancel = () => {
    setEditableVendorDetails(vendorDetails);
    setIsEditing(false);
    toast.info("Edit canceled");
  };

  // Handler for edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setIsLoading(true);

      // If we have a valid ID (not a string), update in the database
      if (typeof vendorId === "object") {
        console.log(
          "Updating vendor with ID:",
          vendorId,
          "and payload:",
          editableVendorDetails,
        );

        try {
          // Call the Convex mutation
          updateVendor({
            vendorId,
            vendorEid: editableVendorDetails.vendorName,
            name: editableVendorDetails.vendorName,
            address: editableVendorDetails.address,
            phone: editableVendorDetails.phone,
            // Map other fields as needed
          })
            .then(() => {
              onUpdate(editableVendorDetails);
              setIsLoading(false);
              setIsEditing(false);
              setSaveSuccess(true);
              // Reset success state after animation
              setTimeout(() => setSaveSuccess(false), 3000);
              toast.success("Vendor info updated in database");
            })
            .catch((error) => {
              console.error("Error updating vendor:", error);
              setIsLoading(false);
              toast.error(`Failed to update: ${error.message}`);
            });
        } catch (err) {
          console.error("Exception when calling updateVendor:", err);
          setIsLoading(false);
          toast.error(
            `Error: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      } else {
        // Simulate API call if we don't have a valid ID
        console.log("No valid vendor ID, simulating update");
        setTimeout(() => {
          onUpdate(editableVendorDetails);
          setIsLoading(false);
          setIsEditing(false);
          setSaveSuccess(true);
          // Reset success state after animation
          setTimeout(() => setSaveSuccess(false), 3000);
          toast.success("Vendor info updated successfully");
        }, 1000);
      }
    } else {
      setIsEditing(true);
    }
  };

  // Handler for field changes
  const handleFieldChange = (
    field: keyof NonNullable<VendorInfoCardProps["vendorDetails"]>,
    value: string,
  ) => {
    setEditableVendorDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card
      className={`border shadow-sm transition-colors ${isUpdated || saveSuccess ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Service Provider Information
          </CardTitle>
          <div className="flex gap-1">
            {isEditing && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-red-500"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "ghost"}
              size="icon"
              onClick={handleEditToggle}
              disabled={isLoading}
              title={isEditing ? "Save" : "Edit"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <PenLine className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vendor Name</Label>
            {isEditing ? (
              <Input
                value={editableVendorDetails.vendorName}
                onChange={(e) =>
                  handleFieldChange("vendorName", e.target.value)
                }
                className="h-9"
              />
            ) : (
              <div className="text-sm py-1.5 font-medium">
                {vendorDetails.vendorName}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contact Person</Label>
            {isEditing ? (
              <Input
                value={editableVendorDetails.contactPerson}
                onChange={(e) =>
                  handleFieldChange("contactPerson", e.target.value)
                }
                className="h-9"
              />
            ) : (
              <div className="text-sm py-1.5">
                {vendorDetails.contactPerson}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1.5 opacity-70" />
              Email
            </Label>
            {isEditing ? (
              <Input
                value={editableVendorDetails.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="h-9"
              />
            ) : (
              <div className="text-sm py-1.5 text-blue-600 dark:text-blue-400">
                {vendorDetails.email}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1.5 opacity-70" />
              Phone
            </Label>
            {isEditing ? (
              <Input
                value={editableVendorDetails.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                className="h-9"
              />
            ) : (
              <div className="text-sm py-1.5">{vendorDetails.phone}</div>
            )}
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="text-sm font-medium">Address</Label>
            {isEditing ? (
              <Input
                value={editableVendorDetails.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                className="h-9"
              />
            ) : (
              <div className="text-sm bg-muted/30 p-2 rounded-md">
                {vendorDetails.address}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
