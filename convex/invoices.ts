// convex/invoices.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Fetch all invoices belonging to the current user
export const getAllInvoices = query({
  args: {
  },
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
            })
          ),
        })
      ),
      items: v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitCost: v.number(),
          total: v.number(),
        })
      ),
      status: v.union(
        v.literal("needs_review"),
        v.literal("escalated")
      ),
      _creationTime: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")  // Changed from "vendors" to "invoices"
      .order("desc")  // Order by creation time, newest first
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
export const getInvoiceById = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
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