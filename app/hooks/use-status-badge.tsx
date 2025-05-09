"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounce } from "@/lib/hooks/use-debounce";

// Status definitions
export const STATUS_COLORS = {
  needs_review: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  escalated: "bg-blue-500",
};

export type InvoiceStatus = keyof typeof STATUS_COLORS;

export const STATUS_ORDER: InvoiceStatus[] = [
  "needs_review",
  "approved",
  "rejected",
  "escalated",
];

interface StatusBadgeProps {
  invoiceId: Id<"invoices"> | string;
  initialStatus: InvoiceStatus;
  onStatusChange?: (newStatus: InvoiceStatus) => void;
  className?: string;
}

export function StatusBadge({
  invoiceId,
  initialStatus,
  onStatusChange,
  className = "",
}: StatusBadgeProps) {
  const [status, setStatus] = useState<InvoiceStatus>(initialStatus);
  const debouncedStatus = useDebounce<InvoiceStatus>(status, 500);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the updateInvoiceStatus mutation
  const updateInvoiceStatus = useMutation(api.invoices.updateInvoiceStatus);

  // Handle badge click to cycle through statuses
  const handleBadgeClick = () => {
    const currentIndex = STATUS_ORDER.indexOf(status);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    const newStatus = STATUS_ORDER[nextIndex];
    setStatus(newStatus);

    // Notify parent component immediately if needed
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // Update the status in the database when the debounced status changes
  useEffect(() => {
    if (debouncedStatus !== initialStatus && !isUpdating) {
      const updateStatus = async () => {
        try {
          setIsUpdating(true);
          await updateInvoiceStatus({
            invoiceId,
            status: debouncedStatus,
          });
          toast.success(`Invoice status updated to ${debouncedStatus}`);
        } catch (error) {
          console.error("Failed to update invoice status:", error);
          toast.error("Failed to update invoice status");
          // Revert to initial status on error
          setStatus(initialStatus);
        } finally {
          setIsUpdating(false);
        }
      };

      updateStatus();
    }
  }, [
    debouncedStatus,
    initialStatus,
    invoiceId,
    updateInvoiceStatus,
    isUpdating,
  ]);

  // Format status for display
  const formattedStatus = status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Badge
      className={`cursor-pointer select-none ${STATUS_COLORS[status]} ${className}`}
      onClick={handleBadgeClick}
    >
      {formattedStatus}
    </Badge>
  );
}
