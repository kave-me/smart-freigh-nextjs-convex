import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Query to get a truck by ID
export const getTruckById = query({
  args: { id: v.id("trucks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trucks")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
  },
});

// Get all trucks
export const getAllTrucks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("trucks")
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

// Archive a truck
export const archiveTruck = mutation({
  args: { id: v.id("trucks") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { isArchived: true });
  },
});

// Create a new truck
export const createTruck = mutation({
  args: {
    truckEid: v.string(),
    make: v.string(),
    bodyType: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trucks", {
      ...args,
      isArchived: false,
    });
  },
});