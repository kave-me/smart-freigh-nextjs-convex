// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { Doc, Id } from "./_generated/dataModel";
// import { getAuthUserId } from "@convex-dev/auth/server";

// // Query to get a truck by ID
// export const getTruckById = query({
//   args: { id: v.id("trucks") },
//   returns: v.union(v.object({
//     _id: v.id("trucks"),
//     _creationTime: v.number(),
//     truckEid: v.string(),
//     make: v.string(),
//     bodyType: v.string(),
//     model: v.string(),
//     year: v.number(),
//     vin: v.string(),
//     userId: v.id("users"),
//   }), v.null()),
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("trucks")
//       .filter((q) => q.eq(q.field("_id"), args.id))
//       .unique();
//   },
// });

// // Get all trucks for the current user
// export const getAllTrucks = query({
//   args: {
//     userId: v.optional(v.id("users")),
//   },
//   returns: v.array(
//     v.object({
//       _id: v.id("trucks"),
//       _creationTime: v.number(),
//       truckEid: v.string(),
//       make: v.string(),
//       bodyType: v.string(),
//       model: v.string(),
//       year: v.number(),
//       vin: v.string(),
//       userId: v.id("users"),
//     })
//   ),
//   handler: async (ctx, args) => {
//     const authUserId = await getAuthUserId(ctx);
//     const userId = args.userId ?? authUserId;
//     if (!userId) {
//       return [];  // Return empty array if no user is authenticated
//     }
//     return await ctx.db
//       .query("trucks")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .order("asc")
//       .collect();
//   },
// });

// // Create a new truck for the current user
// export const addTruck = mutation({
//   args: v.object({
//     truckEid: v.string(),
//     make: v.string(),
//     bodyType: v.string(),
//     model: v.string(),
//     year: v.number(),
//     vin: v.string(),
//   }),
//   returns: v.id("trucks"),
//   handler: async (ctx, { truckEid, make, bodyType, model, year, vin }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     return await ctx.db.insert("trucks", {
//       truckEid,
//       make,
//       bodyType,
//       model,
//       year,
//       vin,
//       userId,
//     });
//   },
// });

// // Update one or more fields on an existing truck
// export const updateTruck = mutation({
//   args: v.object({
//     truckId: v.id("trucks"),
//     truckEid: v.optional(v.string()),
//     make: v.optional(v.string()),
//     bodyType: v.optional(v.string()),
//     model: v.optional(v.string()),
//     year: v.optional(v.number()),
//     vin: v.optional(v.string()),
//   }),
//   returns: v.boolean(),
//   handler: async (ctx, { truckId, ...patch }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     const truck = await ctx.db.get(truckId);
//     if (!truck) {
//       throw new Error("Truck not found");
//     }
//     if (truck.userId.toString() !== userId.toString()) {
//       throw new Error("Not authorized to update this truck");
//     }
//     await ctx.db.patch(truckId, patch);
//     return true;
//   },
// });

// // Delete a truck
// export const deleteTruck = mutation({
//   args: v.object({
//     truckId: v.id("trucks"),
//   }),
//   returns: v.boolean(),
//   handler: async (ctx, { truckId }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     const truck = await ctx.db.get(truckId);
//     if (!truck) {
//       throw new Error("Truck not found");
//     }
//     if (truck.userId.toString() !== userId.toString()) {
//       throw new Error("Not authorized to delete this truck");
//     }
//     await ctx.db.delete(truckId);
//     return true;
//   },
// });
