import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Product } from "@/types/strapi";
import ProductCard from "@/features/products/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 container mx-auto bg-surface dark:bg-surface-dark rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            {t("sections.newArrivals", "وصل حديثاً")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("sections.newArrivalsDesc", "أحدث إصداراتنا الحصرية")}
          </p>
        </div>
        <Link
          to="/products"
          className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all"
        >
          <span className="font-semibold">
            {t("common.viewAll", "عرض الكل")}
          </span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <Link
        to="/products"
        className="md:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all mt-8"
      >
        <span className="font-semibold">{t("common.viewAll", "عرض الكل")}</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </section>
  );
}
