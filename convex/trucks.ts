import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
export const getVendorsByTruckId = query({
  args: { truckEid: v.string() },
  returns: v.array(v.object({
    _id: v.id("vendors"),
    _creationTime: v.number(),
    vendorEid: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phone: v.string(),
    userId: v.id("users"),
  })),
  handler: async (ctx, args) => {
    // First, find the truck by its truckEid
    const truck = await ctx.db
      .query("trucks")
      .filter((q) => q.eq(q.field("truckEid"), args.truckEid))
      .unique();
    
    if (!truck) {
      return [];
    }
    
    // Then find all invoices related to this truck
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("truckId"), truck._id))
      .collect();
    
    // Extract all vendor IDs from these invoices
    const vendorIds = [...new Set(invoices.map(invoice => invoice.vendorId))];
    
    // Get all the vendors and filter out null values before returning
    const vendorsWithNulls = await Promise.all(
      vendorIds.map(async vendorId => {
        const vendor = await ctx.db.get(vendorId);
        return vendor;  // This might be null
      })
    );
    
    // Filter out any null vendors (in case some were deleted)
    // TypeScript now knows we've removed null values
    return vendorsWithNulls.filter((vendor): vendor is Doc<"vendors"> => 
      vendor !== null && vendor !== undefined
    );
  },
});

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
