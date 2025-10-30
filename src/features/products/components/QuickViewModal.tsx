import { useState } from "react";
import { Product, ProductAttributes, ProductSize } from "@/types/strapi";
import { useTranslation } from "react-i18next";
import { useCart } from "@/features/cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/strapi";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const productData: ProductAttributes = product.attributes ?? product;

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

  const mainImage =
    resolveImageUrl(productData.product_images) ||
    resolveImageUrl(productData.main_image) ||
    resolveImageUrl(productData.gallery_images?.data?.[0]?.attributes);

  const thumbnail =
    resolveImageUrl(productData.product_images?.formats?.thumbnail) || mainImage;

  // Handle sizes from JSON field
  type NormalizedSize = {
    key: string;
    value: string;
    disabled: boolean;
  };

  const normalizeSizes = (
    sizesField: ProductAttributes["sizes"],
  ): NormalizedSize[] => {
    if (!sizesField) {
      return ["S", "M", "L", "XL"].map((value) => ({
        key: value,
        value,
        disabled: false,
      }));
    }

    if (Array.isArray(sizesField)) {
      if (typeof sizesField[0] === "string") {
        return (sizesField as string[]).map((value) => ({
          key: value,
          value,
          disabled: false,
        }));
      }

      return (sizesField as ProductSize[])
        .map((size, index) => ({
          key: size?.name ?? `size-${index}`,
          value: size?.name ?? "",
          disabled: size?.inStock === false,
        }))
        .filter((size) => size.value);
    }

    if (typeof sizesField === "object") {
      return Object.values(sizesField)
        .filter((value): value is string => typeof value === "string")
        .map((value) => ({
          key: value,
          value,
          disabled: false,
        }));
    }

    return ["S", "M", "L", "XL"].map((value) => ({
      key: value,
      value,
      disabled: false,
    }));
  };

  const normalizedSizes = normalizeSizes(productData.sizes);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t("product.selectSize"));
      return;
    }

    const numericId = typeof product.id === "number" ? product.id : Number(product.id);

    addItem({
      id: `${product.id}_${selectedSize}`,
      productId: Number.isFinite(numericId) ? numericId : 0,
      name: productData.name ?? "",
      image: thumbnail || mainImage || "",
      price: productData.price ?? 0,
      size: selectedSize,
      quantity,
    });

    toast.success(`${productData.name ?? ""} ${t("product.addToCart")}`);
    onOpenChange(false);
    setSelectedSize("");
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productData.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img
              src={thumbnail || mainImage}
              alt={productData.name ?? "Product"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-2xl font-bold">
                {productData.price} {t("product.price")}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t("product.selectSize")}
              </Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-2">
                  {normalizedSizes.map((size) => (
                    <div key={size.key} className="relative">
                      <RadioGroupItem
                        value={size.value}
                        id={`size-${size.value}`}
                        disabled={size.disabled}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size.value}`}
                        className={`flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer transition-all border-border hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground ${
                          size.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {size.value}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t("product.quantity")}
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
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
              className="w-full"
              size="lg"
              variant="gradient"
            >
              {t("product.addToCart")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
