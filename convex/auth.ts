// Auth implementation removed for MVP
// This file provides mock functions that allow the app to run without authentication
import { DatabaseReader } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const auth = {
  getUserIdentity: async () => {
    return {
      tokenIdentifier: "mock-token",
      name: "Mock User",
      email: "mock@example.com",
    };
  },
};
export const signIn = async () => {
  console.log("Sign-in called - no auth for MVP");
  return true;
};
export const signOut = async () => {
  console.log("Sign-out called - no auth for MVP");
  return true;
};
export const store = { createUserRecord: async () => true };
export const isAuthenticated = async () => true; // Always authenticated for MVP

// Helper function to get the current user ID - returns the first user for MVP
export async function getCurrentUserId(ctx: {
  db: DatabaseReader;
}): Promise<Id<"users"> | null> {
  // Get the first user in the database for the MVP
  const firstUser = await ctx.db.query("users").first();
  return firstUser?._id || null;
}
