import { useTranslation } from "react-i18next";
import { Product } from "@/types/strapi";
import ProductCard from "@/features/products/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("sections.featured")}
        </h2>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={1.15}
        breakpoints={{
          768: { slidesPerView: 2.15 },
          1024: { slidesPerView: 3.15 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="min-w-0">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
