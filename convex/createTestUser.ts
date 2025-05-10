import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTestUser = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      isAnonymous: false,
      clerkId: "test_" + Math.random().toString(36).substring(2, 15),
    });
    return null;
  },
});
