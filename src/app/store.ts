import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import productsReducer from "@/features/products/store/productsSlice";
import categoriesReducer from "@/features/categories/store/categoriesSlice";
import ordersReducer from "@/features/orders/store/ordersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
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
