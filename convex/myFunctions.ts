import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";

// Internal function to get raw user data for debugging
export const _getFirstUserRaw = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return user;
  },
});

// Get user by clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      image: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});

// Get the first user in the system - used for MVP without auth
export const getFirstUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      image: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return user;
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      image: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

// Create a user if one doesn't exist with the given clerk ID
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
    });
  },
});

// Create a function to fix existing users by adding clerkId
export const fixExistingUsers = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    let fixedCount = 0;

    // Loop through users and add clerkId if missing
    for (const user of users) {
      if (!user.clerkId) {
        await ctx.db.patch(user._id, {
          clerkId: "fixed_" + Math.random().toString(36).substring(2, 15),
        });
        fixedCount++;
      }
    }

    return fixedCount;
  },
});

// Create a properly formed test user
export const createProperTestUser = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    // Delete existing users first
    const existingUsers = await ctx.db.query("users").collect();
    for (const user of existingUsers) {
      await ctx.db.delete(user._id);
    }

    // Create a new user with all required fields
    return await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      clerkId: "test_" + Math.random().toString(36).substring(2, 15),
      isAnonymous: false,
    });
  },
});

// // import { v } from "convex/values";
// // import { query, mutation, action } from "./_generated/server";
// // import { api } from "./_generated/api";
// // import { getAuthUserId } from "@convex-dev/auth/server";

// // // Write your Convex functions in any file inside this directory (`convex`).
// // // See https://docs.convex.dev/functions for more.

// // // You can read data from the database via a query:
// // export const listNumbers = query({
// //   // Validators for arguments.
// //   args: {
// //     count: v.number(),
// //   },

// //   // Query implementation.
// //   handler: async (ctx, args) => {
// //     //// Read the database as many times as you need here.
// //     //// See https://docs.convex.dev/database/reading-data.
// //     const numbers = await ctx.db
// //       .query("numbers")
// //       // Ordered by _creationTime, return most recent
// //       .order("desc")
// //       .take(args.count);
// //     const userId = await getAuthUserId(ctx);
// //     const user = userId === null ? null : await ctx.db.get(userId);
// //     return {
// //       viewer: user?.email ?? null,
// //       numbers: numbers.reverse().map((number) => number.value),
// //     };
// //   },
// // });

// // // You can write data to the database via a mutation:
// // export const addNumber = mutation({
// //   // Validators for arguments.
// //   args: {
// //     value: v.number(),
// //   },

// //   // Mutation implementation.
// //   handler: async (ctx, args) => {
// //     //// Insert or modify documents in the database here.
// //     //// Mutations can also read from the database like queries.
// //     //// See https://docs.convex.dev/database/writing-data.

// //     const id = await ctx.db.insert("numbers", { value: args.value });

// //     console.log("Added new document with id:", id);
// //     // Optionally, return a value from your mutation.
// //     // return id;
// //   },
// // });

// // // You can fetch data from and send data to third-party APIs via an action:
// // export const myAction = action({
// //   // Validators for arguments.
// //   args: {
// //     first: v.number(),
// //     second: v.string(),
// //   },

// //   // Action implementation.
// //   handler: async (ctx, args) => {
// //     //// Use the browser-like `fetch` API to send HTTP requests.
// //     //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
// //     // const response = await ctx.fetch("https://api.thirdpartyservice.com");
// //     // const data = await response.json();

// //     //// Query data by running Convex queries.
// //     const data = await ctx.runQuery(api.myFunctions.listNumbers, {
// //       count: 10,
// //     });
// //     console.log(data);

// //     //// Write data by running Convex mutations.
// //     await ctx.runMutation(api.myFunctions.addNumber, {
// //       value: args.first,
// //     });
// //   },
// // });
