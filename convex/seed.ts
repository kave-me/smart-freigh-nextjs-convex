import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { faker } from "@faker-js/faker";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log(
      "🚀 Starting complete database initialization and seeding process...",
    );

    // Step 1: Drop all existing data
    console.log("🧹 Cleaning all existing data...");
    const tables = [
      "vendors",
      "trucks",
      "invoices",
      "businessRules",
      "businessRuleCategories",
      "emailTemplates",
      "userSettings",
      "users",
    ] as const;

    for (const table of tables) {
      console.log(`  - Cleaning ${table} table...`);
      const existingDocs = await ctx.db.query(table).collect();
      console.log(`    Found ${existingDocs.length} ${table} to delete`);

      for (const doc of existingDocs) {
        await ctx.db.delete(doc._id);
      }
      console.log(`    ✅ ${table} table cleaned`);
    }

    // Step 2: Create test user
    console.log("👤 Creating test user...");
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      isAnonymous: false,
      clerkId: "test_" + Math.random().toString(36).substring(2, 15),
    });
    console.log(`  ✅ Test user created with ID: ${userId}`);

    // Step 3: Create user settings
    console.log("⚙️ Creating user settings...");
    await ctx.db.insert("userSettings", {
      userId,
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "+1-555-123-4567",
      theme: "light",
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
      },
      businessSettings: {
        companyName: "Smart Freight Test Company",
        companyAddress: "123 Test Street, Test City, TS 12345",
        taxId: "12-3456789",
      },
    });
    console.log("  ✅ User settings created");

    // Step 4: Seed vendors
    const vendorIds: Id<"vendors">[] = [];
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

    // Step 5: Seed trucks
    const truckIds: Id<"trucks">[] = [];
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

    // Step 6: Seed invoices
    const invoiceIds: Id<"invoices">[] = [];
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

    // Step 7: Seed business rules
    console.log("📋 Creating business rule categories and rules...");

    // Create categories
    const warrantyCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "Warranty",
      userId,
    });

    const partLaborCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "Part and Labor",
      userId,
    });

    const etcCategoryId = await ctx.db.insert("businessRuleCategories", {
      name: "ETC",
      userId,
    });
    console.log("  ✅ Created business rule categories");

    // Add rules to categories
    const businessRulesMap = [
      { name: "Rule 2025", categoryId: warrantyCategoryId, enabled: true },
      { name: "Rule 2023", categoryId: warrantyCategoryId, enabled: false },
      { name: "Rule 2022", categoryId: warrantyCategoryId, enabled: true },
      { name: "Labor Rate", categoryId: partLaborCategoryId, enabled: true },
      { name: "Part Markup", categoryId: partLaborCategoryId, enabled: true },
      { name: "Misc Rule 1", categoryId: etcCategoryId, enabled: false },
      { name: "Misc Rule 2", categoryId: etcCategoryId, enabled: true },
    ];

    for (const rule of businessRulesMap) {
      await ctx.db.insert("businessRules", {
        ...rule,
        userId,
      });
    }
    console.log("  ✅ Created business rules");

    // Step 8: Create email templates
    console.log("📧 Creating email templates...");
    const templateData = [
      {
        name: "Invoice Reminder",
        subject: "Reminder: Invoice Due Soon",
        action: "reminder",
        to: "customer@example.com",
        from: "accounting@example.com",
        body: "This is a friendly reminder that your invoice #{{invoiceNumber}} for ${{amount}} is due on {{dueDate}}. Please process payment at your earliest convenience.",
      },
      {
        name: "Payment Confirmation",
        subject: "Payment Received - Thank You",
        action: "confirmation",
        to: "customer@example.com",
        from: "accounting@example.com",
        body: "Thank you for your payment of ${{amount}} for invoice #{{invoiceNumber}}. Your payment has been processed successfully.",
      },
      {
        name: "Late Payment Notice",
        subject: "Important: Overdue Invoice",
        action: "late_notice",
        to: "customer@example.com",
        from: "accounting@example.com",
        bcc: "collections@example.com",
        body: "We noticed that invoice #{{invoiceNumber}} for ${{amount}} is now {{daysPast}} days past due. Please arrange payment as soon as possible.",
      },
    ];

    for (const template of templateData) {
      await ctx.db.insert("emailTemplates", {
        ...template,
        userId,
      });
    }
    console.log("  ✅ Created email templates");

    // Log final summary
    console.log(
      "\n✅ Database initialization and seeding completed successfully!",
    );
    console.log(`📊 Summary of created data:
- 1 test user
- 1 user settings record
- ${vendorIds.length} vendors
- ${truckIds.length} trucks
- ${invoiceIds.length} invoices
- 3 business rule categories
- 7 business rules
- 3 email templates`);

    return null;
  },
});
