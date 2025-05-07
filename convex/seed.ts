
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { faker } from "@faker-js/faker";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("🧹 Cleaning existing data...");
    // Clean existing data
    const tables = ["vendors", "trucks", "invoices"] as const;
    type TableName = typeof tables[number];
    for (const table of tables) {
      const existingDocs = await ctx.db.query(table).collect();
      for (const doc of existingDocs) {
        await ctx.db.delete(doc._id);
      }
    }

    // Grab one existing user
    const users = await ctx.db.query("users").order("desc").take(1);
    if (users.length === 0) {
      throw new Error("No users found in 'users' table. Create at least one first.");
    }
    const userId: Id<"users"> = users[0]._id;

    const vendorIds: Id<"vendors">[] = [];
    const truckIds: Id<"trucks">[] = [];
    const invoiceIds: Id<"invoices">[] = [];

    console.log("🏢 Seeding 50 vendors...");
    // 1) Seed 50 vendors
    for (let i = 0; i < 50; i++) {
      const vid = await ctx.db.insert("vendors", {
        vendorEid: `VEND-${faker.string.alphanumeric(6).toUpperCase()}`,
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        userId,
      });
      vendorIds.push(vid);
    }

    console.log("🚛 Seeding 50 trucks...");
    // 2) Seed 50 trucks
    const bodyTypes = ["Flatbed", "Box", "Reefer", "Tanker", "Dump"] as const;
    const manufacturers = ["Freightliner", "Peterbilt", "Kenworth", "Volvo", "Mack"];
    for (let i = 0; i < 50; i++) {
      const tid = await ctx.db.insert("trucks", {
        truckEid: `TRK-${faker.string.alphanumeric(6).toUpperCase()}`,
        make: faker.helpers.arrayElement(manufacturers),
        bodyType: faker.helpers.arrayElement(bodyTypes),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2015, max: 2024 }),
        vin: faker.vehicle.vin(),
        userId,
      });
      truckIds.push(tid);
    }

    console.log("📄 Seeding 50 invoices...");
    // 3) Seed 50 invoices
    const serviceDescriptions = [
      "Oil Change and Filter Replacement",
      "Brake System Maintenance",
      "Tire Rotation and Alignment",
      "Engine Diagnostics and Repair",
      "Transmission Service",
      "Electrical System Repair",
      "Suspension System Maintenance",
      "Air Conditioning Service",
      "Fuel System Cleaning",
      "Preventive Maintenance"
    ];

    for (let i = 0; i < 50; i++) {
      // Generate 2-5 invoice items
      const numItems = faker.number.int({ min: 2, max: 5 });
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const unitCost = faker.number.float({ min: 50, max: 500, fractionDigits: 2 });
        const total = quantity * unitCost;
        totalAmount += total;

        items.push({
          description: faker.helpers.arrayElement(serviceDescriptions),
          quantity,
          unitCost,
          total,
        });
      }

      const invId = await ctx.db.insert("invoices", {
        invoiceEid: `INV-${faker.string.alphanumeric(6).toUpperCase()}`,
        vendorId: faker.helpers.arrayElement(vendorIds),
        truckId: faker.helpers.arrayElement(truckIds),
        userId,
        dateIssued: faker.date.recent({ days: 30 }).getTime(),
        totalAmount,
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
        items,
        status: faker.helpers.arrayElement(["needs_review", "escalated"]),
      });
      invoiceIds.push(invId);
    }

    console.log("✅ Seeding completed successfully!");
    console.log(`Created:
- ${vendorIds.length} vendors
- ${truckIds.length} trucks
- ${invoiceIds.length} invoices`);

    return null;
  },
});
