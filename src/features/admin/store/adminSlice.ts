import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product, Order, Coupon } from "@/types/strapi";
import { fetchProducts } from "@/features/products/api/productsApi";
import { fetchOrders, updateOrder } from "@/features/orders/api/ordersApi";
import { adminProductsApi } from "@/features/admin/api/admin";
import { loadJson, saveJson } from "@/shared/utils/storage";
import { mapErrorToMessage } from "@/lib/api/errorHandler";

const COUPONS_STORAGE_KEY = "admin_coupons";

const defaultCoupons: Coupon[] = [
  { code: "DROG10", type: "percent", value: 10, active: true },
];

const loadCoupons = (): Coupon[] => {
  const stored = loadJson<Coupon[]>(COUPONS_STORAGE_KEY, defaultCoupons);
  if (!Array.isArray(stored)) {
    return defaultCoupons;
  }
  return stored;
};

const saveCoupons = (coupons: Coupon[]) => {
  saveJson(COUPONS_STORAGE_KEY, coupons);
};

export interface AdminState {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AdminState = {
  products: [],
  orders: [],
  coupons: loadCoupons(),
  loading: false,
  error: null,
  initialized: false,
};

export const fetchAdminData = createAsyncThunk<
  { products: Product[]; orders: Order[] },
  void,
  { rejectValue: string }
>("admin/fetchData", async (_, { rejectWithValue }) => {
  try {
    const [products, orders] = await Promise.all([fetchProducts(), fetchOrders()]);
    return { products, orders };
  } catch (error) {
    return rejectWithValue(mapErrorToMessage(error));
  }
});

export const addAdminProduct = createAsyncThunk<
  Product,
  Partial<Product>,
  { rejectValue: string }
>("admin/addProduct", async (product, { rejectWithValue }) => {
  try {
    const created = await adminProductsApi.create(product);
    return created;
  } catch (error) {
    return rejectWithValue(mapErrorToMessage(error));
  }
});

export const updateAdminProduct = createAsyncThunk<
  Product,
  { slug: string; product: Partial<Product> },
  { rejectValue: string }
>("admin/updateProduct", async ({ slug, product }, { rejectWithValue }) => {
  try {
    const updated = await adminProductsApi.update(slug, product);
    return updated;
  } catch (error) {
    console.error("Update error:", (error as any)?.response?.data ?? error);
    return rejectWithValue(mapErrorToMessage(error));
  }
});

export const deleteAdminProduct = createAsyncThunk<
  { slug: string },
  string,
  { rejectValue: string }
>("admin/deleteProduct", async (slug, { rejectWithValue }) => {
  try {
    console.log("Deleting product:", slug);
    await adminProductsApi.delete(slug);
    return { slug };
  } catch (error) {
    return rejectWithValue(mapErrorToMessage(error));
  }
});

export const updateAdminOrderStatus = createAsyncThunk<
  { id: string | number; status: Order["status"] },
  { id: string | number; status: Order["status"] },
  { rejectValue: string }
>("admin/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    await updateOrder(id, { order_status: status ?? "pending" });
    return { id, status };
  } catch (error) {
    return rejectWithValue(mapErrorToMessage(error));
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addCoupon(state, action: PayloadAction<Coupon>) {
      const code = action.payload.code.toUpperCase();
      const existingIndex = state.coupons.findIndex((coupon) => coupon.code === code);
      const normalized = { ...action.payload, code };
      if (existingIndex > -1) {
        state.coupons[existingIndex] = normalized;
      } else {
        state.coupons.push(normalized);
      }
      saveCoupons(state.coupons);
    },
    updateCoupon(state, action: PayloadAction<{ code: string; coupon: Coupon }>) {
      const normalizedCode = action.payload.code.toUpperCase();
      state.coupons = state.coupons.map((coupon) =>
        coupon.code === normalizedCode ? { ...action.payload.coupon, code: normalizedCode } : coupon
      );
      saveCoupons(state.coupons);
    },
    deleteCoupon(state, action: PayloadAction<string>) {
      const normalizedCode = action.payload.toUpperCase();
      state.coupons = state.coupons.filter((coupon) => coupon.code !== normalizedCode);
      saveCoupons(state.coupons);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.initialized = false;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products ?? [];
        state.orders = action.payload.orders ?? [];
        state.initialized = true;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to load admin data";
        state.products = [];
        state.orders = [];
        state.initialized = true;
      })
      .addCase(addAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(addAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to add product";
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = state.products.map((product) =>
            product.id === action.payload.id ? action.payload : product
          );
        }
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to update product";
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.slug !== action.payload.slug);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to delete product";
      })
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) => {
          const orderId = order.documentId || order.id;
          const payloadId = action.payload.id;
          return String(orderId) === String(payloadId)
            ? { ...order, status: action.payload.status, order_status: action.payload.status }
            : order;
        });
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to update order status";
      });
  },
});

export const { addCoupon, updateCoupon, deleteCoupon } = adminSlice.actions;

export default adminSlice.reducer;

export const selectAdminState = (state: RootState) => state.admin;
export const selectAdminProducts = (state: RootState) => state.admin.products;
export const selectAdminOrders = (state: RootState) => state.admin.orders;
export const selectAdminCoupons = (state: RootState) => state.admin.coupons;
export const selectAdminLoading = (state: RootState) => state.admin.loading;
export const selectAdminError = (state: RootState) => state.admin.error;
