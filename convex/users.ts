import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

export const getUser = query({
  args: {},
  returns: v.union(
    v.object({
      name: v.string(),
      email: v.string(),
      phoneNumber: v.string(),
      password: v.string(),
      avatar: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Try to find existing user data
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      avatar: user.avatar || identity.pictureUrl || "/avatars/default.jpg",
    };
  },
});

export const createUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create a new user record
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name || "Anonymous",
      email: identity.email || "",
      phoneNumber: "",
      password: "",
      avatar: identity.pictureUrl || "/avatars/default.jpg",
    });

    return {
      name: identity.name || "Anonymous",
      email: identity.email || "",
      phoneNumber: "",
      password: "",
      avatar: identity.pictureUrl || "/avatars/default.jpg",
    };
  },
});

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    password: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Find the user record
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user record
    await ctx.db.patch(user._id, {
      name: args.name,
      email: args.email,
      phoneNumber: args.phoneNumber,
      password: args.password,
    });

    return {
      name: args.name,
      email: args.email,
      phoneNumber: args.phoneNumber,
      password: args.password,
      avatar: user.avatar || identity.pictureUrl || "/avatars/default.jpg",
    };
  },
});