/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as createTestUser from "../createTestUser.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as seed from "../seed.js";
import type * as trucks from "../trucks.js";
import type * as utils from "../utils.js";
import type * as vendors from "../vendors.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  createTestUser: typeof createTestUser;
  http: typeof http;
  invoices: typeof invoices;
  seed: typeof seed;
  trucks: typeof trucks;
  utils: typeof utils;
  vendors: typeof vendors;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
