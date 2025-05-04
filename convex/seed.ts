import { internalMutation } from "./_generated/server";
import { faker } from "@faker-js/faker";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const regenerateData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing vendors and trucks
    const existingVendors = await ctx.db.query("vendors").collect();
    for (const vendor of existingVendors) {
      await ctx.db.delete(vendor._id);
    }

    const existingTrucks = await ctx.db.query("trucks").collect();
    for (const truck of existingTrucks) {
      await ctx.db.delete(truck._id);
    }

    // Get or create a test user
    const existingUsers = await ctx.db.query("users").collect();
    let userId: Id<"users">;

    if (existingUsers.length > 0) {
      userId = existingUsers[0]._id;
    } else {
      userId = await ctx.db.insert("users", {
        name: "Test User",
        email: "test@example.com",
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      });
    }


    // Generate new trucks
    const truckMakes = ['Freightliner', 'Peterbilt', 'Kenworth', 'Volvo', 'Mack', 'International'];
    const bodyTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Tanker', 'Box Truck', 'Dump Truck'];

    for (let i = 0; i < 25; i++) {
      const make = truckMakes[Math.floor(Math.random() * truckMakes.length)];
      const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
      
      await ctx.db.insert("trucks", {
        truckEid: faker.string.alphanumeric(8).toUpperCase(),
        make,
        bodyType,
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2018, max: 2024 }),
        vin: faker.vehicle.vin(),
        userId: userId,
        isArchived: false
      });
    }

    return { success: true, message: "Data regenerated successfully" };
  },
});