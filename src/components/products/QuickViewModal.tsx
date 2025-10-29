import { useState } from "react";
import { Product } from "@/types/strapi";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/api/strapi";

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

  const mainImage = product.product_images?.url
    ? getImageUrl(product.product_images.url)
    : "";
  const thumbnail = product.product_images?.formats?.thumbnail?.url
    ? getImageUrl(product.product_images.formats.thumbnail.url)
    : mainImage;

  // Handle sizes from JSON field
  const parseSizes = (sizesField: any): string[] => {
    if (!sizesField) return ["S", "M", "L", "XL"];

    if (Array.isArray(sizesField)) {
      if (typeof sizesField[0] === "string") {
        return sizesField;
      }
      return sizesField.map((s: any) => s.name || s);
    }

    if (typeof sizesField === "object") {
      return Object.values(sizesField).filter((v) => v) as string[];
    }

    return ["S", "M", "L", "XL"];
  };

  const sizes = parseSizes(product.sizes);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t("product.selectSize"));
      return;
    }

    addItem({
      id: `${product.id}_${selectedSize}`,
      productId: product.id,
      name: product.name,
      image: thumbnail || mainImage || "",
      price: product.price,
      size: selectedSize,
      quantity,
    });

    toast.success(`${product.name} ${t("product.addToCart")}`);
    onOpenChange(false);
    setSelectedSize("");
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img
              src={thumbnail || mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-2xl font-bold">
                {product.price} {t("product.price")}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t("product.selectSize")}
              </Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="relative">
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer transition-all border-border hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {size}
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
