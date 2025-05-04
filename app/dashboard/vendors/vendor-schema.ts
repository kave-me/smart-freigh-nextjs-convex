import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

// Define the schema for the vendor data
export const vendorSchema = z.object({
  id: z.string(),
  vendorEid: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  isArchived: z.boolean(),
});

export type Vendor = z.infer<typeof vendorSchema>;