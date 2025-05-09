"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { VendorSectionCards } from "./vendor-section-cards";
import { VendorsDataTable } from "./vendors-data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function VendorsPage() {
  const vendors = useQuery(api.vendors.getAllVendors, {});
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState(vendors || []);
  const router = useRouter();

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

  const handleCreateVendor = () => {
    // Navigate to vendor creation page
    router.push("/dashboard/vendors/new");
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateVendor} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          New Vendor
        </Button>
      </div>

      <VendorSectionCards vendors={filteredVendors} isLoading={isLoading} />
      <VendorsDataTable data={filteredVendors || []} />
    </div>
  );
}
