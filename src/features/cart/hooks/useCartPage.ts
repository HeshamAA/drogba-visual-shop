import { useTranslation } from "react-i18next";
import { useCart } from "@/features/cart";

export function useCartPage() {
  const { t } = useTranslation();
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    totalPrice,
    shippingFee,
    payableTotal,
  } = useCart();

  const isEmpty = items.length === 0;

  return {
    // Data
    items,
    totalPrice,
    shippingFee,
    payableTotal,
    isEmpty,
    
    // Actions
    removeItem,
    incrementItem,
    decrementItem,
    
    // Helpers
    t,
  };
}
