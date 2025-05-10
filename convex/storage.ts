import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a URL for uploading a profile image
export const generateUploadUrl = mutation({
  args: {
    contentType: v.string(),
  },
  returns: v.string(),
  handler: async (ctx) => {
    // Generate a storage ID - note: contentType is not used in current Convex version
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a URL for a stored file
export const getUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete a stored file
export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return true;
  },
});
