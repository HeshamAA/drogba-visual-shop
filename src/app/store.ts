import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { strapiApi } from "@/lib/api/strapiApi";

export interface RootState {
  // Add other slices here as you create them
}

export const store = configureStore({
  reducer: {
    // Add other reducers here
    [strapiApi.reducerPath]: strapiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(strapiApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
