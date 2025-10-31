import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Order } from "@/types/strapi";
import {
  createOrder as createOrderApi,
  createOrderProduct,
  updateOrderProduct,
  type CreateOrderPayload,
  type OrdersApiError,
  type OrderProductConnectPayload,
} from "../api/ordersApi";
import { toErrorMessage } from "@/lib/api/errorHandler";

interface OrdersState {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrdersState = {
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

export const submitOrder = createAsyncThunk<
  Order | null,
  CreateOrderPayload,
  { rejectValue: OrdersApiError }
>("orders/submit", async (payload, { rejectWithValue }) => {
  try {
    // Check if order_products is already an array of IDs
    if (Array.isArray(payload.order_products)) {
      return await createOrderApi(payload);
    }

    const productsToCreate = payload.order_products?.create ?? [];

    // Step 1: Create the order WITHOUT products
    const { order_products, ...orderDataWithoutProducts } = payload;
    const createdOrder = await createOrderApi(orderDataWithoutProducts);

    if (!createdOrder) {
      throw new Error("Failed to create order");
    }

    const orderId = (createdOrder as any).documentId || createdOrder.id;
    if (!orderId) {
      throw new Error("Order created but no ID returned");
    }

    // Step 2: Create order products and link them to the order
    if (productsToCreate.length > 0) {
      await Promise.all(
        productsToCreate.map(async (product) => {
          // Create order product without order relation first
          const created = await createOrderProduct(product);

          if (!created) {
            throw new Error("Failed to create order product");
          }

          // Then update it to link with the order
          const productId = 'documentId' in created ? created.documentId : created.id;
          if (productId) {
            await updateOrderProduct(productId, { order: orderId });
          }

          return created;
        })
      );
    }

    return createdOrder;
  } catch (error) {
    return rejectWithValue(error as OrdersApiError);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderState(state) {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload ?? null;
        state.success = Boolean(action.payload);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload ?? action.error?.message);
        state.success = false;
      });
  },
});

export const { clearOrderState } = ordersSlice.actions;

export default ordersSlice.reducer;

export const selectOrdersState = (state: RootState) => state.orders;
export const selectOrderLoading = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;
export const selectOrderSuccess = (state: RootState) => state.orders.success;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
