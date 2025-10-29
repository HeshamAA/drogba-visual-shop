import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/features/products/hooks/useCategories";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/lib/strapi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoriesSpotlight() {
  const { t } = useTranslation();
  const { categories, loading } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate categories for infinite scroll
  const duplicatedCategories =
    categories.length > 0 ? [...categories, ...categories, ...categories] : [];

  // Auto-scroll effect
  useEffect(() => {
    if (categories.length === 0 || loading) return;

    scrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= categories.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [categories.length, loading]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= categories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? categories.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
          <div className="h-6 bg-muted animate-pulse rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {t("sections.categories", "تسوق حسب الفئة")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("sections.categoriesDesc", "اكتشف مجموعتنا المتنوعة")}
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Carousel */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: `-${currentIndex * (100 / 3)}%`,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            {duplicatedCategories.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-full md:w-1/3"
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-primary transition-all shadow-lg hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                    {/* Category Image or default */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <motion.img
                        src={getImageUrl(category.category_image?.url)}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <span className="text-primary text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-1">
                        {t("common.shopNow", "تسوق الآن")}
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          →
                        </motion.span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
