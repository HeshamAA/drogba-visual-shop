import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/strapi";
import { useTranslation } from "react-i18next";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import QuickViewModal from "./QuickViewModal";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/strapi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const productData = product.attributes ?? product;

  const resolveImageUrl = (source?: any): string => {
    if (!source) return "";
    const urlCandidate =
      source.formats?.large?.url ??
      source.formats?.medium?.url ??
      source.formats?.thumbnail?.url ??
      source.url ??
      source.data?.attributes?.url ??
      "";
    return urlCandidate ? getImageUrl(urlCandidate) : "";
  };

  const mainImageSrc =
    resolveImageUrl(productData.product_images) ||
    resolveImageUrl(productData.main_image) ||
    resolveImageUrl(productData.gallery_images?.data?.[0]?.attributes);

  const thumbnailSrc =
    resolveImageUrl(productData.product_images?.formats?.thumbnail)
      || mainImageSrc;

  const categoryName =
    productData.category?.name ??
    productData.categories?.data?.[0]?.attributes?.name ??
    "";

  const productName = productData.name ?? "";
  const productSlug = productData.slug ?? product.id;
  const productPrice = productData.price ?? 0;
  const previousPrice = productData.old_price;

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
        <Link to={`/products/${productSlug}`} className="block">
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
              src={thumbnailSrc || mainImageSrc}
              alt={productName}
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
                  <Link to={`/products/${productSlug}`}>
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
            {categoryName && (
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase rounded-full px-2 py-1 bg-accent/10 text-accent mb-1">
                {categoryName}
              </span>
            )}
            <h3 className="font-semibold text-sm md:text-base line-clamp-1">
              {productName}
            </h3>
            <p className="text-sm md:text-base font-bold text-accent flex items-center gap-2">
              {previousPrice && previousPrice > productPrice ? (
                <>
                  <span className="line-through text-muted-foreground text-xs">
                    {previousPrice} {t("product.price")}
                  </span>
                  <span className="text-primary">
                    {productPrice} {t("product.price")}
                  </span>
                </>
              ) : (
                <span>
                  {productPrice} {t("product.price")}
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
