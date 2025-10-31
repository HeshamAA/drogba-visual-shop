import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Order } from "@/types/strapi";
import {
  createOrder as createOrderApi,
  type CreateOrderPayload,
  type OrdersApiError,
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
    console.log(payload);
    return await createOrderApi(payload);
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
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
