import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/strapi';
import { useTranslation } from 'react-i18next';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickViewModal from './QuickViewModal';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const mainImage = product.attributes.main_image.data?.attributes.url;
  const hoverImage = product.attributes.gallery_images.data?.[0]?.attributes.url;
  const category = product.attributes.categories.data?.[0]?.attributes.name;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${product.attributes.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-4">
            {/* Images */}
            <img
              src={mainImage}
              alt={product.attributes.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.attributes.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Hover Overlay with Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
            >
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                asChild
              >
                <Link to={`/products/${product.attributes.slug}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="space-y-1">
            {category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {category}
              </p>
            )}
            <h3 className="font-semibold text-sm md:text-base line-clamp-1">
              {product.attributes.name}
            </h3>
            <p className="text-sm md:text-base font-bold">
              {product.attributes.price} {t('product.price')}
            </p>
          </div>
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
