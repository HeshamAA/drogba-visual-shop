import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle, RefreshCw, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useState, useMemo } from "react";
import type { Product, CategorySummary } from "@/types/strapi";
import { motion, AnimatePresence } from "framer-motion";

export default function Products() {
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
      const productData = product.attributes ?? product;

      const categoryMatches = !selectedCategory
        || productData.category?.slug === selectedCategory
        || productData.categories?.data?.some((cat) => cat.attributes.slug === selectedCategory);

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

  // Loading state
  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          <div className="container mx-auto px-4 py-16 relative">
            <Skeleton className="h-12 w-64 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 bg-white/10" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4 rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                <Skeleton className="h-64 w-full rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="flex flex-col gap-3">
              <span>{t("errors.failedToLoadProducts")}</span>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("common.retry")}
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header with Gradient Background */}
      <div className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/90">{filteredProducts.length} منتج متاح</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {t("nav.shop")}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              اكتشف مجموعتنا المتنوعة من المنتجات عالية الجودة
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sort Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                className="md:hidden relative"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("filters.title")}
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-lg">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Active Filters Pills */}
              <AnimatePresence>
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-sm font-medium">
                      {translateCategoryName(selectedCategory, selectedCategory)}
                    </span>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                )}
                {(priceRange.min > 0 || priceRange.max < 1000) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-sm font-medium">
                      ${priceRange.min} - ${priceRange.max}
                    </span>
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 1000 })}
                      className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  مسح الكل
                </Button>
              )}
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-56 bg-background/50">
                <SelectValue placeholder={t("sort.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                <SelectItem value="price-asc">{t("sort.priceLowToHigh")}</SelectItem>
                <SelectItem value="price-desc">{t("sort.priceHighToLow")}</SelectItem>
                <SelectItem value="name-asc">{t("sort.nameAtoZ")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-72 shrink-0"
          >
            <div className="sticky top-24 bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-accent" />
                  {t("filters.categories")}
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={!selectedCategory ? 'default' : 'ghost'}
                    className="w-full justify-start rounded-xl hover:bg-accent/10 transition-all"
                    onClick={() => handleCategoryChange('')}
                  >
                    {t("filters.allCategories")}
                  </Button>
                  {isCategoriesLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-xl" />
                    ))
                  ) : (
                    categories.map((category: any) => {
                      const categoryData: CategorySummary = category?.attributes ?? category;
                      const slug = categoryData.slug ?? String(category.id ?? "");
                      const name = categoryData.name ?? slug;
                      const displayName = translateCategoryName(slug, name);

                      return (
                        <Button
                          key={slug}
                          variant={selectedCategory === slug ? 'default' : 'ghost'}
                          className="w-full justify-start rounded-xl hover:bg-accent/10 transition-all"
                          onClick={() => handleCategoryChange(slug)}
                        >
                          {displayName}
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-accent" />
                  {t("filters.priceRange")}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        {t("filters.minPrice")}
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                        className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        {t("filters.maxPrice")}
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                        min={priceRange.min + 1}
                      />
                    </div>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-accent/20 to-accent rounded-full" />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  className="absolute left-0 top-0 bottom-0 w-80 bg-card border-r border-border shadow-2xl overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">الفلاتر</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* Same filter content as desktop */}
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="font-semibold mb-3">{t("filters.categories")}</h3>
                      <div className="space-y-2">
                        <Button
                          variant={!selectedCategory ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                            handleCategoryChange('');
                            setShowFilters(false);
                          }}
                        >
                          {t("filters.allCategories")}
                        </Button>
                        {categories.map((category: any) => {
                          const categoryData: CategorySummary = category?.attributes ?? category;
                          const slug = categoryData.slug ?? String(category.id ?? "");
                          const name = categoryData.name ?? slug;
                          const displayName = translateCategoryName(slug, name);

                          return (
                            <Button
                              key={slug}
                              variant={selectedCategory === slug ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => {
                                handleCategoryChange(slug);
                                setShowFilters(false);
                              }}
                            >
                              {displayName}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="font-semibold mb-3">{t("filters.priceRange")}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            {t("filters.min")}
                          </label>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            {t("filters.max")}
                          </label>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                            min={priceRange.min + 1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("products.noProducts")}
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button 
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    >
                      {t("filters.clearFilters")}
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 text-center"
                >
                  <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 px-6 py-3 rounded-full">
                    <span className="text-sm text-muted-foreground">
                      عرض <span className="font-bold text-foreground">{filteredProducts.length}</span> من <span className="font-bold text-foreground">{products.length}</span> منتج
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}