/**
 * Legacy Strapi utilities
 * 
 * This file is kept for backward compatibility and contains only utility functions.
 * All API calls have been moved to feature-specific API files:
 * - Products: @/features/products/api/productsApi
 * - Categories: @/features/categories/api/categoriesApi
 * - Orders: @/features/orders/api/ordersApi
 * - Admin: @/features/admin/api/admin
 */

// Base URLs
const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";

/**
 * Converts a Strapi media path to a full URL
 * @param path - The path from Strapi (can be relative or absolute)
 * @returns Full URL to the image
 */
export function getImageUrl(path?: string | null): string {
  if (!path) return "/public/placeholder.svg";
  if (/^https?:\/\//i.test(path)) return path;
  return RAW_BASE_URL.replace(/\/$/, "") + path;
}

export default {
  getImageUrl,
};
