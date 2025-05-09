import { Bot, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { InvoiceAnalysis } from "../page";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AIAnalysisCardProps {
  invoiceId: string;
  analysis?: InvoiceAnalysis;
  isUpdated: boolean;
  onUpdate: (updatedData: { analysis: InvoiceAnalysis }) => void;
}

export default function AIAnalysisCard({
  invoiceId,
  analysis: initialAnalysis,
  isUpdated,
  onUpdate,
}: AIAnalysisCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InvoiceAnalysis | undefined>(
    initialAnalysis,
  );
  const [error] = useState<Error | null>(null);

  // Fetch analysis from API if not provided
  const queryResult = useQuery(api.invoices.getInvoiceAnalysis, { invoiceId });
  const isQueryLoading = queryResult === undefined;

  // Update analysis when query result changes
  useEffect(() => {
    if (queryResult && !isLoading && !analysis) {
      setAnalysis(queryResult);
    }
  }, [queryResult, isLoading, analysis]);

  const handleRefreshAnalysis = () => {
    setIsLoading(true);

    // Simulate API call to refresh AI analysis
    setTimeout(() => {
      const refreshedAnalysis = {
        businessRule: "Rule T-103: Preventive maintenance frequency",
        escalationReason: "Maintenance frequency higher than expected",
        issues: [
          "Preventive maintenance performed before scheduled date",
          "Previous maintenance record shows service 45 days ago",
          "Company policy requires 90 days between preventive maintenance",
        ],
        description:
          "This invoice contains maintenance services that were performed too soon after the previous service, violating the company's maintenance schedule policy.",
        items: analysis?.items || [],
      };

      setAnalysis(refreshedAnalysis);
      onUpdate({ analysis: refreshedAnalysis });
      setIsLoading(false);
      toast.success("AI analysis refreshed");
    }, 1500);
  };

  if (!analysis && (isLoading || isQueryLoading)) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border shadow-sm ${isUpdated ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            AI Analysis
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefreshAnalysis}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis ? (
          <>
            <div>
              <span className="text-sm font-medium">Business Rule:</span>
              <Badge variant="outline" className="ml-2">
                {analysis.businessRule}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium">Escalation Reason:</span>
              <p className="text-sm mt-1 text-red-600 dark:text-red-400">
                {analysis.escalationReason}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Issues:</span>
              <ul className="mt-1 space-y-1 text-sm list-disc pl-5">
                {analysis.issues.map((issue, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
            {analysis.description && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {analysis.description}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Bot className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            {error ? (
              <>
                <p className="text-sm text-red-500 mb-2">
                  {error.message || "Failed to load analysis"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  No AI analysis available for this invoice yet.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={handleRefreshAnalysis}
                  disabled={isLoading || isQueryLoading}
                >
                  {isLoading || isQueryLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Analysis
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
