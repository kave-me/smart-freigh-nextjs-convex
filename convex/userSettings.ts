import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get user settings by userId
export const getUserSettings = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("userSettings"),
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      phoneNumber: v.string(),
      profilePicture: v.optional(v.id("_storage")),
      theme: v.optional(v.string()),
      notificationPreferences: v.optional(
        v.object({
          emailNotifications: v.boolean(),
          smsNotifications: v.boolean(),
        }),
      ),
      businessSettings: v.optional(
        v.object({
          companyName: v.string(),
          companyAddress: v.string(),
          taxId: v.string(),
        }),
      ),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    // Query the userSettings table for the given userId
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    // If no settings found, return null
    if (!settings) return null;

    // Ensure the return value matches our validator schema exactly
    return {
      _id: settings._id,
      userId: settings.userId,
      name: settings.name,
      email: settings.email,
      phoneNumber: settings.phoneNumber,
      ...(settings.profilePicture && {
        profilePicture: settings.profilePicture,
      }),
      ...(settings.theme && { theme: settings.theme }),
      ...(settings.notificationPreferences && {
        notificationPreferences: settings.notificationPreferences,
      }),
      ...(settings.businessSettings && {
        businessSettings: settings.businessSettings,
      }),
    };
  },
});

// Create user settings
export const createUserSettings = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    profilePicture: v.optional(v.id("_storage")),
    theme: v.optional(v.string()),
    notificationPreferences: v.optional(
      v.object({
        emailNotifications: v.boolean(),
        smsNotifications: v.boolean(),
      }),
    ),
    businessSettings: v.optional(
      v.object({
        companyName: v.string(),
        companyAddress: v.string(),
        taxId: v.string(),
      }),
    ),
  },
  returns: v.id("userSettings"),
  handler: async (ctx, args) => {
    // Check if settings already exist for this user
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingSettings) {
      throw new Error("Settings already exist for this user");
    }

    // Create new user settings
    return await ctx.db.insert("userSettings", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      phoneNumber: args.phoneNumber,
      profilePicture: args.profilePicture,
      theme: args.theme,
      notificationPreferences: args.notificationPreferences,
      businessSettings: args.businessSettings,
    });
  },
});

// Update user settings
export const updateUserSettings = mutation({
  args: {
    settingsId: v.id("userSettings"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    profilePicture: v.optional(v.id("_storage")),
    theme: v.optional(v.string()),
    notificationPreferences: v.optional(
      v.object({
        emailNotifications: v.boolean(),
        smsNotifications: v.boolean(),
      }),
    ),
    businessSettings: v.optional(
      v.object({
        companyName: v.string(),
        companyAddress: v.string(),
        taxId: v.string(),
      }),
    ),
  },
  returns: v.id("userSettings"),
  handler: async (ctx, args) => {
    // Verify settings exist
    const existingSettings = await ctx.db.get(args.settingsId);
    if (!existingSettings) {
      throw new Error("Settings not found");
    }

    // Create an object with only the fields that are being updated
    type UpdateFields = Partial<{
      name: string;
      email: string;
      phoneNumber: string;
      profilePicture: Id<"_storage">;
      theme: string;
      notificationPreferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
      };
      businessSettings: {
        companyName: string;
        companyAddress: string;
        taxId: string;
      };
    }>;

    const updateFields: UpdateFields = {};

    if (args.name !== undefined) updateFields.name = args.name;
    if (args.email !== undefined) updateFields.email = args.email;
    if (args.phoneNumber !== undefined)
      updateFields.phoneNumber = args.phoneNumber;
    if (args.profilePicture !== undefined)
      updateFields.profilePicture = args.profilePicture;
    if (args.theme !== undefined) updateFields.theme = args.theme;
    if (args.notificationPreferences !== undefined)
      updateFields.notificationPreferences = args.notificationPreferences;
    if (args.businessSettings !== undefined)
      updateFields.businessSettings = args.businessSettings;

    // Update the settings - calling patch first for the change to actually happen
    await ctx.db.patch(args.settingsId, updateFields);

    // Return the ID as required by the return type
    return args.settingsId;
  },
});

