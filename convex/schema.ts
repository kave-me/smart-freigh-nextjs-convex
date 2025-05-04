import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  vendors: defineTable({
    vendorEid: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.string(),
    userId: v.id("users"),
    isArchived: v.boolean(),
  }),
  trucks: defineTable({
    truckEid: v.string(),
    make: v.string(),
    bodyType: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    userId: v.id("users"),
    isArchived: v.boolean(),
  })
});
