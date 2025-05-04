import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useVendorsQuery() {
  // Query all non-archived vendors
  // Changed from getVendors to getAllVendors to match the function name in vendors.ts
  const vendors = useQuery(api.vendors.getAllVendors);

  return {
    vendors,
    isLoading: vendors === undefined,
  };
}