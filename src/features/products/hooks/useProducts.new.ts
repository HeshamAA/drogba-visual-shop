import { useMemo } from "react";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/lib/api/strapiApi";
import type { Product } from "../types";

interface UseProductsOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
  sort?: string;
  enabled?: boolean;
}

export function useProducts({
  page = 1,
  pageSize = 10,
  filters = {},
  sort = "createdAt:desc",
  enabled = true,
}: UseProductsOptions = {}) {
  const skip = !enabled;
  const { data, isLoading, error, refetch } = useGetProductsQuery(
    { page, pageSize, filters, sort },
    { skip }
  );
  const products = useMemo(() => data ?? [], [data]);
  return {
    products,
    isLoading,
    error,
    refetch,
  };
}

export function useProduct(id: string | number) {
  const { data, isLoading, error } = useGetProductByIdQuery(id, { skip: !id });
  return {
    product: data as Product | null,
    isLoading,
    error,
  };
}

export function useFeaturedProducts(limit = 4) {
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    pageSize: limit,
    sort: "createdAt:desc",
  });
  return {
    featuredProducts: (data ?? []) as Product[],
    isLoading,
    error,
  };
}

export default useProducts;
