import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

// Define the schema for the vendor data
export const vendorSchema = z.object({
  _id: z.custom<Id<"vendors">>(),
  _creationTime: z.number(),
  vendorEid: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  userId: z.custom<Id<"users">>(),
});

// Frontend vendor type with renamed _id field for compatibility
export type Vendor = Omit<z.infer<typeof vendorSchema>, "_id"> & { id: string; userId: Id<"users"> };

// Helper function to convert Convex document to frontend format
export function convertVendorDocument(doc: z.infer<typeof vendorSchema>): Vendor {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id,
    userId: rest.userId,
  };
}
