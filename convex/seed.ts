import { internalMutation } from "./_generated/server";
import { faker } from "@faker-js/faker";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists to avoid duplicates
    const existingVendors = await ctx.db.query("vendors").collect();
    if (existingVendors.length > 0) {
      console.log("Vendors table already has data, skipping seed");
      return;
    }

    // Try to find an existing user first
    const existingUsers = await ctx.db.query("users").collect();
    let userId: Id<"users">;

    if (existingUsers.length > 0) {
      // Use an existing user if available
      userId = existingUsers[0]._id;
      console.log(`Using existing user with ID: ${userId}`);
    } else {
      // Create a test user with the required fields from @convex-dev/auth
      // These fields are based on the authTables schema
      userId = await ctx.db.insert("users", {
        name: "Test User",
        email: "test@example.com",
        // Required fields from authTables
        isAnonymous: false,
        emailVerificationTime: Date.now(),
        // Remove or replace the tokenIdentifier field
        // tokenIdentifier: `test:${Date.now()}`,
        // If you need an authentication identifier, use the appropriate field
        // from your auth schema, such as:
        // identityId: `test:${Date.now()}`,
      });
      console.log(`Created new test user with ID: ${userId}`);
    }

    // Initialize Faker with a fixed seed for reproducible data
    faker.seed(42);

    // Create vendors with the valid user ID
    for (let i = 0; i < 10; i++) {
      await ctx.db.insert("vendors", {
        vendorEid: faker.string.alphanumeric(10).toUpperCase(),
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        userId: userId,
        isArchived: false
      });
    }
    
    console.log("Vendors table seeded successfully");
  },
});