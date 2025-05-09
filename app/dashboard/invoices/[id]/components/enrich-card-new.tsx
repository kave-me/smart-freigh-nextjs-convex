"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnrichCardProps {
  items: Array<{
    id: string;
    description: string;
    type: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    matchScore?: number;
  }>;
  onItemSelect: (item: any) => void;
}

interface EnrichmentOption {
  id: string;
  description: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  matchScore: number;
  variant: 'green' | 'orange' | 'red';
}

export default function EnrichCard({ items, onItemSelect }: EnrichCardProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Mock enrichment options for demonstration
  const enrichmentOptions: Record<string, EnrichmentOption[]> = {
    "1": [
      {
        id: "e1",
        description: "3-in-1 Airline Set with Gladhands (15 feet)",
        type: "Part",
        quantity: 1,
        unitCost: 165.00,
        totalCost: 165.00,
        matchScore: 95,
        variant: 'green'
      },
      {
        id: "e2",
        description: "2-in-1 Airline Set with Gladhands (15 feet)",
        type: "Part",
        quantity: 1,
        unitCost: 100.00,
        totalCost: 100.00,
        matchScore: 85,
        variant: 'orange'
      },
      {
        id: "e3",
        description: "Standard Airline Set (15 feet)",
        type: "Part",
        quantity: 1,
        unitCost: 75.00,
        totalCost: 75.00,
        matchScore: 75,
        variant: 'red'
      }
    ]
  };

  const handleItemClick = (item: any) => {
    setSelectedItemId(item.id);
    onItemSelect(item);
  };

  const getBadgeColor = (variant: EnrichmentOption['variant']) => {
    switch (variant) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'orange':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'red':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <CardTitle>Enrich</CardTitle>
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
              <TableHead className="text-right">Match Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={`cursor-pointer hover:bg-muted/50 ${selectedItemId === item.id ? "bg-muted/50" : ""}`}
              >
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2">
                      {item.description}
                      {item.matchScore && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {item.matchScore}%
                        </Badge>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[400px]">
                      {enrichmentOptions[item.id]?.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          onClick={() => handleItemClick({ ...item, ...option })}
                          className="flex flex-col items-start py-2"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="flex-1">{option.description}</span>
                            <Badge
                              variant="outline"
                              className={getBadgeColor(option.variant)}
                            >
                              {option.matchScore}%
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            ${option.unitCost.toFixed(2)} per unit
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ${item.unitCost.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${item.totalCost.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {item.matchScore && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      {item.matchScore}%
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}