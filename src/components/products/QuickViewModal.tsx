import { useState } from 'react';
import { Product } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const mainImage = product.attributes.main_image.data?.attributes.url;
  const availableSizes = product.attributes.sizes.filter((s) => s.inStock);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('product.selectSize'));
      return;
    }

    addItem({
      id: `${product.id}_${selectedSize}`,
      productId: product.id,
      name: product.attributes.name,
      image: mainImage || '',
      price: product.attributes.price,
      size: selectedSize,
      quantity,
    });

    toast.success(`${product.attributes.name} ${t('product.addToCart')}`);
    onOpenChange(false);
    setSelectedSize('');
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.attributes.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img
              src={mainImage}
              alt={product.attributes.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-2xl font-bold">
                {product.attributes.price} {t('product.price')}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t('product.selectSize')}
              </Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-2">
                  {product.attributes.sizes.map((size) => (
                    <div key={size.name} className="relative">
                      <RadioGroupItem
                        value={size.name}
                        id={`size-${size.name}`}
                        disabled={!size.inStock}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size.name}`}
                        className={`
                          flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer
                          transition-all
                          ${
                            size.inStock
                              ? 'border-border hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground'
                              : 'opacity-50 cursor-not-allowed line-through'
                          }
                        `}
                      >
                        {size.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {t('product.quantity')}
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
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
              disabled={availableSizes.length === 0}
            >
              {availableSizes.length === 0
                ? t('product.outOfStock')
                : t('product.addToCart')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
