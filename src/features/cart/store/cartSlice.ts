import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { CartItem } from "@/features/cart/types/cart";
import { loadJson, saveJson } from "@/shared/utils/storage";

const STORAGE_KEY = "drogba-cart";
const SHIPPING_FEE = 50;

const loadItems = (): CartItem[] => {
  const stored = loadJson<CartItem[]>(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((item): item is CartItem => Boolean(item && item.id));
};

const saveItems = (items: CartItem[]) => {
  saveJson(STORAGE_KEY, items);
};

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existingIndex > -1) {
        const updated = state.items[existingIndex];
        updated.quantity += action.payload.quantity;
       
      } else {
     
        state.items.push(action.payload);
      }
      saveItems(state.items);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveItems(state.items);
    },
    incrementItem(state, action: PayloadAction<string>) {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.quantity += 1;
        saveItems(state.items);
      }
    },
    decrementItem(state, action: PayloadAction<string>) {
      const target = state.items.find((item) => item.id === action.payload);
      if (target && target.quantity > 1) {
        target.quantity -= 1;
        saveItems(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveItems(state.items);
    },
    replaceCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      saveItems(state.items);
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  clearCart,
  replaceCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotals = (state: RootState) => {
  const items = state.cart.items;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = items.length > 0 ? SHIPPING_FEE : 0;
  const payableTotal = totalPrice + shippingFee;

  return {
    totalItems,
    totalPrice,
    shippingFee,
    payableTotal,
  };
};

export const CASH_ON_DELIVERY_SHIPPING_FEE = SHIPPING_FEE;

export default cartSlice.reducer;
