import { ApiResponse } from "../types";

/**
 * Generic function <T> - builds a consistent, type-safe response envelope
 * regardless of what kind of data is being returned (User, Product, Order[], etc.)
 */
export function createResponse<T>(
  success: boolean,
  data?: T,
  message?: string
): ApiResponse<T> {
  return { success, data, message };
}
