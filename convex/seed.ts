
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Helper to generate random strings
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Grab one existing user
    const users = await ctx.db.query("users").order("desc").take(1);
    if (users.length === 0) {
      throw new Error("No users found in 'users' table. Create at least one first.");
    }
    const userId: Id<"users"> = users[0]._id;

    const vendorIds: Id<"vendors">[] = [];
    const truckIds: Id<"trucks">[] = [];
    const invoiceIds: Id<"invoices">[] = [];

    // 1) Seed 50 vendors
    for (let i = 0; i < 50; i++) {
      const vid = await ctx.db.insert("vendors", {
        vendorEid: `VEND-${randomString(6)}`,
        name: `Vendor ${randomString(4)}`,
        address: `${Math.floor(Math.random() * 1000)} Main St`,
        city: "Metropolis",
        state: "ST",
        zipCode: String(10000 + Math.floor(Math.random() * 90000)),
        phone: `555-${1000 + Math.floor(Math.random() * 9000)}`,
        userId,
      });
      vendorIds.push(vid);
    }

    // 2) Seed 50 trucks
    const bodyTypes = ["Flatbed", "Box", "Reefer"] as const;
    for (let i = 0; i < 50; i++) {
      const tid = await ctx.db.insert("trucks", {
        truckEid: `TRK-${randomString(6)}`,
        make: `Make${randomString(2)}`,
        bodyType: bodyTypes[i % bodyTypes.length],
        model: `Model${randomString(2)}`,
        year: 2015 + (i % 10),
        vin: randomString(17).toUpperCase(),
        userId,
      });
      truckIds.push(tid);
    }

    // 3) Seed 50 invoices
    for (let i = 0; i < 50; i++) {
      const invId = await ctx.db.insert("invoices", {
        invoiceEid: `INV-${randomString(6)}`,
        vendorId: vendorIds[i % vendorIds.length],
        truckId: truckIds[i % truckIds.length],
        dateIssued: Date.now() - i * 24 * 60 * 60 * 1000,
        totalAmount: Math.floor(Math.random() * 2000),
        serviceReason: "Routine maintenance",
        status: {
          type: "pending",
          updatedAt: Date.now(),
          isFinalized: false,
        },
        // notes, analysis, escalation are optional—omit them
        userId,
      });
      invoiceIds.push(invId);
    }

    // 4) Seed 3 items per invoice
    for (const invoiceId of invoiceIds) {
      for (let j = 0; j < 3; j++) {
        await ctx.db.insert("invoiceItems", {
          invoiceId,
          description: `Item ${randomString(4)}`,
          quantity: 1 + Math.floor(Math.random() * 5),
          unitCost: Math.floor(Math.random() * 500),
          total: Math.floor(Math.random() * 500),
        });
      }
    }

    return null;
  },
});
