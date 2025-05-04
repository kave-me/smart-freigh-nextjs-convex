import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return {
      name: identity.name || "Anonymous",
      email: identity.email || "",
      avatar: identity.pictureUrl || "/avatars/default.jpg",
    };
  },
});
