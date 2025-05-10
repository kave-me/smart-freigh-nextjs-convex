// convex/invoices.ts
import { query, mutation } from "./_generated/server";
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
      status: v.union(v.literal("need_action"), v.literal("escalated")),
      _creationTime: v.number(),
    }),
  ),
  handler: async (ctx) => {
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
//       status: "need_action",
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
    status: v.union(v.literal("need_action"), v.literal("escalated")),
    _creationTime: v.number(),
  }),
  handler: async (ctx, args) => {
    try {
      const invoice = await ctx.db
        .query("invoices")
        .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.id))
        .unique();

      if (!invoice) {
        console.warn(`Invoice with ID ${args.id} not found in getById`);
        throw new Error(`Invoice with ID ${args.id} not found`);
      }

      return invoice;
    } catch (error) {
      console.error(`Error in getById for invoice ${args.id}:`, error);
      throw error; // We still need to throw here since the return type is not optional
    }
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
      .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.invoiceId))
      .unique();

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
      .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.invoiceId))
      .unique();

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
    try {
      const invoice = await ctx.db
        .query("invoices")
        .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.invoiceId))
        .unique();

      if (!invoice) {
        // Instead of throwing an error, log a warning and return a default message
        console.warn(
          `Invoice with ID ${args.invoiceId} not found for escalation email`,
        );
        return {
          body: `Note: This is a template as the invoice #${args.invoiceId} was not found.\n\nSubject: Invoice Review Required\n\nDear Team,\n\nPlease review this invoice for potential policy violations.\n\nBest regards,`,
          signature:
            "The SmartFreight Team\nsupport@smartfreight.com\n1-800-FREIGHT",
        };
      }

      return {
        body: `Subject: Invoice Review Required - Invoice #${args.invoiceId}\n\nDear Team,\n\nThis invoice requires your attention due to potential policy violations. Please review the attached analysis and take appropriate action.\n\nBest regards,`,
        signature:
          "The SmartFreight Team\nsupport@smartfreight.com\n1-800-FREIGHT",
      };
    } catch (error) {
      console.error(
        `Error in getEscalationEmail for invoice ${args.invoiceId}:`,
        error,
      );
      // Return a default message in case of error
      return {
        body: `Note: An error occurred while processing invoice #${args.invoiceId}.\n\nSubject: Invoice Review Required\n\nDear Team,\n\nPlease review this invoice for potential policy violations.\n\nBest regards,`,
        signature:
          "The SmartFreight Team\nsupport@smartfreight.com\n1-800-FREIGHT",
      };
    }
  },
});

// Get invoice by ID
export const getInvoiceById = query({
  args: { invoiceId: v.string() },
  handler: async (ctx, args) => {
    // Look up by your custom ID field
    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.invoiceId))
      .unique();

    if (!invoice) {
      return null; // or throw an error
    }

    return invoice;
  },
});

// Update invoice status
export const updateInvoiceStatus = mutation({
  args: {
    invoiceId: v.union(v.id("invoices"), v.string()),
    status: v.union(v.literal("need_action"), v.literal("escalated")),
  },
  handler: async (ctx, args) => {
    try {
      // Handle both ID and string cases
      let invoiceId;

      if (typeof args.invoiceId === "string") {
        // Look up by string ID/EID
        const invoice = await ctx.db
          .query("invoices")
          .filter((q) => q.eq(q.field("invoiceEid"), args.invoiceId))
          .unique();

        if (!invoice) {
          throw new Error(`Invoice with ID ${args.invoiceId} not found`);
        }

        invoiceId = invoice._id;
      } else {
        // Direct Convex ID
        invoiceId = args.invoiceId;

        // Verify the invoice exists
        const invoice = await ctx.db.get(invoiceId);
        if (!invoice) {
          throw new Error(`Invoice not found`);
        }
      }

      // Update the invoice status
      await ctx.db.patch(invoiceId, {
        status: args.status,
      });

      return true;
    } catch (error) {
      console.error("Error updating invoice status:", error);
      throw error;
    }
  },
});

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
    try {
      const invoice = await ctx.db
        .query("invoices")
        .withIndex("by_invoiceEid", (q) => q.eq("invoiceEid", args.invoiceId))
        .unique();

      if (!invoice) {
        // Instead of throwing an error, return an empty array
        console.warn(`Invoice not found for ID: ${args.invoiceId}`);
        return { items: [] };
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
    } catch (error) {
      console.error(
        `Error in getEnrichmentSuggestions for invoice ${args.invoiceId}:`,
        error,
      );
      // Return empty items instead of throwing an error
      return { items: [] };
    }
  },
});

