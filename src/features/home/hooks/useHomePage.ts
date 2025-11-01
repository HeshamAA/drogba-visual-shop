import { useMemo } from "react";
import { useFeaturedProducts, useProducts } from "@/features/products/hooks/useProducts";

export function useHomePage() {
  const { featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();
  const { products, isLoading: isProductsLoading } = useProducts({ pageSize: 12 });

  const newArrivals = useMemo(() => products.slice(0, 4), [products]);

  const isLoading = isFeaturedLoading || isProductsLoading;

  return {
    featuredProducts,
    newArrivals,
    isLoading,
  };
}