// Delete user settings
export const deleteUserSettings = mutation({
  args: { settingsId: v.id("userSettings") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.settingsId);
    return null;
  },
});

// Get profile picture URL
export const getProfilePictureUrl = query({
  args: { storageId: v.optional(v.id("_storage")) },
  returns: v.string(),
  handler: async (ctx, args) => {
    if (!args.storageId) {
      return "";
    }
    const url = await ctx.storage.getUrl(args.storageId);
    return url || "";
  },
});

// Get user settings by user ID or create default if not exists
export const getOrCreateUserSettings = mutation({
  args: {
    userId: v.id("users"),
    defaultName: v.string(),
    defaultEmail: v.string(),
    defaultPhone: v.string(),
  },
  returns: v.id("userSettings"),
  handler: async (ctx, args) => {
    // Try to find existing settings
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingSettings) {
      return existingSettings._id;
    }

    // Create default settings if none exist
    const settingsId = await ctx.db.insert("userSettings", {
      userId: args.userId,
      name: args.defaultName,
      email: args.defaultEmail,
      phoneNumber: args.defaultPhone,
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
      },
      // Include empty business settings to ensure it matches the schema
      businessSettings: {
        companyName: "",
        companyAddress: "",
        taxId: "",
      },
    });

    return settingsId;
  },
});

// Fix or reset user settings
export const fixUserSettings = mutation({
  args: {
    userId: v.id("users"),
  },
  returns: v.id("userSettings"),
  handler: async (ctx, args) => {
    // Find existing settings
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    // If settings exist, delete them
    if (existingSettings) {
      await ctx.db.delete(existingSettings._id);
    }

    // Create new settings with all required fields properly defined
    const settingsId = await ctx.db.insert("userSettings", {
      userId: args.userId,
      name: "Your Name",
      email: "your.email@example.com",
      phoneNumber: "555-555-5555",
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
      },
      // Include empty business settings object to ensure it's properly formed
      businessSettings: {
        companyName: "",
        companyAddress: "",
        taxId: "",
      },
    });

    return settingsId;
  },
});

// Fix all user settings in the database
export const fixAllUserSettings = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all user settings
    const allSettings = await ctx.db.query("userSettings").collect();
    let fixedCount = 0;

    // Process each setting
    for (const settings of allSettings) {
      try {
        // Check if this setting already has proper format
        if (
          settings.userId &&
          settings.name &&
          settings.email &&
          settings.phoneNumber
        ) {
          // Ensure notificationPreferences exists
          if (!settings.notificationPreferences) {
            await ctx.db.patch(settings._id, {
              notificationPreferences: {
                emailNotifications: true,
                smsNotifications: false,
              },
            });
            fixedCount++;
          }

          // Ensure businessSettings exists
          if (!settings.businessSettings) {
            await ctx.db.patch(settings._id, {
              businessSettings: {
                companyName: "",
                companyAddress: "",
                taxId: "",
              },
            });
            fixedCount++;
          }
        } else {
          // If setting is missing required fields, delete and recreate it
          // Get the user ID
          const userId = settings.userId;

          // Delete the bad setting
          await ctx.db.delete(settings._id);

          // Create new settings with all required fields
          await ctx.db.insert("userSettings", {
            userId,
            name: "Your Name",
            email: "your.email@example.com",
            phoneNumber: "555-555-5555",
            notificationPreferences: {
              emailNotifications: true,
              smsNotifications: false,
            },
            businessSettings: {
              companyName: "",
              companyAddress: "",
              taxId: "",
            },
          });

          fixedCount++;
        }
      } catch (error) {
        console.error("Error fixing user settings:", error);
      }
    }

    return fixedCount;
  },
});
