import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Query to get a vendor by ID
export const getVendorById = query({
  // Use v.id instead of String for ID validation
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    // When using v.id, args.id is already properly typed as Id<"vendors">
    return await ctx.db
      .query("vendors")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
  },
});

// Get all vendors
export const getAllVendors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("vendors")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

// Archive a vendor - must be a mutation to modify data
export const archiveVendor = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { isArchived: true });
  },
});

// Example of creating a new vendor
export const createVendor = mutation({
  args: {
    vendorEid: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vendors", {
      ...args,
      isArchived: false,
    });
  },
});