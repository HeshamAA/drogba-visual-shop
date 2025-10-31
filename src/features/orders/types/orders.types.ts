// Order-related types

export type PaymentMethod =
  | "cash"
  | "vodafone cash"
  | "cod"
  | "instapay";

export interface OrderItem {
  productId: number;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderProductSummary {
  name?: string;
  productName?: string;
  size?: string;
  quantity?: number;
}

export interface Order {
  id?: number | string;
  documentId?: string;
  customer_name?: string;
  customer_phone?: string;
  phone?: string;
  customer_address?: string;
  address?: string;
  payment_method?: PaymentMethod;
  order_items?: OrderItem[];
  products?: OrderProductSummary[];
  order_products?: any[];
  total_price?: number;
  status?: "pending" | "completed" | "cancelled";
  order_status?: "pending" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}
