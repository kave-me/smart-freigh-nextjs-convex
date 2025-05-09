import { useState } from "react";
import { FileText, Edit, Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface BasicInfoCardProps {
  invoiceId: string;
  onUpdate: (updatedData: any) => void;
  isUpdated: boolean;
}

export default function BasicInfoCard({
  invoiceId,
  onUpdate,
  isUpdated,
}: BasicInfoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch invoice data
  const invoice = useQuery(api.invoices.getById, { id: invoiceId });
  
  // Fetch vendor data if we have a vendorId
  const vendorData = invoice?.vendorId 
    ? useQuery(api.vendors.getById, { id: invoice.vendorId }) 
    : null;
  
  // Fetch truck data if we have a truckId
  const truckData = invoice?.truckId 
    ? useQuery(api.trucks.getById, { id: invoice.truckId }) 
    : null;
  
  // Loading state
  if (!invoice && !isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[220px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If we have data, use it; otherwise, use placeholders
  const data = {
    vendorName: vendorData?.name || "Hermiston, Krieger and West",
    truckId: truckData?.id || "k97cyd1sz34cdcvexdmg8ghq97icf9e",
    issueDate: invoice?.dateIssued ? new Date(invoice.dateIssued).toISOString().split('T')[0] : "2025-05-02",
    fuelType: invoice?.fuelType || "Diesel",
    mileage: invoice?.mileage || "45,892",
    totalPrice: invoice?.totalAmount ? `$${invoice.totalAmount.toFixed(2)}` : "$4624.63",
    assignedDriver: 'N/A', // This would come from a drivers table
  };
  
  const [editableData, setEditableData] = useState({ ...data });
  
  // Handler for edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        onUpdate({
          vendorName: editableData.vendorName,
          truckId: editableData.truckId,
          issueDate: editableData.issueDate,
          fuelType: editableData.fuelType,
          mileage: editableData.mileage,
          totalPrice: editableData.totalPrice,
          assignedDriver: editableData.assignedDriver,
        });
        setIsLoading(false);
        setIsEditing(false);
        toast.success("Basic info updated");
      }, 1000);
    } else {
      setIsEditing(true);
    }
  };
  
  // Handler for input changes
  const handleInputChange = (field: string, value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={`shadow-md transition-all duration-200 ${isUpdated ? "border-green-500 bg-green-50/50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Basic Info
        </CardTitle>
        <Button
          onClick={handleEditToggle}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vendorName">Vendor Name:</Label>
            {isEditing ? (
              <Input
                id="vendorName"
                value={editableData.vendorName}
                onChange={(e) => handleInputChange("vendorName", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.vendorName}</div>
            )}
          </div>
          <div>
            <Label htmlFor="truckId">Truck ID:</Label>
            {isEditing ? (
              <Input
                id="truckId"
                value={editableData.truckId}
                onChange={(e) => handleInputChange("truckId", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.truckId}</div>
            )}
          </div>
          <div>
            <Label htmlFor="assignedDriver">Assigned Driver:</Label>
            {isEditing ? (
              <Input
                id="assignedDriver"
                value={editableData.assignedDriver}
                onChange={(e) => handleInputChange("assignedDriver", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.assignedDriver}</div>
            )}
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date:</Label>
            {isEditing ? (
              <Input
                id="issueDate"
                type="date"
                value={editableData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.issueDate}</div>
            )}
          </div>
          <div>
            <Label htmlFor="fuelType">Fuel Type:</Label>
            {isEditing ? (
              <Input
                id="fuelType"
                value={editableData.fuelType}
                onChange={(e) => handleInputChange("fuelType", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.fuelType}</div>
            )}
          </div>
          <div>
            <Label htmlFor="mileage">Mileage:</Label>
            {isEditing ? (
              <Input
                id="mileage"
                value={editableData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1">{data.mileage}</div>
            )}
          </div>
          <div>
            <Label htmlFor="totalPrice">Total Price:</Label>
            {isEditing ? (
              <Input
                id="totalPrice"
                value={editableData.totalPrice}
                onChange={(e) => handleInputChange("totalPrice", e.target.value)}
              />
            ) : (
              <div className="text-sm mt-1 font-bold">{data.totalPrice}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}