// Get invoice metrics for charts
export const getInvoiceChartData = query({
  args: {},
  returns: v.object({
    byStatus: v.array(
      v.object({
        status: v.string(),
        count: v.number(),
        amount: v.number(),
      }),
    ),
    byMonth: v.array(
      v.object({
        month: v.string(),
        count: v.number(),
        amount: v.number(),
        need_action: v.number(),
        escalated: v.number(),
      }),
    ),
    byTruck: v.array(
      v.object({
        truckId: v.id("trucks"),
        count: v.number(),
        amount: v.number(),
      }),
    ),
    byVendor: v.array(
      v.object({
        vendorId: v.id("vendors"),
        count: v.number(),
        amount: v.number(),
      }),
    ),
  }),
  handler: async (ctx) => {
    // Get all invoices
    const invoices = await ctx.db.query("invoices").collect();

    // Create status metrics
    const statusMetrics = {
      need_action: { count: 0, amount: 0 },
      escalated: { count: 0, amount: 0 },
    };

    // Create month metrics
    const monthlyData = new Map();
    // Create truck metrics
    const truckData = new Map();
    // Create vendor metrics
    const vendorData = new Map();

    // Process each invoice
    invoices.forEach((invoice) => {
      const status = invoice.status;
      const amount = invoice.totalAmount;
      const date = new Date(invoice.dateIssued || invoice._creationTime);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const truckId = invoice.truckId;
      const vendorId = invoice.vendorId;

      // Update status metrics
      if (status in statusMetrics) {
        statusMetrics[status].count++;
        statusMetrics[status].amount += amount;
      }

      // Update monthly metrics
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          count: 0,
          amount: 0,
          need_action: 0,
          escalated: 0,
        });
      }
      const monthData = monthlyData.get(month);
      monthData.count++;
      monthData.amount += amount;
      monthData[status]++;

      // Update truck metrics
      if (!truckData.has(truckId)) {
        truckData.set(truckId, { truckId, count: 0, amount: 0 });
      }
      const truck = truckData.get(truckId);
      truck.count++;
      truck.amount += amount;

      // Update vendor metrics
      if (!vendorData.has(vendorId)) {
        vendorData.set(vendorId, { vendorId, count: 0, amount: 0 });
      }
      const vendor = vendorData.get(vendorId);
      vendor.count++;
      vendor.amount += amount;
    });

    // Convert status metrics to array
    const byStatus = Object.entries(statusMetrics).map(([status, data]) => ({
      status,
      count: data.count,
      amount: data.amount,
    }));

    // Sort monthly data by month
    const byMonth = Array.from(monthlyData.values()).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    // Sort truck data by amount
    const byTruck = Array.from(truckData.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 trucks by spend

    // Sort vendor data by amount
    const byVendor = Array.from(vendorData.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 vendors by spend

    return {
      byStatus,
      byMonth,
      byTruck,
      byVendor,
    };
  },
});

// Fix any invoices with invalid status values
export const fixInvoiceStatuses = mutation({
  args: {},
  returns: v.object({
    fixed: v.number(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    // Get all invoices
    const invoices = await ctx.db.query("invoices").collect();

    let fixedCount = 0;

    // Loop through invoices and fix any with invalid statuses
    for (const invoice of invoices) {
      const status = invoice.status;

      // Check if status is not one of the valid values
      if (status !== "need_action" && status !== "escalated") {
        // Update the invoice to use "need_action" status
        await ctx.db.patch(invoice._id, {
          status: "need_action",
        });

        fixedCount++;
        console.log(
          `Fixed invoice ${invoice.invoiceEid} with invalid status: ${status}`,
        );
      }
    }

    return {
      fixed: fixedCount,
      message:
        fixedCount > 0
          ? `Fixed ${fixedCount} invoices with invalid status values`
          : "No invoices with invalid status values found",
    };
  },
});
