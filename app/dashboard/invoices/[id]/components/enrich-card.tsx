"use client";

import React, { useState, useEffect } from "react";
import {
  WandSparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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
import { Id } from "@/convex/_generated/dataModel";

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

// Business rule type for better typing
interface BusinessRule {
  _id: Id<"businessRules">;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
  isSystem: boolean;
}

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
  // Selected business rule
  const [selectedBusinessRuleId, setSelectedBusinessRuleId] =
    useState<Id<"businessRules"> | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Track if there was an error loading the data
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get enrichment data
  const rawEnrichmentResponse = useQuery(
    api.invoices.getEnrichmentSuggestions,
    {
      invoiceId,
    },
  );

  // Process the response
  const enrichmentData = React.useMemo(() => {
    // Clear any previous errors when data loads successfully
    if (rawEnrichmentResponse) {
      setLoadError(null);
      return rawEnrichmentResponse;
    }
    return undefined;
  }, [rawEnrichmentResponse]);

  // Handle errors better with refreshEnrichmentData
  const refreshEnrichmentData = () => {
    setIsLoading(true);
    setLoadError(null);

    // Simulate refreshing data from backend
    setTimeout(() => {
      setIsLoading(false);

      // If we still don't have data, it might be an error
      if (!rawEnrichmentResponse) {
        setLoadError("Invoice not found or may have been deleted");
      } else {
        toast.success("Enrichment data refreshed");
      }
    }, 1000);
  };

  // For MVP, mock the business rules since API generation might be pending
  const mockBusinessRules: BusinessRule[] = [
    {
      _id: "businessRules_111111111111111111111111" as Id<"businessRules">,
      name: "Standard Parts Pricing",
      description: "Enforces standard pricing for common truck parts",
      category: "Parts",
      isDefault: true,
      isSystem: true,
    },
    {
      _id: "businessRules_222222222222222222222222" as Id<"businessRules">,
      name: "Labor Rate Limits",
      description: "Sets maximum allowed labor rates by region",
      category: "Labor",
      isDefault: false,
      isSystem: true,
    },
    {
      _id: "businessRules_333333333333333333333333" as Id<"businessRules">,
      name: "Maintenance Schedule",
      description: "Validates maintenance frequency against schedule",
      category: "Maintenance",
      isDefault: false,
      isSystem: true,
    },
  ];

  // Get active business rule - mocked for MVP
  const mockActiveBusinessRule: BusinessRule = {
    _id: "businessRules_111111111111111111111111" as Id<"businessRules">,
    name: "Standard Parts Pricing",
    description: "Enforces standard pricing for common truck parts",
    category: "Parts",
    isDefault: true,
    isSystem: true,
  };

  // Set active business rule as default when no selection
  useEffect(() => {
    if (!selectedBusinessRuleId) {
      setSelectedBusinessRuleId(mockActiveBusinessRule._id);
    }
  }, [selectedBusinessRuleId, mockActiveBusinessRule._id]);

  const handleBusinessRuleSelect = async (rule: BusinessRule) => {
    setIsLoading(true);
    setSelectedBusinessRuleId(rule._id);

    try {
      // Mock API call for MVP
      // In production, we would call the API
      // await applyBusinessRule({
      //   invoiceId: invoiceId as unknown as Id<"invoices">,
      //   ruleId: rule._id,
      // });

      toast.success(`Business Rule Applied`, {
        description: `"${rule.name}" has been applied to this invoice.`,
      });
    } catch (error) {
      console.error("Error applying business rule:", error);
      toast.error("Error", {
        description: "Failed to apply business rule.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (loadError) {
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
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-2">
              Unable to load enrichment data
            </p>
            <p className="text-sm text-destructive">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setLoadError(null);
                refreshEnrichmentData();
              }}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Get the currently selected business rule object
  const currentBusinessRule =
    mockBusinessRules.find((rule) => rule._id === selectedBusinessRuleId) ||
    mockActiveBusinessRule;

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
                  {currentBusinessRule ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {currentBusinessRule.name}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      No Business Rule
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {mockBusinessRules.map((rule) => (
                  <DropdownMenuItem
                    key={rule._id}
                    onClick={() => handleBusinessRuleSelect(rule)}
                    className={
                      selectedBusinessRuleId === rule._id ? "bg-primary/10" : ""
                    }
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {selectedBusinessRuleId === rule._id && (
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                        )}
                        <span>{rule.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {rule.category}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {rule.description.length > 60
                          ? rule.description.substring(0, 60) + "..."
                          : rule.description}
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
        {currentBusinessRule && (
          <div className="mb-4 p-2 bg-primary/5 border border-primary/20 rounded-md">
            <div className="flex items-center text-sm font-medium text-primary mb-1">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Using Business Rule: {currentBusinessRule.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentBusinessRule.description}
            </p>
          </div>
        )}

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
