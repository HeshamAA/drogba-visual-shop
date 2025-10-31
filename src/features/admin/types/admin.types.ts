// Admin-related types

export interface Coupon {
  code: string; // unique uppercase code
  type: "percent" | "fixed";
  value: number; // percent 1-100 or fixed amount in EGP
  minPurchase?: number; // minimum purchase amount required
  maxDiscount?: number; // max discount amount (for percent type)
  usageLimit?: number; // how many times it can be used
  usageCount?: number; // how many times it has been used
  expiresAt?: string;
}
