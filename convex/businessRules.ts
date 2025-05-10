import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./utils";

// Define types for better TypeScript support
export type BusinessRule = {
  _id: Id<"businessRules">;
  name: string;
  categoryId: Id<"businessRuleCategories">;
  enabled: boolean;
  fileId?: Id<"_storage">;
  userId: Id<"users">;
};

export type BusinessRuleCategory = {
  _id: Id<"businessRuleCategories">;
  name: string;
  userId: Id<"users">;
};

// Get all business rule categories for the current user
export const getBusinessRuleCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const categories = await ctx.db
      .query("businessRuleCategories")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return categories;
  },
});

// Get all business rules for a category
export const getBusinessRulesByCategory = query({
  args: {
    categoryId: v.id("businessRuleCategories"),
  },
  handler: async (ctx, args) => {
    const rules = await ctx.db
      .query("businessRules")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    return rules;
  },
});

// Create a new business rule category
export const createBusinessRuleCategory = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const categoryId = await ctx.db.insert("businessRuleCategories", {
      name: args.name,
      userId,
    });

    return categoryId;
  },
});

// Update a business rule category
export const updateBusinessRuleCategory = mutation({
  args: {
    categoryId: v.id("businessRuleCategories"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Verify category belongs to user
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found or access denied");
    }

    await ctx.db.patch(args.categoryId, {
      name: args.name,
    });

    return args.categoryId;
  },
});

// Delete a business rule category
export const deleteBusinessRuleCategory = mutation({
  args: {
    categoryId: v.id("businessRuleCategories"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Verify category belongs to user
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found or access denied");
    }

    // Get all rules in this category
    const rules = await ctx.db
      .query("businessRules")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    // Delete all rules in this category
    for (const rule of rules) {
      await ctx.db.delete(rule._id);
    }

    // Delete the category
    await ctx.db.delete(args.categoryId);

    return true;
  },
});

// Create a new business rule
export const createBusinessRule = mutation({
  args: {
    name: v.string(),
    categoryId: v.id("businessRuleCategories"),
    fileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Verify category belongs to user
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found or access denied");
    }

    // Get existing rules in this category
    const existingRules = await ctx.db
      .query("businessRules")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    // Set enabled to true if this is the first rule in the category, false otherwise
    const enabled = existingRules.length === 0;

    const ruleId = await ctx.db.insert("businessRules", {
      name: args.name,
      categoryId: args.categoryId,
      enabled,
      fileId: args.fileId,
      userId,
    });

    return ruleId;
  },
});

// Delete a business rule
export const deleteBusinessRule = mutation({
  args: {
    ruleId: v.id("businessRules"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Verify rule belongs to user
    const rule = await ctx.db.get(args.ruleId);
    if (!rule || rule.userId !== userId) {
      throw new Error("Rule not found or access denied");
    }

    // Check if this is the active rule
    if (rule.enabled) {
      // Find the most recent rule in the same category
      const rules = await ctx.db
        .query("businessRules")
        .withIndex("by_categoryId", (q) => q.eq("categoryId", rule.categoryId))
        .filter((q) => q.neq(q.field("_id"), args.ruleId))
        .collect();

      if (rules.length > 0) {
        // Sort by ID (newer IDs are lexicographically greater)
        rules.sort((a, b) => (a._id > b._id ? -1 : 1));
        // Enable the most recent rule
        await ctx.db.patch(rules[0]._id, { enabled: true });
      }
    }

    // Delete the rule
    await ctx.db.delete(args.ruleId);

    return true;
  },
});

// Toggle a business rule (set as active)
export const toggleBusinessRule = mutation({
  args: {
    ruleId: v.id("businessRules"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Verify rule belongs to user
    const rule = await ctx.db.get(args.ruleId);
    if (!rule || rule.userId !== userId) {
      throw new Error("Rule not found or access denied");
    }

    // If already enabled, do nothing
    if (rule.enabled) return args.ruleId;

    // Disable all other rules in the same category
    const otherRules = await ctx.db
      .query("businessRules")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", rule.categoryId))
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();

    for (const otherRule of otherRules) {
      await ctx.db.patch(otherRule._id, { enabled: false });
    }

    // Enable this rule
    await ctx.db.patch(args.ruleId, { enabled: true });

    return args.ruleId;
  },
});

// Generate upload URL for rule files
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
