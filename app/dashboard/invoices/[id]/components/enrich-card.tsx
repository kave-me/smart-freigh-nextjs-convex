"use client";

import React, { useState } from "react";
import { WandSparkles, RefreshCw, Database } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnrichmentItem {
  id: string;
  description: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  matchScore: number;
}

interface EnrichCardProps {
  invoiceId: string;
  onUpdate: (data: { selectedItem: EnrichmentItem | null }) => void;
  isUpdated: boolean;
}

// Template types for better typing
type EnrichmentTemplate = {
  id: string;
  name: string;
  description: string;
};

export default function EnrichCard({
  invoiceId,
  onUpdate,
  isUpdated,
}: EnrichCardProps) {
  // Store which dropdown is currently open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  // Track enriched items by their ID
  const [enrichedItems, setEnrichedItems] = useState<
    Record<string, EnrichmentItem | null>
  >({});
  // Selected template
  const [selectedTemplate, setSelectedTemplate] =
    useState<EnrichmentTemplate | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const enrichmentData = useQuery(api.invoices.getEnrichmentSuggestions, {
    invoiceId,
  });

  // Mock templates - in the future, these would come from the backend
  const enrichmentTemplates: EnrichmentTemplate[] = [
    {
      id: "parts",
      name: "Common Parts",
      description: "Standard automotive parts",
    },
    {
      id: "labor",
      name: "Labor Rates",
      description: "Common labor operations and rates",
    },
    {
      id: "maintenance",
      name: "Maintenance Kits",
      description: "Common preventive maintenance kits",
    },
  ];

  const handleTemplateSelect = (template: EnrichmentTemplate) => {
    setIsLoading(true);
    setSelectedTemplate(template);

    // Simulate loading template data from backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Template "${template.name}" applied`);
    }, 1000);
  };

  const refreshEnrichmentData = () => {
    setIsLoading(true);
    // Simulate refreshing data from backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Enrichment data refreshed");
    }, 1000);
  };

  if (!enrichmentData) {
    return (
      <Card
        className={cn(
          "col-span-2",
          isUpdated && "border-primary/50 bg-primary/5",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5" />
            <CardTitle className="text-lg font-medium">Enrich</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const items = enrichmentData?.items || [];

  const handleSuggestionSelect = (
    originalItemId: string,
    suggestion: EnrichmentItem | null,
  ) => {
    // Update the enriched items map
    setEnrichedItems((prev) => ({
      ...prev,
      [originalItemId]: suggestion,
    }));

    // Call the parent component's update function
    onUpdate({ selectedItem: suggestion });

    // Close the dropdown
    setOpenDropdownId(null);
  };

  // Helper function for badge color
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500 text-white";
    if (score >= 70) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  // Get display item (either enriched or original)
  const getDisplayItem = (originalItem: EnrichmentItem) => {
    return enrichedItems[originalItem.id] || originalItem;
  };

  return (
    <Card
      className={cn(
        "col-span-2",
        isUpdated && "border-primary/50 bg-primary/5",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5" />
            <CardTitle className="text-lg font-medium">Enrich</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Refresh enrichment data"
              onClick={refreshEnrichmentData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Database className="h-4 w-4" />
                  {selectedTemplate ? selectedTemplate.name : "Templates"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {enrichmentTemplates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex flex-col">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit cost</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((originalItem, index) => {
              // Get the display item (enriched or original)
              const displayItem = getDisplayItem(originalItem);
              const isEnriched = enrichedItems[originalItem.id] !== undefined;

              return (
                <React.Fragment key={originalItem.id}>
                  <DropdownMenu
                    open={openDropdownId === originalItem.id}
                    onOpenChange={(open) =>
                      setOpenDropdownId(open ? originalItem.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <TableRow
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          isEnriched && "bg-primary/5", // Highlight enriched rows
                        )}
                      >
                        <TableCell className="relative pl-8">
                          {displayItem.description}
                          {/* Numbered badge with proper positioning */}
                          <Badge
                            className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full px-0 flex items-center justify-center text-xs"
                            variant={isEnriched ? "secondary" : "default"}
                          >
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>{displayItem.type}</TableCell>
                        <TableCell className="text-right">
                          {displayItem.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${displayItem.unitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${displayItem.totalCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[600px] p-0 bg-black dark:bg-gray-900 border-gray-800"
                      align="start"
                      sideOffset={5}
                    >
                      <div className="p-4">
                        <p className="text-sm text-gray-400 mb-3">
                          Please choose one of the items below:
                        </p>
                        <div className="space-y-2">
                          {items.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="flex items-center p-2 hover:bg-gray-800/70 rounded-md cursor-pointer"
                              onClick={() =>
                                handleSuggestionSelect(
                                  originalItem.id,
                                  suggestion,
                                )
                              }
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-full flex items-center justify-center mr-3 shrink-0 text-xs",
                                  getBadgeColor(suggestion.matchScore),
                                )}
                              >
                                {suggestion.matchScore}%
                              </div>
                              <div className="min-w-36 text-white">
                                {suggestion.description}
                              </div>
                              <div className="min-w-16 text-center text-gray-400">
                                {suggestion.type}
                              </div>
                              <div className="min-w-16 text-center text-white">
                                {suggestion.quantity}
                              </div>
                              <div className="min-w-24 text-right text-white">
                                ${suggestion.unitCost.toFixed(2)}
                              </div>
                              <div className="min-w-24 ml-auto text-right text-white">
                                ${suggestion.totalCost.toFixed(2)}
                              </div>
                            </div>
                          ))}
                          <div
                            className="flex items-center p-2 hover:bg-gray-800/70 rounded-md cursor-pointer"
                            onClick={() =>
                              handleSuggestionSelect(originalItem.id, null)
                            }
                          >
                            <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 shrink-0 text-xs">
                              N/A
                            </div>
                            <div className="text-white">None</div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
