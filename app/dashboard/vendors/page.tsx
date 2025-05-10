"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { VendorSectionCards } from "./vendor-section-cards";
import { VendorsDataTable } from "./vendors-data-table";

export default function VendorsPage() {
  const vendors = useQuery(api.vendors.getAllVendors, {});
  const [isLoading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState(vendors || []);

  useEffect(() => {
    if (vendors !== undefined) {
      setLoading(false);
      setFilteredVendors(vendors);
    }
  }, [vendors]);

  useEffect(() => {
    if (!vendors) return;

    if (searchTerm === "") {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.vendorEid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.state.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredVendors(filtered);
    }
  }, [searchTerm, vendors]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <VendorSectionCards vendors={filteredVendors} isLoading={isLoading} />
      <VendorsDataTable data={filteredVendors || []} />
    </div>
  );
}
