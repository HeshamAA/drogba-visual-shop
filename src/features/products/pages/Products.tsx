import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useProductFilters } from "../hooks/useProductFilters";
import ProductCard from "../components/ProductCard";
import FiltersPanel from "../components/FiltersPanel";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import type { Product, CategorySummary } from "@/types/strapi";

export default function Products() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  // Get products with filters
  const { 
    products = [], 
    isLoading, 
    error, 
    prefetchNextPage,
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

  // Prefetch next page when page changes
  useEffect(() => {
    if (page > 1 && typeof prefetchNextPage === 'function') {
      prefetchNextPage();
    }
  }, [page, prefetchNextPage]);

  // Get categories for filters
  const { categories = [], loading: isCategoriesLoading } = useCategories();
  console.log(products);
  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const productData = product.attributes ?? product;

      const categoryMatches = !selectedCategory
        || productData.category?.slug === selectedCategory
        || productData.categories?.data?.some((cat) => cat.attributes.slug === selectedCategory);

      const price = productData.price ?? 0;
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;

      return categoryMatches && matchesPrice;
    });
  }, [products, selectedCategory, priceRange]);

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page when filters change
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

  // Loading state
  if (isLoading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">{t("nav.shop")}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            {t("errors.failedToLoadProducts")}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("common.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate active filters count
  const activeFiltersCount = [
    selectedCategory ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">{t("nav.shop")}</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t("filters.title")}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <div className="w-48">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("sort.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                <SelectItem value="price-asc">
                  {t("sort.priceLowToHigh")}
                </SelectItem>
                <SelectItem value="price-desc">
                  {t("sort.priceHighToLow")}
                </SelectItem>
                <SelectItem value="name-asc">
                  {t("sort.nameAtoZ")}
                </SelectItem>
                <SelectItem value="name-desc">
                  {t("sort.nameZtoA")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-64 shrink-0 hidden md:block">
          <h3 className="font-medium mb-4">{t("filters.categories")}</h3>
          <div className="space-y-2">
            <Button
              variant={!selectedCategory ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleCategoryChange('')}
            >
              {t("filters.allCategories")}
            </Button>
            {isCategoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              categories.map((category: any) => {
                const categoryData: CategorySummary = category?.attributes ?? category;
                const slug = categoryData.slug ?? String(category.id ?? "");
                const name = categoryData.name ?? slug;

                return (
                  <Button
                    key={slug}
                    variant={selectedCategory === slug ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange(slug)}
                  >
                    {name}
                  </Button>
                );
              })
            )}
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-4">{t("filters.priceRange")}</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("filters.min")}
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), priceRange.max)
                    }
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("filters.max")}
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceChange(priceRange.min, Number(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                    min={priceRange.min + 1}
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t("products.noProducts")}
              </p>
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("products.checkApi")}
                </p>
              )}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="mt-4"
                >
                  {t("filters.clearFilters")}
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            عرض {filteredProducts.length} من {products.length} منتج
          </div>
        </>
      )
    </div>
</div>
  );
}
