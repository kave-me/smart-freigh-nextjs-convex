"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounce } from "@/lib/hooks/use-debounce";

// Status definitions according to schema
export const STATUS_COLORS = {
  need_action: "bg-yellow-500",
  escalated: "bg-purple-500",
};

export type InvoiceStatus = keyof typeof STATUS_COLORS;

export const STATUS_ORDER: InvoiceStatus[] = ["need_action", "escalated"];

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
          toast.success(
            `Invoice status updated to ${getStatusLabel(debouncedStatus)}`,
          );
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

  // Helper to get user-friendly status labels
  const getStatusLabel = (status: InvoiceStatus): string => {
    switch (status) {
      case "need_action":
        return "Needs Action";
      case "escalated":
        return "Escalated";
      default:
        return status;
    }
  };

  return (
    <Badge
      className={`cursor-pointer select-none ${STATUS_COLORS[status]} ${className}`}
      onClick={handleBadgeClick}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
