import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { convertVendorDocument } from "./vendor-schema";

export function useVendorsQuery() {
  const vendorDocs = useQuery(api.vendors.getVendorsByUser, {});
  const vendors = vendorDocs?.map(convertVendorDocument);
  return {
    vendors,
    isLoading: vendorDocs === undefined,
  };
}
