import { useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { Product } from "@/types/strapi";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductBySlug,
  selectProductsError,
  selectProductsList,
  selectProductsLoading,
  selectProductDetailLoading,
  selectProductDetailError,
  selectProductBySlug,
  selectFeaturedProducts,
  selectFeaturedProductsLoading,
  selectFeaturedProductsError,
} from "../store/productsSlice";

interface UseProductsOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
  sort?: string;
  enabled?: boolean;
}

export function useProductBySlug(slug: string) {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => selectProductBySlug(state, slug));
  const isLoading = useAppSelector(selectProductDetailLoading);
  const error = useAppSelector(selectProductDetailError);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  return {
    product: product ?? null,
    isLoading,
    error,
  };
}

export function useProducts({
  enabled = true,
}: UseProductsOptions = {}) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsList);
  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (enabled) {
      dispatch(fetchProducts());
    }
  }, [dispatch, enabled]);

  const refetch = useCallback(() => {
    if (enabled) {
      dispatch(fetchProducts());
    }
  }, [dispatch, enabled]);

  const normalizedProducts = useMemo(() => products ?? [], [products]);

  return {
    products: normalizedProducts,
    isLoading: enabled ? isLoading : false,
    error,
    refetch,
  };
}

export const useProduct = useProductBySlug;

export function useFeaturedProducts(limit = 4) {
  const dispatch = useAppDispatch();
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const isLoading = useAppSelector(selectFeaturedProductsLoading);
  const error = useAppSelector(selectFeaturedProductsError);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(limit));
  }, [dispatch, limit]);

  return {
    featuredProducts: featuredProducts ?? [],
    isLoading,
    error,
  };
}

export default useProducts;
