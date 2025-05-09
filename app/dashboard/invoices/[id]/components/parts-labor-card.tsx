"use client";

import { Pencil, X, Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface PartsLaborCardProps {
  invoiceId: string;
  onUpdate: (updatedData: { items: Array<InvoiceItem> }) => void;
  isUpdated: boolean;
}

interface InvoiceItem {
  id: string;
  description: string;
  type: "Part" | "Labor";
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface DisplayItem extends Omit<InvoiceItem, "type"> {
  type: string;
}

export default function PartsLaborCard({
  invoiceId,
  onUpdate,
  isUpdated,
}: PartsLaborCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<InvoiceItem[]>([]);

  // Fetch invoice items data
  const items = useQuery(api.invoices.getInvoiceItems, { invoiceId });

  if (!items) {
    return (
      <Card className="col-span-2 border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              Parsed Parts and Labor
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultItems: DisplayItem[] = [
    {
      id: "1",
      description: "3-in-1 Airline Set with Gladhands (15 feet)",
      type: "Part",
      quantity: 1,
      unitCost: 175.0,
      totalCost: 175.0,
    },
    {
      id: "2",
      description: "3-in-1 Airline Set with Gladhands (15 feet)",
      type: "Labor",
      quantity: 1.5,
      unitCost: 103.0,
      totalCost: 155.99,
    },
  ];

  const displayItems = items || defaultItems;

  // Initialize edited items when entering edit mode
  const handleEditClick = () => {
    const validItems = displayItems.map((item) => ({
      ...item,
      type:
        item.type === "Part" || item.type === "Labor"
          ? item.type
          : ("Part" as const),
    })) as InvoiceItem[];
    setEditedItems(validItems);
    setIsEditing(true);
  };

  // Handle item updates
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...editedItems];
    const item = { ...newItems[index] };

    if (field === "quantity" || field === "unitCost") {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      item[field] = numValue;
      item.totalCost = item.quantity * item.unitCost;
    } else if (field === "type") {
      if (value === "Part" || value === "Labor") {
        item[field] = value;
      }
    } else if (field === "description") {
      item[field] = value as string;
    }

    newItems[index] = item;
    setEditedItems(newItems);
  };

  // Handle save
  const handleSave = async () => {
    try {
      // Temporarily log the items until the mutation is implemented
      console.log("Items to update:", editedItems);
      onUpdate({ items: editedItems });
      setIsEditing(false);
      toast.success("Parts and labor updated successfully");
    } catch (error) {
      toast.error("Failed to update parts and labor");
      console.error("Error updating items:", error);
    }
  };

  // Calculate totals
  const total = (isEditing ? editedItems : displayItems).reduce(
    (sum, item) => sum + item.totalCost,
    0,
  );

  const taxRate = 0.0875; // 8.75%
  const taxAmount = total * taxRate;
  const finalTotal = total + taxAmount;

  return (
    <Card
      className={`col-span-2 border shadow-sm ${isUpdated ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Parsed Parts and Labor
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit cost</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isEditing ? editedItems : displayItems).map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="w-full"
                    />
                  ) : (
                    item.description
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={item.type}
                      onValueChange={(value) =>
                        handleItemChange(index, "type", value)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Part">Part</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    item.type
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-[100px] text-right"
                      step="0.1"
                    />
                  ) : (
                    item.quantity
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={item.unitCost}
                      onChange={(e) =>
                        handleItemChange(index, "unitCost", e.target.value)
                      }
                      className="w-[100px] text-right"
                      step="0.01"
                    />
                  ) : (
                    `$${item.unitCost.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell className="text-right">
                  ${item.totalCost.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-medium">
                8.75% Tax
              </TableCell>
              <TableCell className="text-right">
                ${taxAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">
                ${finalTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
