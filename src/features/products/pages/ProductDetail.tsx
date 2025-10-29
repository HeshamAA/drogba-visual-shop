import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Minus, Plus, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import toast from "react-hot-toast";
import { useGetProductBySlugQuery } from "@/lib/api/strapiApi";
import type { ProductAttributes, ProductSize } from "@/types/strapi";
import { getImageUrl } from "@/lib/strapi";

export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductBySlugQuery(slug || "", { skip: !slug });

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">{t("product.loading")}</h1>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/products" replace />;
  }

  const productData: ProductAttributes = (product as any)?.attributes
    ? (product as any).attributes
    : (product as unknown as ProductAttributes);

  const resolveImageUrl = (source?: any): string => {
    if (!source) return "";
    const urlCandidate =
      source?.formats?.large?.url ??
      source?.formats?.medium?.url ??
      source?.formats?.thumbnail?.url ??
      source?.url ??
      source?.data?.attributes?.url ??
      "";
    return urlCandidate ? getImageUrl(urlCandidate) : "";
  };

  const allImages: string[] = useMemo(() => {
    const collected = new Set<string>();

    const pushUrl = (value?: string) => {
      if (!value) return;
      collected.add(value);
    };

    pushUrl(resolveImageUrl(productData.product_images));
    pushUrl(resolveImageUrl(productData.main_image));

    const galleryItems = productData.gallery_images?.data ?? [];
    galleryItems.forEach((item: any) => {
      pushUrl(resolveImageUrl(item?.attributes ?? item));
    });

    return Array.from(collected).filter(Boolean);
  }, [productData]);

  const mainImage = allImages[0] ?? "";

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t("product.selectSize"));
      return;
    }

    addItem({
      id: `${product.id}_${selectedSize}`,
      productId: product.id,
      name: productData.name ?? "",
      image: mainImage || "",
      price: productData.price ?? 0,
      size: selectedSize,
      quantity,
    });

    toast.success(`${productData.name ?? ""} ${t("product.addToCart")}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery - Sticky on Desktop */}
        <div className="md:sticky md:top-24 md:self-start space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img
              src={allImages[selectedImageIndex] || mainImage}
              alt={productData.name ?? "Product"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`
                    flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                    ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }
                  `}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {productData.name}
            </h1>
            <div className="text-accent flex items-center gap-3">
              {productData.old_price &&
                productData.old_price > (productData.price ?? 0) && (
                  <span className="text-muted-foreground line-through text-lg">
                    {productData.old_price} {t("product.price")}
                  </span>
                )}
              <span className="text-2xl font-bold">
                {productData.price} {t("product.price")}
              </span>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t("product.selectSize")}
            </Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(productData.sizes)
                  ? productData.sizes
                  : (["S", "M", "L", "XL"] as const)
                ).map((size: ProductSize | string, index) => {
                  const value =
                    typeof size === "string" ? size : size?.name ?? `size-${index}`;
                  const disabled =
                    typeof size === "string" ? false : size?.inStock === false;

                  return (
                    <div key={value} className="relative">
                      <RadioGroupItem
                        value={value}
                        id={`size-${value}`}
                        disabled={disabled}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${value}`}
                        className={`
                        flex items-center justify-center px-6 py-3 rounded-md border-2 cursor-pointer
                        transition-all font-semibold
                        ${
                          disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "border-border hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                        }
                      `}
                      >
                        {value}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t("product.quantity")}
            </Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center text-lg font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            variant="gradient"
            className="w-full"
          >
            {t("product.addToCart")}
          </Button>

          {/* Trust Badges */}
          <div className="flex gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>{t("values.secure.title")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              <span>إرجاع سهل</span>
            </div>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="text-base font-semibold">
                {t("product.description")}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: productData.description ?? "",
                  }}
                  className="prose prose-sm"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizing">
              <AccordionTrigger className="text-base font-semibold">
                {t("product.sizingChart")}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  دليل المقاسات سيكون متاح قريباً. للاستفسار يرجى التواصل معنا.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="text-base font-semibold">
                {t("product.shipping")}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  شحن مجاني للطلبات أكثر من 500 جنيه. التوصيل خلال 3-5 أيام عمل.
                  إمكانية الإرجاع خلال 14 يوم.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
