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
    });
    return null;
  },
});