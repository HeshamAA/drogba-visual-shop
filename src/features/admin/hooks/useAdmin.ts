import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { Coupon, Order, Product } from "@/types/strapi";
import {
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateAdminOrderStatus,
  fetchAdminData,
  addCoupon as addCouponAction,
  updateCoupon as updateCouponAction,
  deleteCoupon as deleteCouponAction,
  selectAdminProducts,
  selectAdminOrders,
  selectAdminCoupons,
  selectAdminLoading,
  selectAdminError,
} from "@/features/admin/store/adminSlice";

export interface UseAdminResult {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => Promise<Product>;
  updateProduct: (id: string | number, product: Product) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  updateOrderStatus: (id: string | number, status: Order["status"]) => Promise<void>;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  refetch: () => Promise<void>;
}

export const useAdmin = (): UseAdminResult => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAdminProducts);
  const orders = useAppSelector(selectAdminOrders);
  const coupons = useAppSelector(selectAdminCoupons);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);
  const initialized = useAppSelector((state) => state.admin.initialized);

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, initialized, loading]);

  const addProduct = useCallback(
    async (product: Product) => {
      const result = await dispatch(addAdminProduct(product)).unwrap();
      return result;
    },
    [dispatch],
  );

  const updateProduct = useCallback(
    async (id: string | number, product: Product) => {
      const result = await dispatch(updateAdminProduct({ id, product })).unwrap();
      return result;
    },
    [dispatch],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      await dispatch(deleteAdminProduct(id)).unwrap();
    },
    [dispatch],
  );

  const updateOrderStatus = useCallback(
    async (id: string | number, status: Order["status"]) => {
      await dispatch(updateAdminOrderStatus({ id, status })).unwrap();
    },
    [dispatch],
  );

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      dispatch(addCouponAction(coupon));
    },
    [dispatch],
  );

  const updateCoupon = useCallback(
    (code: string, coupon: Coupon) => {
      dispatch(updateCouponAction({ code, coupon }));
    },
    [dispatch],
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      dispatch(deleteCouponAction(code));
    },
    [dispatch],
  );

  const refetch = useCallback(async () => {
    await dispatch(fetchAdminData()).unwrap();
  }, [dispatch]);

  return {
    products,
    orders,
    coupons,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    refetch,
  };
};
