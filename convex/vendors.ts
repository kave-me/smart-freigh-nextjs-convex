import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Query to get a vendor by ID
export const getVendorById = query({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all vendors for a user
export const getVendorsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vendors")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Update a vendor
export const updateVendor = mutation({
  args: {
    id: v.id("vendors"),
    vendorEid: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Create a new vendor
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
    return await ctx.db.insert("vendors", args);
  },
});

// Delete a vendor
export const deleteVendor = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});