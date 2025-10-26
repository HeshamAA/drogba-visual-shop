import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Minus, Plus, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { addItem } = useCart();

  const product = MOCK_PRODUCTS.find((p) => p.attributes.slug === slug);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const mainImage = product.attributes.main_image.data?.attributes.url;
  const galleryImages = product.attributes.gallery_images.data || [];
  const allImages = [
    product.attributes.main_image.data,
    ...galleryImages,
  ].filter(Boolean);

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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery - Sticky on Desktop */}
        <div className="md:sticky md:top-24 md:self-start space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img
              src={allImages[selectedImageIndex]?.attributes.url}
              alt={product.attributes.name}
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
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    }
                  `}
                >
                  <img
                    src={img?.attributes.url}
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
              {product.attributes.name}
            </h1>
            <p className="text-2xl font-bold text-accent">
              {product.attributes.price} {t('product.price')}
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
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
                        flex items-center justify-center px-6 py-3 rounded-md border-2 cursor-pointer
                        transition-all font-semibold
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
            <Label className="text-base font-semibold mb-3 block">
              {t('product.quantity')}
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
          <Button onClick={handleAddToCart} size="lg" className="w-full">
            {t('product.addToCart')}
          </Button>

          {/* Trust Badges */}
          <div className="flex gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>{t('values.secure.title')}</span>
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
                {t('product.description')}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.attributes.description,
                  }}
                  className="prose prose-sm"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizing">
              <AccordionTrigger className="text-base font-semibold">
                {t('product.sizingChart')}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  دليل المقاسات سيكون متاح قريباً. للاستفسار يرجى التواصل معنا.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="text-base font-semibold">
                {t('product.shipping')}
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
