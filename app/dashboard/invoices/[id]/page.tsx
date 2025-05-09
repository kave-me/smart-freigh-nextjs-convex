"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import AIAnalysisCard from "./components/ai-analysis-card";
import PartsLaborCard from "./components/parts-labor-card";
import TruckInfoCard from "./components/truck-info-card";
import VendorInfoCard from "./components/vendor-info-card";
import HumanNotesCard from "./components/human-note-card";
import EscalationEmailCard from "./components/escalation-email-card";
import EnrichCard from "./components/enrich-card";
import { Id } from "@/convex/_generated/dataModel";
import { StatusBadge, InvoiceStatus } from "@/app/hooks/use-status-badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface InvoiceItem {
  id?: string;
  description: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  enriched?: boolean;
}

export interface InvoiceAnalysis {
  businessRule: string;
  escalationReason: string;
  issues: string[];
  description?: string;
  items?: Array<{ description: string }>;
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [updatedComponent, setUpdatedComponent] = useState<string | null>(null);

  // Fetch the invoice data to get the current status
  const invoice = useQuery(api.invoices.getInvoiceById, {
    invoiceId: id as string,
  });

  // Default status if the invoice is not loaded yet
  const currentStatus = invoice?.status || "needs_review";

  // These would normally come from your database
  // For now, we'll use mock IDs for demonstration that match Convex's ID format
  // Format is tableName_randomString
  // Type casting is only for development - real IDs would be fetched from the DB
  const mockTruckId = "01234567890123456789abcd" as unknown as Id<"trucks">;
  const mockVendorId = "01234567890123456789abcd" as unknown as Id<"vendors">;

  // Handle status change from badge
  const handleStatusChange = (newStatus: InvoiceStatus) => {
    console.log(`Invoice status changing to: ${newStatus}`);
    // Any additional processing needed on status change
  };

  // Update invoice details when a component makes changes
  const updateInvoiceDetails = (
    updatedData: unknown,
    componentName: string,
  ) => {
    // In a real app, you would update the actual data and make an API call
    console.log(`Updating ${componentName} with:`, updatedData);

    // Mark this component as updated
    setUpdatedComponent(componentName);

    // Reset updated component after 2 seconds
    setTimeout(() => {
      setUpdatedComponent(null);
    }, 2000);
  };

  // Handle escalation
  const handleEscalate = () => {
    // Update the component state
    setUpdatedComponent("escalation");

    // Reset updated component after 2 seconds
    setTimeout(() => {
      setUpdatedComponent(null);
    }, 2000);
  };

  return (
    <div className="container p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Invoice #{id}</h1>
          <StatusBadge
            invoiceId={id}
            initialStatus={currentStatus as InvoiceStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
        <Button variant="default" onClick={handleEscalate}>
          Escalate Invoice
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Invoice Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Overview</CardTitle>
            <CardDescription>
              Summary of this invoice and its current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <p>
                  {currentStatus
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Invoice ID:
                </span>
                <p>{id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created:</span>
                <p>
                  {invoice?._creationTime
                    ? new Date(invoice._creationTime).toLocaleDateString()
                    : "Loading..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Information Card */}
          <TruckInfoCard
            truckId={mockTruckId}
            truckDetails={null}
            onUpdate={(data) => updateInvoiceDetails(data, "truck-info")}
            isUpdated={updatedComponent === "truck-info"}
          />

          {/* Service Provider Information Card */}
          <VendorInfoCard
            vendorId={mockVendorId}
            vendorDetails={null}
            onUpdate={(data) => updateInvoiceDetails(data, "vendor-info")}
            isUpdated={updatedComponent === "vendor-info"}
          />
        </div>

        {/* Invoice Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parts and Labor Card */}
          <PartsLaborCard
            invoiceId={id as string}
            onUpdate={(data) => updateInvoiceDetails(data, "parts-labor")}
            isUpdated={updatedComponent === "parts-labor"}
          />

          {/* Data Enrichment Card */}
          <EnrichCard
            invoiceId={id as string}
            onUpdate={(data) => updateInvoiceDetails(data, "enrich")}
            isUpdated={updatedComponent === "enrich"}
          />
        </div>

        {/* Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Analysis Card */}
          <AIAnalysisCard
            invoiceId={id as string}
            analysis={undefined}
            isUpdated={updatedComponent === "ai-analysis"}
            onUpdate={(data) => updateInvoiceDetails(data, "ai-analysis")}
          />

          {/* Human Notes Card */}
          <HumanNotesCard
            notes=""
            onUpdate={(notes) => {
              updateInvoiceDetails({ humanNotes: notes }, "human-notes");
              setUpdatedComponent(null);
            }}
            isUpdated={updatedComponent === "human-notes"}
          />
        </div>

        {/* Escalation Section */}
        <EscalationEmailCard
          escalationEmail={undefined}
          invoiceId={id as string}
          onEscalate={handleEscalate}
          onUpdate={(data) => updateInvoiceDetails(data, "escalation-email")}
          isUpdated={updatedComponent === "escalation-email"}
        />
      </div>
    </div>
  );
}
