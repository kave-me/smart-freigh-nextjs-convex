import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {
    // Restrict allowed file types for security
    contentType: v.union(
      v.literal("image/jpeg"),
      v.literal("image/png"),
      v.literal("image/gif"),
      v.literal("image/webp")
    ),
  },
  returns: v.object({
    uploadUrl: v.string(),
    storageId: v.id("_storage"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Generate a temporary upload URL that's valid for 1 minute
    const uploadUrl = await ctx.storage.generateUploadUrl();
    const storageId = await ctx.storage.generateId();
    return { uploadUrl, storageId };
  },
});

export const getImageUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get a URL that's valid for 1 hour
    return await ctx.storage.getUrl(args.storageId);
  },
});