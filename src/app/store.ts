import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import productsReducer from "@/features/products/store/productsSlice";
import categoriesReducer from "@/features/categories/store/categoriesSlice";
import ordersReducer from "@/features/orders/store/ordersSlice";
import cartReducer from "@/features/cart/store/cartSlice";
import adminReducer from "@/features/admin/store/adminSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    cart: cartReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
