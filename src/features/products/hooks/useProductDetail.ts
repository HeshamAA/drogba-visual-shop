import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/features/cart";
import toast from "react-hot-toast";
import { useProductBySlug } from "./useProducts";
import type { ProductAttributes } from "@/types/strapi";
import { getImageUrl } from "@/lib/strapi";

export function useProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { product, isLoading, error } = useProductBySlug(slug || "");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productData: ProductAttributes = (product as any)?.attributes
    ? (product as any).attributes
    : (product as unknown as ProductAttributes);

  const resolveImageUrl = (source?: unknown): string => {
    if (!source || typeof source !== 'object') return "";
    
    const src = source as Record<string, unknown>;
    
    // Try to get the original/largest image first
    const urlCandidate =
      (src?.url as string) ?? // Original image URL (highest quality)
      ((src?.data as Record<string, unknown>)?.attributes as Record<string, unknown>)?.url as string ?? // Strapi v4 format
      ((src?.formats as Record<string, unknown>)?.xlarge as Record<string, unknown>)?.url as string ?? // Extra large
      ((src?.formats as Record<string, unknown>)?.large as Record<string, unknown>)?.url as string ?? // Large
      ((src?.formats as Record<string, unknown>)?.medium as Record<string, unknown>)?.url as string ?? // Medium
      ((src?.formats as Record<string, unknown>)?.small as Record<string, unknown>)?.url as string ?? // Small
      ((src?.formats as Record<string, unknown>)?.thumbnail as Record<string, unknown>)?.url as string ?? // Thumbnail (last resort)
      "";
    return urlCandidate ? getImageUrl(urlCandidate) : "";
  };

  const allImages: string[] = useMemo(() => {
    if (!product) return [];
    
    const images: string[] = [];

    // Add main image first
    const mainImg = resolveImageUrl(productData.main_image) || resolveImageUrl(productData.product_images);
    if (mainImg) {
      images.push(mainImg);
    }

    // Add gallery images
    // Check if gallery_images is directly an array or has .data property
    const galleryItems = Array.isArray(productData.gallery_images) 
      ? productData.gallery_images 
      : (productData.gallery_images?.data ?? []);
    
    galleryItems.forEach((item: unknown) => {
      const itemObj = item as Record<string, unknown>;
      const url = resolveImageUrl(itemObj?.attributes ?? item);
      if (url && url !== mainImg) {
        images.push(url);
      }
    });

    return images;
  }, [product, productData]);

  const mainImage = allImages[0] ?? "";

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t("product.selectSize"));
      return;
    }

    if (!selectedColor) {
      toast.error("يرجى اختيار اللون");
      return;
    }

    addItem({
      id: `${product.id}_${selectedSize}_${selectedColor}`,
      productId: Number(product.id),
      name: productData.name ?? "",
      image: mainImage || "",
      price: productData.price ?? 0,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    toast.success(`${productData.name ?? ""} ${t("product.addToCart")}`);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  return {
    // Data
    product,
    productData,
    isLoading,
    error,
    
    // Images
    allImages,
    mainImage,
    selectedImageIndex,
    setSelectedImageIndex,
    
    // Selection state
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    setQuantity,
    
    // Actions
    handleAddToCart,
    incrementQuantity,
    decrementQuantity,
    
    // Translation
    t,
  };
}
