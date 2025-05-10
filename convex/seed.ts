import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { faker } from "@faker-js/faker";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("📋 Starting database seeding process...");

    // Clean existing data
    console.log("🧹 Cleaning existing data...");
    const tables = ["vendors", "trucks", "invoices"] as const;

    for (const table of tables) {
      console.log(`  - Cleaning ${table} table...`);
      const existingDocs = await ctx.db.query(table).collect();
      console.log(`    Found ${existingDocs.length} ${table} to delete`);

      for (const doc of existingDocs) {
        await ctx.db.delete(doc._id);
      }
      console.log(`    ✅ ${table} table cleaned`);
    }

    // Grab one existing user
    console.log("👤 Finding a user to assign the data to...");
    const users = await ctx.db.query("users").order("desc").take(1);
    if (users.length === 0) {
      console.error("❌ No users found in 'users' table");
      throw new Error(
        "No users found in 'users' table. Create at least one first with the createTestUser mutation.",
      );
    }
    const userId: Id<"users"> = users[0]._id;
    console.log(`  ✅ Using user with ID: ${userId}`);

    const vendorIds: Id<"vendors">[] = [];
    const truckIds: Id<"trucks">[] = [];
    const invoiceIds: Id<"invoices">[] = [];

    // 1) Seed vendors
    const vendorCount = 50;
    console.log(`🏢 Seeding ${vendorCount} vendors...`);
    for (let i = 0; i < vendorCount; i++) {
      const vendorEid = `VEND-${faker.string.alphanumeric(6).toUpperCase()}`;
      const vendorData = {
        vendorEid,
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        userId,
      };

      try {
        const vid = await ctx.db.insert("vendors", vendorData);
        vendorIds.push(vid);
        if ((i + 1) % 10 === 0) {
          console.log(`  - Created ${i + 1}/${vendorCount} vendors`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create vendor ${vendorEid}:`, error);
      }
    }
    console.log(`  ✅ Created ${vendorIds.length} vendors`);

    // 2) Seed trucks
    const truckCount = 50;
    console.log(`🚛 Seeding ${truckCount} trucks...`);
    const bodyTypes = ["Flatbed", "Box", "Reefer", "Tanker", "Dump"];
    const manufacturers = [
      "Freightliner",
      "Peterbilt",
      "Kenworth",
      "Volvo",
      "Mack",
    ];

    for (let i = 0; i < truckCount; i++) {
      const truckEid = `TRK-${faker.string.alphanumeric(6).toUpperCase()}`;
      const truckData = {
        truckEid,
        make: faker.helpers.arrayElement(manufacturers),
        bodyType: faker.helpers.arrayElement(bodyTypes),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2015, max: 2024 }),
        vin: faker.vehicle.vin(),
        userId,
      };

      try {
        const tid = await ctx.db.insert("trucks", truckData);
        truckIds.push(tid);
        if ((i + 1) % 10 === 0) {
          console.log(`  - Created ${i + 1}/${truckCount} trucks`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create truck ${truckEid}:`, error);
      }
    }
    console.log(`  ✅ Created ${truckIds.length} trucks`);

    // 3) Seed invoices
    const invoiceCount = 100;
    console.log(`📄 Seeding ${invoiceCount} invoices...`);
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
      "Preventive Maintenance",
      "Radiator Flush",
      "Battery Replacement",
      "Exhaust System Repair",
      "Wheel Bearing Service",
      "Steering System Inspection",
    ];

    const statuses = ["need_action", "escalated"] as const;
    type InvoiceStatus = (typeof statuses)[number];

    for (let i = 0; i < invoiceCount; i++) {
      // Generate 2-5 invoice items
      const numItems = faker.number.int({ min: 2, max: 5 });
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const unitCost = faker.number.float({
          min: 50,
          max: 500,
          fractionDigits: 2,
        });
        const total = quantity * unitCost;
        totalAmount += total;

        items.push({
          description: faker.helpers.arrayElement(serviceDescriptions),
          quantity,
          unitCost,
          total,
        });
      }

      const invoiceEid = `INV-${faker.string.alphanumeric(6).toUpperCase()}`;
      const invoiceData = {
        invoiceEid,
        vendorId: faker.helpers.arrayElement(vendorIds),
        truckId: faker.helpers.arrayElement(truckIds),
        userId,
        dateIssued: faker.date.recent({ days: 60 }).getTime(),
        totalAmount,
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.7,
        }),
        items,
        status: faker.helpers.arrayElement(statuses) as InvoiceStatus,
        // Conditionally add analysis for some invoices
        ...faker.helpers.maybe(
          () => ({
            analysis: {
              description: faker.lorem.paragraph(1),
              timestamp: Date.now(),
              items: Array.from(
                { length: faker.number.int({ min: 1, max: 3 }) },
                () => ({
                  description: faker.lorem.sentence(),
                  weight: faker.number.float({
                    min: 0.1,
                    max: 1.0,
                    fractionDigits: 2,
                  }),
                }),
              ),
            },
          }),
          { probability: 0.3 },
        ),
      };

      try {
        const invId = await ctx.db.insert("invoices", invoiceData);
        invoiceIds.push(invId);
        if ((i + 1) % 20 === 0) {
          console.log(`  - Created ${i + 1}/${invoiceCount} invoices`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create invoice ${invoiceEid}:`, error);
      }
    }
    console.log(`  ✅ Created ${invoiceIds.length} invoices`);

    // Log final summary
    console.log("\n✅ Seeding completed successfully!");
    console.log(`📊 Summary of created data:
- ${vendorIds.length} vendors
- ${truckIds.length} trucks
- ${invoiceIds.length} invoices
All associated with user: ${userId}`);

    return null;
  },
});

// Add seed function for business rules
export const seedBusinessRules = mutation({
  args: {},
  handler: async (ctx) => {
    // Find the first user (our test user)
    const user = await ctx.db.query("users").first();
    if (!user) throw new Error("No user found to seed data");

    // Create categories
    const warrantyCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "Warranty",
      userId: user._id,
    });

    const partLaborCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "Part and Labor",
      userId: user._id,
    });

    const etcCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "ETC",
      userId: user._id,
    });

    // Add rules to warranty category
    await ctx.db.insert("businessRules", {
      name: "Rule 2025",
      categoryId: warrantyCategoryId,
      enabled: true,
      userId: user._id,
    });

    await ctx.db.insert("businessRules", {
      name: "Rule 2023",
      categoryId: warrantyCategoryId,
      enabled: false,
      userId: user._id,
    });

    await ctx.db.insert("businessRules", {
      name: "Rule 2022",
      categoryId: warrantyCategoryId,
      enabled: false,
      userId: user._id,
    });

    // Add rule to part & labor category
    await ctx.db.insert("businessRules", {
      name: "Parts 2025",
      categoryId: partLaborCategoryId,
      enabled: true,
      userId: user._id,
    });

    return {
      warrantyCategoryId,
      partLaborCategoryId,
      etcCategoryId,
    };
  },
});
