import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useTrucksQuery() {
  // Query all non-archived trucks
  const trucks = useQuery(api.trucks.getAllTrucks);

  return {
    trucks,
    isLoading: trucks === undefined,
  };
}