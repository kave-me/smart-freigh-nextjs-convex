import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
export const getVendorsByTruckId = query({
  args: { truckEid: v.string() },
  returns: v.array(
    v.object({
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
    }),
  ),
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
    const vendorIds = [...new Set(invoices.map((invoice) => invoice.vendorId))];

    // Get all the vendors and filter out null values before returning
    const vendorsWithNulls = await Promise.all(
      vendorIds.map(async (vendorId) => {
        const vendor = await ctx.db.get(vendorId);
        return vendor; // This might be null
      }),
    );

    // Filter out any null vendors (in case some were deleted)
    // TypeScript now knows we've removed null values
    return vendorsWithNulls.filter(
      (vendor): vendor is Doc<"vendors"> =>
        vendor !== null && vendor !== undefined,
    );
  },
});

// Get truck by ID
export const getById = query({
  args: { id: v.string() },
  returns: v.object({
    _id: v.id("trucks"),
    _creationTime: v.number(),
    truckEid: v.string(),
    make: v.string(),
    bodyType: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    userId: v.id("users"),
  }),
  handler: async (ctx, args) => {
    const truck = await ctx.db
      .query("trucks")
      .withIndex("by_truckEid", (q) => q.eq("truckEid", args.id))
      .unique();

    if (!truck) {
      throw new Error(`Truck with ID ${args.id} not found`);
    }

    return truck;
  },
});

export const getAllTrucks = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("trucks"),
      _creationTime: v.number(),
      truckEid: v.string(),
      make: v.string(),
      bodyType: v.string(),
      model: v.string(),
      year: v.number(),
      vin: v.string(),
      userId: v.id("users"),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("trucks").order("asc").collect();
  },
});

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

// Update one or more fields on an existing truck
export const updateTruck = mutation({
  args: v.object({
    truckId: v.id("trucks"),
    truckEid: v.optional(v.string()),
    make: v.optional(v.string()),
    bodyType: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    vin: v.optional(v.string()),
  }),
  returns: v.boolean(),
  handler: async (ctx, { truckId, ...patch }) => {
    try {
      // Note: Convex IDs should be in format "tableName_base64string"
      // e.g., "trucks_abcdef123456"
      console.log(
        "Starting updateTruck mutation with ID:",
        truckId,
        "and patch:",
        patch,
      );

      // Validate that we have at least one field to update
      if (Object.keys(patch).length === 0) {
        console.error("No fields to update for truck ID:", truckId);
        throw new Error("No fields to update");
      }

      const truck = await ctx.db.get(truckId);
      if (!truck) {
        console.error("Truck not found with ID:", truckId);
        throw new Error(`Truck not found with ID: ${truckId}`);
      }

      console.log("Found truck:", truck, "applying patch");
      await ctx.db.patch(truckId, patch);
      console.log("Truck updated successfully");
      return true;
    } catch (error) {
      console.error("Error in updateTruck mutation:", error);
      throw error;
    }
  },
});

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

// Get invoices by truck ID
export const getInvoicesByTruckId = query({
  args: { truckEid: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("invoices"),
      _creationTime: v.number(),
      invoiceEid: v.string(),
      dateIssued: v.number(),
      status: v.union(
        v.literal("needs_review"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("escalated"),
      ),
      totalAmount: v.number(),
      truckId: v.id("trucks"),
      vendorId: v.id("vendors"),
      userId: v.id("users"),
      items: v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitCost: v.number(),
          total: v.number(),
        }),
      ),
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
    }),
  ),
  handler: async (ctx, args) => {
    // First, find the truck by truckEid
    const truck = await ctx.db
      .query("trucks")
      .withIndex("by_truckEid", (q) => q.eq("truckEid", args.truckEid))
      .unique();

    if (!truck) {
      return [];
    }

    // Find invoices related to this truck
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_truckId", (q) => q.eq("truckId", truck._id))
      .collect();

    return invoices;
  },
});
