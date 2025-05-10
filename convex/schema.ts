import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema(
  {
    ...authTables,
    users: defineTable({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      clerkId: v.string(),
      phone: v.optional(v.string()),
      image: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
    })
      .index("by_email", ["email"])
      .index("by_phone", ["phone"])
      .index("by_clerkId", ["clerkId"]),

    vendors: defineTable({
      vendorEid: v.string(),
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
      userId: v.id("users"),
    })
      .index("by_userId", ["userId"])
      .index("by_vendorEid", ["vendorEid"]),

    trucks: defineTable({
      truckEid: v.string(),
      make: v.string(),
      bodyType: v.string(),
      model: v.string(),
      year: v.number(),
      vin: v.string(),
      userId: v.id("users"),
    })
      .index("by_userId", ["userId"])
      .index("by_truckEid", ["truckEid"]),

    userSettings: defineTable({
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      phoneNumber: v.string(),
      profilePicture: v.optional(v.id("_storage")),
      theme: v.optional(v.string()),
      notificationPreferences: v.optional(
        v.object({
          emailNotifications: v.boolean(),
          smsNotifications: v.boolean(),
        }),
      ),
      businessSettings: v.optional(
        v.object({
          companyName: v.string(),
          companyAddress: v.string(),
          taxId: v.string(),
        }),
      ),
    }).index("by_userId", ["userId"]),

    // Email templates table
    emailTemplates: defineTable({
      userId: v.id("users"),
      name: v.string(),
      subject: v.string(),
      action: v.optional(v.string()),
      to: v.string(),
      from: v.string(),
      bcc: v.optional(v.string()),
      cc: v.optional(v.string()),
      company: v.optional(v.string()),
      phone: v.optional(v.string()),
      body: v.string(),
    }).index("by_userId", ["userId"]),

    invoices: defineTable({
      invoiceEid: v.string(),
      vendorId: v.id("vendors"),
      truckId: v.id("trucks"),
      userId: v.id("users"),
      dateIssued: v.number(),
      totalAmount: v.number(),
      notes: v.optional(v.string()),
      analysis: v.optional(
        v.object({
          description: v.string(),
          timestamp: v.number(),
          items: v.array(
            v.object({
              description: v.string(),
              weight: v.number(),
            }),
          ),
        }),
      ),
      items: v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitCost: v.number(),
          total: v.number(),
        }),
      ),
      status: v.union(v.literal("need_action"), v.literal("escalated")),
    })
      .index("by_userId", ["userId"])
      .index("by_vendorId", ["vendorId"])
      .index("by_truckId", ["truckId"])
      .index("by_invoiceEid", ["invoiceEid"])
      .index("by_status", ["status"]),

    // Business rule categories table
    businessRuleCategories: defineTable({
      name: v.string(),
      userId: v.id("users"),
    }).index("by_userId", ["userId"]),

    // Updated business rules table
    businessRules: defineTable({
      name: v.string(),
      categoryId: v.id("businessRuleCategories"),
      enabled: v.boolean(),
      fileId: v.optional(v.id("_storage")),
      userId: v.id("users"),
    })
      .index("by_userId", ["userId"])
      .index("by_categoryId", ["categoryId"]),

    //     updatedAt: v.number(),
    //     isFinalized: v.boolean(),
    //   }),
    // analysis: v.optional(v.object({
    //   description: v.string(),
    //   timestamp: v.number(),
    //   items: v.array(v.object({
    //     description: v.string(),
    //     weight: v.number(),
    //   })),
    // })),
    //   escalation: v.optional(v.object({
    //     reason: v.string(),
    //     timestamp: v.number(),
    //     resolved: v.boolean(),
    //     resolvedAt: v.optional(v.number()),
    //   })),
    //   userId: v.id("users"),
    // })
    //   .index("by_userId", ["userId"])
    //   .index("by_vendorId", ["vendorId"])
    //   .index("by_truckId", ["truckId"])
    //   .index("by_status", ["status.type"]),

    // invoiceItems: defineTable({
    //   invoiceId: v.id("invoices"),
    //   description: v.string(),
    //   quantity: v.number(),
    //   unitCost: v.number(),
    //   total: v.number(),
    // }).index("by_invoice", ["invoiceId"]),
  },
  { schemaValidation: false },
);
