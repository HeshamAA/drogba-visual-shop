import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/strapi";
import { useTranslation } from "react-i18next";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuickViewModal from "./QuickViewModal";
import { motion } from "framer-motion";
import { getImageUrl } from "@/api/strapi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const mainImage = product.product_images?.url
    ? getImageUrl(product.product_images.url)
    : "";
  const thumbnail = product.product_images?.formats?.thumbnail?.url
    ? getImageUrl(product.product_images.formats.thumbnail.url)
    : mainImage;
  const category = product.category?.name;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative rounded-2xl border border-border bg-surface dark:bg-surface-dark transition-all hover:border-accent/50 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
            {/* Pulse Badge */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-3 right-3 z-10 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r from-accent to-accent/80 ring-1 ring-accent/20"
            >
              {t("product.new", "جديد")}
            </motion.div>

            {/* Images */}
            <motion.img
              src={thumbnail || mainImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />

            {/* Hover Overlay with Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowQuickView(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.15 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  asChild
                >
                  <Link to={`/products/${product.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            className="space-y-1 p-4"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {category && (
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase rounded-full px-2 py-1 bg-accent/10 text-accent mb-1">
                {category}
              </span>
            )}
            <h3 className="font-semibold text-sm md:text-base line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm md:text-base font-bold text-accent flex items-center gap-2">
              {product.old_price && product.old_price > product.price ? (
                <>
                  <span className="line-through text-muted-foreground text-xs">
                    {product.old_price} {t("product.price")}
                  </span>
                  <span className="text-primary">
                    {product.price} {t("product.price")}
                  </span>
                </>
              ) : (
                <span>
                  {product.price} {t("product.price")}
                </span>
              )}
            </p>
          </motion.div>
        </Link>
      </motion.div>

      <QuickViewModal
        product={product}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
}
