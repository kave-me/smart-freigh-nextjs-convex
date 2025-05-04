import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  vendors: defineTable({
    vendorEid: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.string(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  trucks: defineTable({
    truckEid: v.string(),
    make: v.string(),
    bodyType: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  invoices: defineTable({
    invoiceEid: v.string(),
    vendorId: v.id("vendors"),
    truckId: v.id("trucks"),
    dateIssued: v.number(),
    totalAmount: v.number(),
    serviceReason: v.string(),
    notes: v.optional(v.string()),
    status: v.object({
      type: v.union(
        v.literal("pending"),
        v.literal("needs_review"),
        v.literal("escalated"),
        v.literal("completed")
      ),
      updatedAt: v.number(),
      isFinalized: v.boolean(),
    }),
    analysis: v.optional(v.object({
      description: v.string(),
      timestamp: v.number(),
      items: v.array(v.object({
        description: v.string(),
        weight: v.number(),
      })),
    })),
    escalation: v.optional(v.object({
      reason: v.string(),
      timestamp: v.number(),
      resolved: v.boolean(),
      resolvedAt: v.optional(v.number()),
    })),
    userId: v.id("users"),
  })
    .index("by_userId", ["userId"])
    .index("by_vendorId", ["vendorId"])
    .index("by_truckId", ["truckId"])
    .index("by_status", ["status.type"]),

  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    unitCost: v.number(),
    total: v.number(),
  }).index("by_invoice", ["invoiceId"]),
},{schemaValidation: false,});
