// convex/vendors.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Fetch all vendors belonging to the current user
export const getAllVendors = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("vendors"),
      vendorEid: v.string(),
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
      userId: v.id("users"),
      _creationTime: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("vendors").order("asc").collect();
  },
});

// Get vendor by ID
export const getById = query({
  args: { id: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("vendors"),
      vendorEid: v.string(),
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
      userId: v.id("users"),
      _creationTime: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_vendorEid", (q) => q.eq("vendorEid", args.id))
      .unique();

    if (!vendor) {
      // Return null instead of throwing an error
      return null;
    }

    return vendor;
  },
});

// // Fetch all vendors belonging to the current user
// export const getVendorsByUser = query({
//   args: {
//     userId: v.optional(v.id("users")),
//   },
//   returns: v.array(
//     v.object({
//       _id: v.id("vendors"),
//       vendorEid: v.string(),
//       name: v.string(),
//       address: v.string(),
//       city: v.string(),
//       state: v.string(),
//       zipCode: v.string(),
//       phone: v.string(),
//       userId: v.id("users"),
//       _creationTime: v.number(),
//     })
//   ),
//   handler: async (ctx, args) => {
//     const authUserId = await getAuthUserId(ctx);
//     const userId = args.userId ?? authUserId;
//     if (!userId) {
//       return [];  // Return empty array if no user is authenticated
//     }
//     return await ctx.db
//       .query("vendors")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .order("asc")
//       .collect();
//   },
// });

// // Create a new vendor for the current user
// export const addVendor = mutation({
//   args: v.object({
//     vendorEid: v.string(),
//     name: v.string(),
//     address: v.string(),
//     city: v.string(),
//     state: v.string(),
//     zipCode: v.string(),
//     phone: v.string(),
//   }),
//   returns: v.id("vendors"),
//   handler: async (ctx, { vendorEid, name, address, city, state, zipCode, phone }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     return await ctx.db.insert("vendors", {
//       vendorEid,
//       name,
//       address,
//       city,
//       state,
//       zipCode,
//       phone,
//       userId,
//     });
//   },
// });

// Update one or more fields on an existing vendor
export const updateVendor = mutation({
  args: v.object({
    vendorId: v.id("vendors"),
    vendorEid: v.optional(v.string()),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    phone: v.optional(v.string()),
  }),
  returns: v.boolean(),
  handler: async (ctx, { vendorId, ...patch }) => {
    try {
      // Note: Convex IDs should be in format "tableName_base64string"
      // e.g., "vendors_abcdef123456"
      console.log(
        "Starting updateVendor mutation with ID:",
        vendorId,
        "and patch:",
        patch,
      );

      // Validate that we have at least one field to update
      if (Object.keys(patch).length === 0) {
        console.error("No fields to update for vendor ID:", vendorId);
        throw new Error("No fields to update");
      }

      const vendor = await ctx.db.get(vendorId);
      if (!vendor) {
        console.error("Vendor not found with ID:", vendorId);
        throw new Error(`Vendor not found with ID: ${vendorId}`);
      }

      console.log("Found vendor:", vendor, "applying patch");
      await ctx.db.patch(vendorId, patch);
      console.log("Vendor updated successfully");
      return true;
    } catch (error) {
      console.error("Error in updateVendor mutation:", error);
      throw error;
    }
  },
});

// // Delete a vendor
// export const deleteVendor = mutation({
//   args: v.object({
//     vendorId: v.id("vendors"),
//   }),
//   returns: v.boolean(),
//   handler: async (ctx, { vendorId }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     const vendor = await ctx.db.get(vendorId);
//     if (!vendor) {
//       throw new Error("Vendor not found");
//     }
//     if (vendor.userId.toString() !== userId.toString()) {
//       throw new Error("Not authorized to delete this vendor");
//     }
//     await ctx.db.delete(vendorId);
//     return true;
//   },
// });

// Get trucks associated with a vendor
export const getTrucksByVendorId = query({
  args: { vendorEid: v.string() },
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
  handler: async (ctx, args) => {
    // First, find the vendor by vendorEid
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_vendorEid", (q) => q.eq("vendorEid", args.vendorEid))
      .unique();

    if (!vendor) {
      return [];
    }

    // Find invoices related to this vendor
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_vendorId", (q) => q.eq("vendorId", vendor._id))
      .collect();

    // Extract all truck IDs from these invoices
    const truckIds = [...new Set(invoices.map((invoice) => invoice.truckId))];

    // Get all trucks and filter out null values
    const trucksWithNulls = await Promise.all(
      truckIds.map(async (truckId) => {
        const truck = await ctx.db.get(truckId);
        return truck; // This might be null
      }),
    );

    // Filter out any null trucks
    return trucksWithNulls.filter(
      (truck) => truck !== null && truck !== undefined,
    );
  },
});

// Get invoices by vendor ID
export const getInvoicesByVendorId = query({
  args: { vendorEid: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("invoices"),
      _creationTime: v.number(),
      invoiceEid: v.string(),
      dateIssued: v.number(),
      status: v.union(v.literal("need_action"), v.literal("escalated")),
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
    // First, find the vendor by vendorEid
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_vendorEid", (q) => q.eq("vendorEid", args.vendorEid))
      .unique();

    if (!vendor) {
      return [];
    }

    // Find invoices related to this vendor
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_vendorId", (q) => q.eq("vendorId", vendor._id))
      .collect();

    return invoices;
  },
});

// Get vendor statistics for dashboard
export const getVendorStatistics = query({
  args: {},
  returns: v.array(
    v.object({
      vendorId: v.id("vendors"),
      vendorEid: v.string(),
      name: v.string(),
      state: v.string(),
      city: v.string(),
      invoiceCount: v.number(),
      totalSpend: v.number(),
      avgInvoiceAmount: v.number(),
    }),
  ),
  handler: async (ctx) => {
    // Get all vendors
    const vendors = await ctx.db.query("vendors").collect();

    // For each vendor, get invoice statistics
    const vendorStats = await Promise.all(
      vendors.map(async (vendor) => {
        // Get all invoices for this vendor
        const invoices = await ctx.db
          .query("invoices")
          .withIndex("by_vendorId", (q) => q.eq("vendorId", vendor._id))
          .collect();

        // Calculate statistics
        const invoiceCount = invoices.length;
        const totalSpend = invoices.reduce(
          (sum, inv) => sum + inv.totalAmount,
          0,
        );
        const avgInvoiceAmount =
          invoiceCount > 0 ? totalSpend / invoiceCount : 0;

        return {
          vendorId: vendor._id,
          vendorEid: vendor.vendorEid,
          name: vendor.name,
          state: vendor.state,
          city: vendor.city,
          invoiceCount,
          totalSpend,
          avgInvoiceAmount,
        };
      }),
    );

    // Sort by total spend (highest first)
    return vendorStats.sort((a, b) => b.totalSpend - a.totalSpend);
  },
});
