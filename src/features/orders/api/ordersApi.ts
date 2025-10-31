import type { Order } from "@/types/strapi";
import axiosInstance from "@/lib/api/client";
type OrderProductPayload = {
  product: number; // <--- اسم الحقل (product) والنوع (id)
  name: string;
  size: string; // أو object لو كان JSON
  quantity: number;
  price: number;
  order?: string | number; // <--- إضافة order ID للربط
};

type OrderProductConnectPayload = { id: number } | { documentId: string };

type OrderProductRelationPayload = {
  create?: OrderProductPayload[];
  connect?: OrderProductConnectPayload[];
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
  order_products?: OrderProductRelationPayload | (string | number)[];
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
  const { data } = await axiosInstance.get<StrapiResponse<Order[]>>("/orders?populate=order_products&sort=createdAt:desc");
  
  console.log("Fetched orders:", data?.data);
  return Array.isArray(data?.data) ? data.data : [];
}

export async function createOrderProduct(
  orderProduct: OrderProductPayload
): Promise<OrderProductConnectPayload | null> {
  const response = await axiosInstance.post<StrapiResponse<OrderProductPayload>>("/order-products", {
    data: orderProduct,
  });

  const raw = response.data?.data;
  console.log("createOrderProduct response:", raw);

  if (!raw) {
    return null;
  }

  if (typeof raw.documentId === "string" && raw.documentId.trim().length > 0) {
    console.log("Returning documentId:", raw.documentId);
    return { documentId: raw.documentId };
  }

  if (typeof raw.id === "number") {
    console.log("Returning id:", raw.id);
    return { id: raw.id };
  }

  console.log("No valid ID found in response");
  return null;
}

export async function createOrder(order: OrderPayload): Promise<Order | null> {
  
  const response = await axiosInstance.post<StrapiResponse<Order>>("/orders", {
    data: order,
  });

  console.log(response);
  return response.data?.data ?? null;
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

export async function updateOrderProduct(
  id: string | number,
  updates: Partial<OrderProductPayload>
): Promise<any> {
  const { data } = await axiosInstance.put(`/order-products/${id}`, {
    data: updates,
  });

  return data?.data ?? null;
}

export type OrdersApiError = unknown;
export type CreateOrderPayload = OrderPayload;
export type { OrderProductConnectPayload, OrderProductPayload, OrderProductRelationPayload };
