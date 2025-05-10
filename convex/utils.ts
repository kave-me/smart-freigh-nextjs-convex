import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Function to format currency values
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = query({
  args: { amount: v.number() },
  returns: v.string(),
  handler: async (ctx, args) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(args.amount);
  },
});

/**
 * Function to filter data by date range
 * @param data Array of objects with a date field
 * @param dateField Name of the date field in the objects
 * @param months Number of months to include
 * @returns Filtered array
 */
export const filterByDateRange = query({
  args: {
    data: v.array(
      v.object({
        _id: v.string(),
        date: v.number(),
      }),
    ),
    dateField: v.string(),
    months: v.number(),
  },
  returns: v.array(
    v.object({
      _id: v.string(),
      date: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const now = Date.now();
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - args.months);

    return args.data.filter((item) => {
      const itemDate = new Date(
        item[args.dateField as keyof typeof item] as number,
      );
      return itemDate >= cutoff;
    });
  },
});

/**
 * Utility functions for Convex database operations
 */

/**
 * Format a date in a user-friendly way
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Group data by a specific key
 * @param items Array of objects
 * @param key Key to group by
 * @returns Object with keys as groups and values as arrays of items
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Calculate average of numbers in an array
 * @param values Array of numbers
 * @returns Average value or 0 if array is empty
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

/**
 * Calculate the sum of a specific field across all objects in an array
 * @param items Array of objects
 * @param field Field name to sum
 * @returns Sum of the field values
 */
export function sumBy<T>(items: T[], field: keyof T): number {
  return items.reduce((sum, item) => {
    const value = Number(item[field]);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
}
