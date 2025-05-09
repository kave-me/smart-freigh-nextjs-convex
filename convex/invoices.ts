// convex/invoices.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Fetch all invoices belonging to the current user
export const getAllInvoices = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("invoices"),
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
      status: v.union(v.literal("needs_review"), v.literal("escalated")),
      _creationTime: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices") // Changed from "vendors" to "invoices"
      .order("desc") // Order by creation time, newest first
      .collect();
  },
});

// // Create a new invoice
// export const createInvoice = mutation({
//   args: {
//     invoiceEid: v.string(),
//     vendorId: v.id("vendors"),
//     truckId: v.id("trucks"),
//     dateIssued: v.number(),
//     totalAmount: v.number(),
//     notes: v.optional(v.string()),
//     items: v.array(
//       v.object({
//         description: v.string(),
//         quantity: v.number(),
//         unitCost: v.number(),
//         total: v.number(),
//       })
//     ),
//   },
//   handler: async (ctx, args) => {
//     const userId = await ctx.auth.getUserIdentity();
//     if (!userId) {
//       throw new Error("Not authenticated");
//     }

//     const invoiceId = await ctx.db.insert("invoices", {
//       invoiceEid: args.invoiceEid,
//       vendorId: args.vendorId,
//       truckId: args.truckId,
//       userId: userId.tokenIdentifier,
//       dateIssued: args.dateIssued,
//       totalAmount: args.totalAmount,
//       notes: args.notes,
//       items: args.items,
//       status: "needs_review",
//     });

//     return invoiceId;
//   },
// });

// Get invoice by ID
export const getById = query({
  args: { id: v.string() },
  returns: v.object({
    _id: v.id("invoices"),
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
    status: v.union(v.literal("needs_review"), v.literal("escalated")),
    _creationTime: v.number(),
  }),
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.id))
      .first();

    if (!invoice) {
      throw new Error(`Invoice with ID ${args.id} not found`);
    }

    return invoice;
  },
});

// Get invoice analysis
export const getInvoiceAnalysis = query({
  args: { invoiceId: v.string() },
  returns: v.union(
    v.object({
      businessRule: v.string(),
      escalationReason: v.string(),
      issues: v.array(v.string()),
      description: v.string(),
      items: v.array(
        v.object({
          description: v.string(),
        }),
      ),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
      .first();

    if (!invoice || !invoice.analysis) {
      return null;
    }

    return {
      businessRule: "Rule T-103: Preventive maintenance frequency",
      escalationReason: "Maintenance frequency higher than expected",
      issues: [
        "Preventive maintenance performed before scheduled date",
        "Previous maintenance record shows service 45 days ago",
        "Company policy requires 90 days between preventive maintenance",
      ],
      description: invoice.analysis.description,
      items: invoice.analysis.items.map((item) => ({
        description: item.description,
      })),
    };
  },
});

// Get invoice items
export const getInvoiceItems = query({
  args: { invoiceId: v.string() },
  returns: v.array(
    v.object({
      id: v.string(),
      description: v.string(),
      type: v.string(),
      quantity: v.number(),
      unitCost: v.number(),
      totalCost: v.number(),
      matchScore: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
      .first();

    if (!invoice) {
      return [];
    }

    return invoice.items.map((item, index) => ({
      id: String(index + 1),
      description: item.description,
      type: "Part", // Default type, can be enhanced with actual type data
      quantity: item.quantity,
      unitCost: item.unitCost,
      totalCost: item.total,
      matchScore: 95, // Default match score, can be enhanced with actual matching logic
    }));
  },
});

// Get escalation email template
export const getEscalationEmail = query({
  args: { invoiceId: v.string() },
  returns: v.object({
    body: v.string(),
    signature: v.string(),
  }),
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
      .first();

    if (!invoice) {
      throw new Error(`Invoice with ID ${args.invoiceId} not found`);
    }

    return {
      body: `Subject: Invoice Review Required - Invoice #${args.invoiceId}\n\nDear Team,\n\nThis invoice requires your attention due to potential policy violations. Please review the attached analysis and take appropriate action.\n\nBest regards,`,
      signature:
        "The SmartFreight Team\nsupport@smartfreight.com\n1-800-FREIGHT",
    };
  },
});

// Get invoice by ID
export const getInvoiceById = query({
  args: { invoiceId: v.string() },
  handler: async (ctx, args) => {
    // Look up by your custom ID field
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
      .first();

    if (!invoice) {
      return null; // or throw an error
    }

    return invoice;
  },
});

// // Update invoice status
// export const updateInvoiceStatus = mutation({
//   args: {
//     invoiceId: v.id("invoices"),
//     status: v.union(
//       v.literal("needs_review"),
//       v.literal("escalated")
//     ),
//   },
//   handler: async (ctx, args) => {
//     const userId = await ctx.auth.getUserIdentity();
//     if (!userId) {
//       throw new Error("Not authenticated");
//     }

//     const invoice = await ctx.db.get(args.invoiceId);
//     if (!invoice) {
//       throw new Error("Invoice not found");
//     }

//     await ctx.db.patch(args.invoiceId, {
//       status: args.status,
//     });

//     return args.invoiceId;
//   },
// });

// // Add analysis to an invoice
// export const addInvoiceAnalysis = mutation({
//   args: {
//     invoiceId: v.id("invoices"),
//     description: v.string(),
//     items: v.array(
//       v.object({
//         description: v.string(),
//         weight: v.number(),
//       })
//     ),
//   },
//   handler: async (ctx, args) => {
//     const userId = await ctx.auth.getUserIdentity();
//     if (!userId) {
//       throw new Error("Not authenticated");
//     }

//     const invoice = await ctx.db.get(args.invoiceId);
//     if (!invoice) {
//       throw new Error("Invoice not found");
//     }

//     await ctx.db.patch(args.invoiceId, {
//       analysis: {
//         description: args.description,
//         timestamp: Date.now(),
//         items: args.items,
//       },
//     });

//     return args.invoiceId;
//   },
// });

export const getEnrichmentSuggestions = query({
  args: { invoiceId: v.string() },
  returns: v.object({
    items: v.array(
      v.object({
        id: v.string(),
        description: v.string(),
        type: v.string(),
        quantity: v.number(),
        unitCost: v.number(),
        totalCost: v.number(),
        matchScore: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
      .first();

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // For now, return mock data
    return {
      items: [
        {
          id: "1",
          description: "3-in-1 Airline Set with Gladhands (15 feet)",
          type: "part",
          quantity: 1,
          unitCost: 165,
          totalCost: 165,
          matchScore: 98,
        },
        {
          id: "2",
          description: "2-in-1 Airline Set with Gladhands (15 feet)",
          type: "part",
          quantity: 1,
          unitCost: 100,
          totalCost: 100,
          matchScore: 85,
        },
      ],
    };
  },
});
