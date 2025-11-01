import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProducts } from "./useProducts";
import { useCategories } from "./useCategories";
import type { Product, CategorySummary } from "@/types/strapi";

export function useProductsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const { 
    products = [], 
    isLoading, 
    error,
  } = useProducts({
    page,
    pageSize: 12,
    filters: {
      ...(selectedCategory && { category: selectedCategory }),
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    },
    sort: sortBy === 'newest' 
      ? 'createdAt:desc' 
      : sortBy === 'price-asc' 
        ? 'price:asc' 
        : sortBy === 'price-desc' 
          ? 'price:desc' 
          : 'name:asc',
  });

  const { categories = [], loading: isCategoriesLoading } = useCategories();

  const translateCategoryName = (
    slugValue?: string | null,
    fallback?: string
  ) => {
    if (!slugValue) {
      return fallback ?? "";
    }
    const normalizedSlug = slugValue.toString().toLowerCase();
    const defaultText = fallback ?? slugValue;
    return t(`categoryNames.${normalizedSlug}`, { defaultValue: defaultText });
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Handle both normalized and raw Strapi formats
      const productData = (product as any).attributes ?? product;

      const categoryMatches = !selectedCategory
        || productData.category?.slug === selectedCategory
        || productData.category?.data?.attributes?.slug === selectedCategory
        || productData.categories?.data?.some((cat: any) => cat.attributes?.slug === selectedCategory);

      const price = productData.price ?? 0;
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;

      return categoryMatches && matchesPrice;
    });
  }, [products, selectedCategory, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    setPage(1);
  };

  const activeFiltersCount = [
    selectedCategory ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return {
    // Data
    products,
    filteredProducts,
    categories,
    isLoading,
    isCategoriesLoading,
    error,
    
    // Filters state
    page,
    setPage,
    sortBy,
    setSortBy,
    selectedCategory,
    priceRange,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    
    // Filter actions
    handleCategoryChange,
    handlePriceChange,
    clearFilters,
    
    // Helpers
    translateCategoryName,
    t,
  };
}
