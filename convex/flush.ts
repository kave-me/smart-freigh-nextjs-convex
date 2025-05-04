// convex/flush.ts
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Flushes all data from your domain tables in dependency-safe order.
 * Call this once before re-seeding.
 */
export const flushDb = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Delete invoiceItems before invoices
    for await (const item of ctx.db.query("invoiceItems")) {
      await ctx.db.delete(item._id);
    }
    // Delete invoices before trucks & vendors
    for await (const inv of ctx.db.query("invoices")) {
      await ctx.db.delete(inv._id);
    }
    // Delete trucks
    for await (const tr of ctx.db.query("trucks")) {
      await ctx.db.delete(tr._id);
    }
    // Delete vendors
    for await (const vdr of ctx.db.query("vendors")) {
      await ctx.db.delete(vdr._id);
    }
    return null;
  },
});
