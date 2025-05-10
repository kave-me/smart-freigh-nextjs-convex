import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all email templates for a user
export const listEmailTemplates = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailTemplates")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get a specific email template by ID
export const getEmailTemplate = query({
  args: { templateId: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId);
  },
});

// Create a new email template
export const createEmailTemplate = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    subject: v.string(),
    action: v.optional(v.string()),
    to: v.string(),
    from: v.string(),
    bcc: v.optional(v.string()),
    cc: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailTemplates", {
      userId: args.userId,
      name: args.name,
      subject: args.subject,
      action: args.action,
      to: args.to,
      from: args.from,
      bcc: args.bcc,
      cc: args.cc,
      company: args.company,
      phone: args.phone,
      body: args.body,
    });
  },
});

// Update an existing email template
export const updateEmailTemplate = mutation({
  args: {
    templateId: v.id("emailTemplates"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    action: v.optional(v.string()),
    to: v.optional(v.string()),
    from: v.optional(v.string()),
    bcc: v.optional(v.string()),
    cc: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, ...updateFields } = args;

    // Verify the template exists
    const template = await ctx.db.get(templateId);
    if (!template) {
      throw new Error("Email template not found");
    }

    // Update only the fields that are provided
    await ctx.db.patch(templateId, updateFields);

    return templateId;
  },
});

// Delete an email template
export const deleteEmailTemplate = mutation({
  args: { templateId: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.templateId);
    return true;
  },
});
