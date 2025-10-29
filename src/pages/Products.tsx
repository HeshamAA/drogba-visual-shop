import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductCard from "@/components/products/ProductCard";
import FiltersPanel from "@/components/products/FiltersPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const { t } = useTranslation();
  const { products, loading, error, refetch } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // Debug: Log products

  // Use filter hook for all filter logic
  const {
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
  } = useProductFilters(products);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">{t("nav.shop")}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">{t("nav.shop")}</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">{t("nav.shop")}</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] border-2 border-border">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">الافتراضي</SelectItem>
              <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="name-asc">الاسم: أ-ي</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="relative border-2"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            فلتر
            {activeFiltersCount > 0 && (
              <span
                className={`ml-2 text-xs rounded-full px-2 py-0.5 ${
                  showFilters
                    ? "bg-white text-primary"
                    : "bg-primary text-white"
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <FiltersPanel
        show={showFilters}
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-lg mb-2">
            {products.length === 0
              ? "لا توجد منتجات"
              : "لا توجد منتجات تطابق الفلتر المحدد"}
          </p>
          {products.length === 0 && (
            <p className="text-sm text-muted-foreground">
              تأكد من أن الـ API يعمل على http://localhost:1337
            </p>
          )}
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              مسح الفلاتر
            </Button>
          )}
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
      )}
    </div>
  );
}
