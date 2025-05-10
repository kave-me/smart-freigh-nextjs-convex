// import { DashboardMetrics } from "./dashboard-metrics";
// import { InvoiceAnalysisCharts } from "./dashboard-charts";
import { Metadata } from "next";
import UnderConstruction from "@/components/under-constuction";

export const metadata: Metadata = {
  title: "Dashboard | SmartFreight",
  description:
    "Manage your freight invoices and track escalations from your dashboard.",
};

export default function Page() {
  return (
    <div className="space-y-8 px-4 lg:px-6">
      {/* <DashboardMetrics /> */}
      {/* <div className="mt-8"> */}
      {/* <h2 className="text-3xl font-bold tracking-tight mb-6"> */}
      {/* Invoice Analysis */}
      {/* </h2> */}
      {/* <InvoiceAnalysisCharts /> */}
      {/* </div> */}
      <UnderConstruction />
    </div>
  );
}
