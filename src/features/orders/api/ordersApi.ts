import type { Order } from "@/types/strapi";
import { apiRequest, type ApiError } from "@/lib/api/client";

type OrderPayload = Partial<Order> & {
  customer_name: string;
  phone: string;
  address: string;
  total_price: number;
  payment_method?: string;
  status?: string;
  products?: Array<{
    productId: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
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

export async function createOrder(order: OrderPayload): Promise<Order | null> {
  const response = await apiRequest<StrapiResponse<Order>>({
    url: "/orders",
    method: "POST",
    data: {
      data: order,
    },
  });

  if (!response?.data) {
    return null;
  }

  return normalizeOrder(response.data);
}

export type OrdersApiError = ApiError;
export type CreateOrderPayload = OrderPayload;
