  import { useCallback } from "react";
  import { useAppDispatch, useAppSelector } from "@/app/hooks";
  import { Order, OrderItem, PaymentMethod } from "@/types/strapi";
  import {
    selectCurrentOrder,
    selectOrderError,
    selectOrderLoading,
    selectOrderSuccess,
    submitOrder as submitOrderThunk,
    clearOrderState,
  } from "@/features/orders/store/ordersSlice";

  interface CreateOrderData {
    customer_name: string;
    customer_phone: number;
    address: string;
    products: OrderItem[];
    total_price: number;
    payment_method: PaymentMethod;
  }

  const toOrderPayload = (orderData: CreateOrderData) => ({
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    address: orderData.address,
    total_price: orderData.total_price,
    payment_method: orderData.payment_method,
    order_status: "pending",
    order_products: {
      create: orderData.products.map((item) => ({
        product: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  });

  interface UseOrdersReturn {
    createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
    loading: boolean;
    error: string | null;
    currentOrder: Order | null;
    reset: () => void;
  }

  /**
   * Custom hook for order management
   * Handles order creation and related operations
   */
  export const useOrders = (): UseOrdersReturn => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectOrderLoading);
    const error = useAppSelector(selectOrderError);
    const currentOrder = useAppSelector(selectCurrentOrder);

    const createOrder = useCallback(
      async (orderData: CreateOrderData): Promise<Order | null> => {
        const payload = toOrderPayload(orderData);
        const result = await dispatch(submitOrderThunk(payload)).unwrap();
        return result;
      },
      [dispatch]
    );

    const reset = useCallback(() => {
      dispatch(clearOrderState());
    }, [dispatch]);

    return {
      createOrder,
      loading,
      error,
      currentOrder,
      reset,
    };
  };

  interface UseOrderSubmissionReturn {
    submitOrder: (orderData: CreateOrderData) => Promise<boolean>;
    loading: boolean;
    error: string | null;
    success: boolean;
    reset: () => void;
  }

  /**
   * Custom hook specifically for order submission with success state
   * Provides a cleaner interface for checkout flow
   */
  export const useOrderSubmission = (): UseOrderSubmissionReturn => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectOrderLoading);
    const error = useAppSelector(selectOrderError);
    const success = useAppSelector(selectOrderSuccess);

    const submitOrder = useCallback(
      async (orderData: CreateOrderData): Promise<boolean> => {
        const payload = toOrderPayload(orderData);
        console.log(payload);
        const result = await dispatch(submitOrderThunk(payload)).unwrap();
        return Boolean(result);
      },
      [dispatch]
    );

    const reset = useCallback(() => {
      dispatch(clearOrderState());
    }, [dispatch]);

    return {
      submitOrder,
      loading,
      error,
      success,
      reset,
    };
  };
