import { useTranslation } from 'react-i18next';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import ProductCard from '@/components/products/ProductCard';

export default function Products() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('nav.shop')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
