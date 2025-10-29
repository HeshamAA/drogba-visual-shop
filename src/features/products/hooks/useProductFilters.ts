import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/types/strapi";

interface FilterState {
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

export function useProductFilters(products: Product[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("maxPrice") || ""
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") || "default"
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (minPrice) {
      params.set("minPrice", minPrice);
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }
    if (sortBy !== "default") {
      params.set("sort", sortBy);
    }

    const currentParams = searchParams.toString();
    const newParams = params.toString();

    if (currentParams !== newParams) {
      setSearchParams(params, { replace: true });
    }
  }, [
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    searchParams,
    setSearchParams,
  ]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.slug === selectedCategory
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    // Sort products
    if (sortBy === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, selectedCategory, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  return {
    showFilters,
    setShowFilters,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    filteredProducts,
    clearFilters,
    activeFiltersCount,
  };
}
