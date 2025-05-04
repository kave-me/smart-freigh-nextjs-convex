import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Query to get a truck by ID
export const getTruckById = query({
  args: { id: v.id("trucks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all trucks for a user
export const getTrucksByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trucks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Update a truck
export const updateTruck = mutation({
  args: {
    id: v.id("trucks"),
    truckEid: v.string(),
    make: v.string(),
    bodyType: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
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
    return await ctx.db.insert("trucks", args);
  },
});

// Delete a truck
export const deleteTruck = mutation({
  args: { id: v.id("trucks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});