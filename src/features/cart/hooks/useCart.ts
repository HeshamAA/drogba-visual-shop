import { useCallback } from "react";
import type { CartItem } from "@/features/cart/types/cart";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  incrementItem as incrementItemAction,
  decrementItem as decrementItemAction,
  clearCart as clearCartAction,
  replaceCart as replaceCartAction,
  selectCartItems,
  selectCartTotals,
  CASH_ON_DELIVERY_SHIPPING_FEE,
} from "@/features/cart/store/cartSlice";

export interface UseCartResult {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  replaceCart: (items: CartItem[]) => void;
  totalItems: number;
  totalPrice: number;
  shippingFee: number;
  payableTotal: number;
}

export const useCart = (): UseCartResult => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const shippingFee = totals.shippingFee ?? (items.length > 0 ? CASH_ON_DELIVERY_SHIPPING_FEE : 0);

  const addItem = useCallback(
    (item: CartItem) => {
      dispatch(addItemAction(item));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removeItemAction(id));
    },
    [dispatch],
  );

  const incrementItem = useCallback(
    (id: string) => {
      dispatch(incrementItemAction(id));
    },
    [dispatch],
  );

  const decrementItem = useCallback(
    (id: string) => {
      dispatch(decrementItemAction(id));
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const replaceCart = useCallback(
    (nextItems: CartItem[]) => {
      dispatch(replaceCartAction(nextItems));
    },
    [dispatch],
  );

  return {
    items,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
    replaceCart,
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
    shippingFee,
    payableTotal: totals.payableTotal,
  };
};

export { CASH_ON_DELIVERY_SHIPPING_FEE };
