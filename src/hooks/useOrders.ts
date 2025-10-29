import { useState } from "react";
import { Order, OrderItem } from "@/types/strapi";
import { ordersApi } from "@/api/strapi";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    orderData: CreateOrderData
  ): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      // Transform the order data to match Strapi's expected format
      const strapiOrderData = {
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        address: orderData.address,
        total_price: orderData.total_price,
        payment_method: "cash_on_delivery" as const,
        status: "pending" as const,
        products: orderData.products.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const order = await ordersApi.create(strapiOrderData);
      return order;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      console.error("Error in createOrder:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitOrder = async (orderData: CreateOrderData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const order = await ordersApi.create({
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
      });

      if (order) {
        setSuccess(true);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit order";
      setError(errorMessage);
      console.error("Error in submitOrder:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitOrder,
    loading,
    error,
    success,
  };
};
