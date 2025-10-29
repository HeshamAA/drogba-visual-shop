import { useState } from "react";
import { Order, OrderItem } from "@/types/strapi";
import { useCreateOrderMutation } from "@/lib/api/strapiApi";

interface CreateOrderData {
  customer_name: string;
  phone: string;
  address: string;
  products: OrderItem[];
  total_price: number;
}

interface UseOrdersReturn {
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for order management
 * Handles order creation and related operations
 */
export const useOrders = (): UseOrdersReturn => {
  const [createOrderApi, { isLoading: loading, error }] =
    useCreateOrderMutation();

  const createOrder = async (
    orderData: CreateOrderData
  ): Promise<Order | null> => {
    const order = await createOrderApi({
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      address: orderData.address,
      total_price: orderData.total_price,
      payment_method: "cash_on_delivery",
      status: "pending",
      products: orderData.products.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    }).unwrap();
    return order as unknown as Order;
  };

  return {
    createOrder,
    loading,
    error: error
      ? "status" in (error as any)
        ? String((error as any).status)
        : "Error"
      : null,
  };
};

interface UseOrderSubmissionReturn {
  submitOrder: (orderData: CreateOrderData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Custom hook specifically for order submission with success state
 * Provides a cleaner interface for checkout flow
 */
export const useOrderSubmission = (): UseOrderSubmissionReturn => {
  const [createOrderApi, { isLoading: loading, error }] =
    useCreateOrderMutation();
  const [success, setSuccess] = useState(false);

  const submitOrder = async (orderData: CreateOrderData): Promise<boolean> => {
    setSuccess(false);
    const order = await createOrderApi({
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      address: orderData.address,
      total_price: orderData.total_price,
      payment_method: "cash_on_delivery",
      status: "pending",
      products: orderData.products.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    }).unwrap();
    if (order) {
      setSuccess(true);
      return true;
    }
    return false;
  };

  return {
    submitOrder,
    loading,
    error: error
      ? "status" in (error as any)
        ? String((error as any).status)
        : "Error"
      : null,
    success,
  };
};
