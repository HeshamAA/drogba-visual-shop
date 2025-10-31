import type { Order } from "@/types/strapi";
import axiosInstance from "@/lib/api/client";
type OrderProductPayload = {
  product: number; // <--- اسم الحقل (product) والنوع (id)
  name: string;
  size: string; // أو object لو كان JSON
  quantity: number;
  price: number;
};
// 2. إصلاح الـ OrderPayload الرئيسي
type OrderPayload = Partial<Order> & {
  customer_name: string;
  customer_phone: number; // <--- تم الإصلاح
  address: string;
  total_price: number;
  payment_method?: string;
  order_status?: string; // <--- تم الإصلاح
  
  //  <--- أهم إصلاح
  order_products?: {
    create: OrderProductPayload[];
  };
};

interface StrapiResponse<T> {
  data: any;
}

const normalizeOrder = (raw: any): Order => {
  if (!raw) {
    throw new Error("Order payload is empty");
  }

  const attributes = raw.attributes ?? raw;

  return {
    id: raw.id ?? attributes?.id,
    ...attributes,
  };
};

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await axiosInstance.get<StrapiResponse<Order[]>>("/orders");

  return Array.isArray(data?.data) ? data.data : [];
}

export async function createOrder(order: OrderPayload): Promise<Order | null> {
  const { data } = await axiosInstance.post<StrapiResponse<Order>>("/orders", {
    data: order,
  });

  return data?.data ?? null;
}

export async function fetchOrderById(id: string | number): Promise<Order | null> {
  const { data } = await axiosInstance.get<StrapiResponse<Order>>(`/orders/${id}`);

  return data?.data ?? null;
}

export async function updateOrder(
  id: string | number,
  updates: Partial<Order>
): Promise<Order | null> {
  const { data } = await axiosInstance.put<StrapiResponse<Order>>(`/orders/${id}`, {
    data: updates,
  });

  return data?.data ?? null;
}

export type OrdersApiError = unknown;
export type CreateOrderPayload = OrderPayload;
