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
  }),
  invoices: defineTable({
    invoiceEid: v.string(),
    vendorId: v.id("vendors"),
    truckId: v.id("trucks"),
    dateIssued: v.number(), // Timestamp in milliseconds
    totalAmount: v.number(),
    serviceReason: v.string(),
    notes: v.string(),
    statusId: v.id("statuses"),
    userId: v.id("users"),
    items: v.id("invoiceItems"),
  })
    .index("by_userId", ["userId"])
    .index("by_vendorId", ["vendorId"])
    .index("by_truckId", ["truckId"])
    .index("by_statusId", ["statusId"]),
  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    unitCost: v.number(),
    total: v.number(),
  })
    .index("by_invoice", ["invoiceId"]),
  statuses: defineTable({
    type: v.string(), // no issues | need action | escalated
    timestamp: v.number(),
  }).index("by_type", ["type"]),
  analyses: defineTable({
    description: v.object({}),
    timestamp: v.number(),
  }),
  analysesItems: defineTable({
    analysesId: v.id("analyses"),
    description: v.string(),
    weight: v.number(), // from 0 to 1
  })
});
