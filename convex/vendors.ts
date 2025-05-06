// convex/vendors.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Fetch all vendors belonging to the current user
export const getAllVendors = query({
  args: {
  },
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
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vendors")
      .order("asc")
      .collect();
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

// // Update one or more fields on an existing vendor
// export const updateVendor = mutation({
//   args: v.object({
//     vendorId: v.id("vendors"),
//     vendorEid: v.optional(v.string()),
//     name: v.optional(v.string()),
//     address: v.optional(v.string()),
//     city: v.optional(v.string()),
//     state: v.optional(v.string()),
//     zipCode: v.optional(v.string()),
//     phone: v.optional(v.string()),
//   }),
//   returns: v.boolean(),
//   handler: async (ctx, { vendorId, ...patch }) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId === null) {
//       throw new Error("Authentication required");
//     }
//     const vendor = await ctx.db.get(vendorId);
//     if (!vendor) {
//       throw new Error("Vendor not found");
//     }
//     if (vendor.userId.toString() !== userId.toString()) {
//       throw new Error("Not authorized to update this vendor");
//     }
//     await ctx.db.patch(vendorId, patch);
//     return true;
//   },
// });

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
