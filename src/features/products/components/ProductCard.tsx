import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Product, ProductAttributes, ProductSize } from "@/types/strapi";
import { useTranslation } from "react-i18next";
import { Eye, ShoppingCart, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import QuickViewModal from "./QuickViewModal";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/strapi";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "@/features/cart";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const productData: ProductAttributes = (product.attributes ?? product) as ProductAttributes;

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
    resolveImageUrl(productData.product_images?.formats?.thumbnail) || mainImageSrc;

  const categoryName =
    productData.category?.name ??
    productData.categories?.data?.[0]?.attributes?.name ??
    "";

  const productName = productData.name ?? "";
  const productSlug = productData.slug ?? product.slug ?? product.id;
  const productPrice = productData.price ?? 0;
  const previousPrice = productData.old_price;

  const hasDiscount = previousPrice && previousPrice > productPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((previousPrice - productPrice) / previousPrice) * 100)
    : 0;

  type NormalizedSize = {
    value: string;
    disabled: boolean;
  };

  const normalizedSizes = useMemo<NormalizedSize[]>(() => {
    const sizesField = productData.sizes;

    const fallbackSizes: NormalizedSize[] = ["S", "M", "L", "XL"].map((value) => ({
      value,
      disabled: false,
    }));

    if (!sizesField) {
      return fallbackSizes;
    }

    if (Array.isArray(sizesField)) {
      if (sizesField.length === 0) {
        return fallbackSizes;
      }

      if (typeof sizesField[0] === "string") {
        return (sizesField as string[]).map((value) => ({ value, disabled: false }));
      }

      return (sizesField as ProductSize[])
        .map((size, index) => ({
          value: size?.name ?? `size-${index}`,
          disabled: size?.inStock === false,
        }))
        .filter((size) => Boolean(size.value));
    }

    if (typeof sizesField === "object") {
      return Object.values(sizesField)
        .filter((value): value is string => typeof value === "string")
        .map((value) => ({ value, disabled: false }));
    }

    return fallbackSizes;
  }, [productData.sizes]);

  const availableSizes = normalizedSizes.filter((size) => !size.disabled && size.value);
  const singleSelectableSize = availableSizes.length === 1 ? availableSizes[0].value : null;

  const addItemToCart = (size: string) => {
    const imageForCart = thumbnailSrc || mainImageSrc || "";

    addItem({
      id: `${product.id}_${size}`,
      productId: Number(product.id) || (product.id as number),
      name: productName,
      image: imageForCart,
      price: productPrice,
      size,
      quantity: 1,
    });

    toast.success(`${productName} ${t("product.addToCart")}`);
  };

  const handleAddToCart = () => {
    if (availableSizes.length === 0) {
      toast.error("المقاسات غير متاحة حالياً لهذا المنتج");
      return;
    }

    if (!singleSelectableSize) {
      setShowQuickView(true);
      toast(t("product.selectSize"));
      return;
    }

    addItemToCart(singleSelectableSize);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-accent/50 hover:shadow-2xl dark:hover:shadow-accent/10 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${productSlug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/20 dark:to-muted/5">
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                {hasDiscount && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg px-2.5 py-1 font-bold">
                      خصم {discountPercentage}%
                    </Badge>
                  </motion.div>
                )}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg px-2.5 py-1 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    جديد
                  </Badge>
                </motion.div>
              </div>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isFavorite
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-background/80 text-foreground hover:bg-background hover:text-red-500 dark:bg-background/60 dark:hover:bg-background/90"
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${isFavorite ? "fill-current" : ""}`}
                />
              </motion.button>
            </div>

            {/* Product Image */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img
                src={thumbnailSrc || mainImageSrc}
                alt={productName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Gradient Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            />

            {/* Action Buttons on Hover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center gap-2"
            >
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 rounded-xl shadow-xl backdrop-blur-sm bg-background/95 hover:bg-background border-0 font-bold dark:bg-background/90 dark:hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                معاينة سريعة
              </Button>
              <Button
                size="icon"
                className="rounded-xl shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 border-0"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            className="p-4 space-y-2.5"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
          >
            {/* Category */}
            {categoryName && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                  {categoryName}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-semibold">رائج</span>
                </div>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-foreground/80 transition-colors">
              {productName}
            </h3>

            {/* Price Section */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col gap-1">
                {hasDiscount ? (
                  <>
                    <span className="text-xs line-through text-muted-foreground font-medium">
                      {previousPrice} جنيه
                    </span>
                    <span className="text-xl font-black text-foreground">
                      {productPrice} جنيه
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-black text-foreground">
                    {productPrice} جنيه
                  </span>
                )}
              </div>

              {/* Add to Cart Button (small version) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </Link>

        {/* Shine Effect on Hover */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none"
          style={{ transform: "skewX(-20deg)" }}
        />
      </motion.div>

      <QuickViewModal
        product={product}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
}