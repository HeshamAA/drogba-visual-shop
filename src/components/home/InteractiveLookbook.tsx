import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hotspot } from '@/types/strapi';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Plus } from 'lucide-react';

interface InteractiveLookbookProps {
  imageUrl: string;
  hotspots: Hotspot[];
}

export default function InteractiveLookbook({ imageUrl, hotspots }: InteractiveLookbookProps) {
  const { t } = useTranslation();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const selectedProduct = hotspots.find(
    (h) => h.product.data.id === selectedProductId
  )?.product.data;

  return (
    <section className="py-16 px-4 container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {t('sections.lookbook')}
      </h2>

      <div className="relative max-w-4xl mx-auto">
        <img
          src={imageUrl}
          alt="Lookbook"
          className="w-full h-auto rounded-lg"
        />

        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => setSelectedProductId(hotspot.product.data.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${hotspot.position_x}%`,
              top: `${hotspot.position_y}%`,
            }}
          >
            {/* Animated Dot */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-accent/20 rounded-full animate-pulse-dot" />
              <div className="relative w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProductId(null)}
        />
      )}
    </section>
  );
}
