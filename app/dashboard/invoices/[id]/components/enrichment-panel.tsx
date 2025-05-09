import { useState } from "react";
import { X, Save } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InvoiceItem } from "../page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EnrichmentOption {
  id: string;
  className: string;
  description: string;
  unitCost: number;
}

interface EnrichmentPanelProps {
  item: InvoiceItem;
  onClose: () => void;
  onSave: (updatedItem: InvoiceItem) => void;
}

export default function EnrichmentPanel({
  item,
  onClose,
  onSave,
}: EnrichmentPanelProps) {
  // Create a copy of the item for editing
  const [editedItem, setEditedItem] = useState<InvoiceItem>({ ...item });
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSave = () => {
    // Validate fields if needed
    if (!editedItem.description) {
      toast.error("Description is required");
      return;
    }

    // Call the parent save handler with the updated item
    onSave(editedItem);
    toast.success("Item updated successfully");
  };

  const handleFieldChange = (
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
      // Recalculate total cost when quantity or unitCost changes
      ...(field === "quantity" || field === "unitCost"
        ? {
            totalCost:
              field === "quantity"
                ? Number(value) * prev.unitCost
                : prev.quantity * Number(value),
          }
        : {}),
    }));
  };

  const handleItemSelect = (option: EnrichmentOption) => {
    setEditedItem({
      ...editedItem,
      description: option.description,
      unitCost: option.unitCost,
      totalCost: option.unitCost * editedItem.quantity,
    });
    setSelectedOption(option.description);
  };

  // Sample items for the enrichment panel - in a real app, this would come from an API
  const enrichmentOptions: EnrichmentOption[] = [
    {
      id: "1",
      className: "bg-green-500",
      description: "3-in-1 Airline Set with Gladhands (15 feet)",
      unitCost: 165,
    },
    {
      id: "2",
      className: "bg-orange-500",
      description: "2-in-1 Airline Set with Gladhands (15 feet)",
      unitCost: 100,
    },
    { id: "3", className: "bg-red-500", description: "None", unitCost: 0 },
  ];

  return (
    <Card
      className="fixed inset-0 z-50 bg-white dark:bg-gray-950 overflow-auto"
      style={{
        maxWidth: "800px",
        maxHeight: "80vh",
        margin: "auto",
        top: "10vh",
      }}
    >
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Enrich Item</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4">
          <Label>Original Description</Label>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            {item.description}
          </div>
        </div>

        <div className="grid gap-4">
          <Label>Please choose one of the items below</Label>
          <RadioGroup value={selectedOption} className="space-y-3">
            {enrichmentOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-3 p-3 border rounded-md"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${option.className}`}
                >
                  {option.id}
                </div>
                <RadioGroupItem
                  value={option.description}
                  id={`option-${option.id}`}
                  onClick={() => handleItemSelect(option)}
                />
                <div className="grid grid-cols-3 w-full gap-2">
                  <div>{option.description}</div>
                  <div className="text-center">1</div>
                  <div className="text-right">${option.unitCost}</div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid gap-4">
          <Label htmlFor="description">Enriched Description</Label>
          <Input
            id="description"
            value={editedItem.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={editedItem.quantity}
              onChange={(e) =>
                handleFieldChange("quantity", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="unitCost">Unit Cost ($)</Label>
            <Input
              id="unitCost"
              type="number"
              value={editedItem.unitCost}
              onChange={(e) =>
                handleFieldChange("unitCost", parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="totalCost">Total Cost ($)</Label>
          <Input
            id="totalCost"
            type="number"
            value={editedItem.totalCost}
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">
            Automatically calculated based on quantity and unit cost
          </p>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Add any additional information about this item..."
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
