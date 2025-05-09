"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { InvoiceSectionCards } from "./invoice-section-cards";
import { InvoicesDataTable } from "./invoices-data-table";

export default function InvoicesPage() {
  // Fetch all invoices from the database
  const invoices = useQuery(api.invoices.getAllInvoices, {});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (invoices !== undefined) {
      setLoading(false);
    }
  }, [invoices]);

  return (
    <div className="space-y-6 p-6">
      <InvoiceSectionCards invoices={invoices} isLoading={isLoading} />
      <InvoicesDataTable data={invoices || []} />
    </div>
  );
}
