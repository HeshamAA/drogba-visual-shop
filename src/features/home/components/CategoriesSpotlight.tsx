import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/features/products/hooks/useCategories";
import { useMemo, useRef } from "react";
import { getImageUrl } from "@/lib/strapi";
import type { Category } from "@/types/strapi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CategoriesSpotlight() {
  const { t } = useTranslation();
  const { categories, loading } = useCategories();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const translateCategoryName = useMemo(
    () =>
      (slugValue?: string | null, fallback?: string) => {
        if (!slugValue) {
          return fallback ?? "";
        }
        const normalizedSlug = slugValue.toString().toLowerCase();
        const defaultText = fallback ?? slugValue;
        return t(`categoryNames.${normalizedSlug}`, { defaultValue: defaultText });
      },
    [t]
  );

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
        <Button
          ref={prevRef}
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          ref={nextRef}
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={categories.length > 3}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation;
            if (typeof navigation !== "boolean" && navigation) {
              navigation.prevEl = prevRef.current;
              navigation.nextEl = nextRef.current;
            }
          }}
          onSwiper={(swiper: SwiperInstance) => {
            setTimeout(() => {
              if (swiper.params.navigation && swiper.navigation) {
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
          className="pb-12"
        >
          {categories.map((category: Category) => {
            const attrs = category.attributes;
            const slug = attrs?.slug ?? "";
            const displayName = translateCategoryName(
              slug,
              attrs?.name ?? slug
            );

            return (
              <SwiperSlide key={category.id ?? slug}>
                <Link
                  to={`/products?category=${slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-primary transition-all shadow-lg hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      {attrs?.category_image?.data?.attributes?.url || attrs?.category_image?.url ? (
                        <motion.img
                          src={getImageUrl(
                            attrs?.category_image?.data?.attributes?.url ?? 
                            attrs?.category_image?.url ?? 
                            ""
                          )}
                          alt={displayName}
                          className="absolute inset-0 w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                          {displayName}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                        {displayName}
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
