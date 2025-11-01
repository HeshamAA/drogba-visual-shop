import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  locale?: string;
}

const DEFAULT_SEO = {
  title: 'Drogba Visual Shop - متجر دروجبا للملابس الرياضية',
  description: 'متجر دروجبا لبيع الملابس الرياضية عالية الجودة. تسوق الآن واحصل على أفضل العروض والخصومات على الملابس الرياضية والإكسسوارات.',
  keywords: 'ملابس رياضية, متجر دروجبا, ملابس كرة قدم, تيشرتات رياضية, شورتات رياضية, أحذية رياضية, إكسسوارات رياضية',
  image: '/og-image.jpg',
  url: 'https://drogba-shop.com',
  locale: 'ar_EG',
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  price,
  currency = 'EGP',
  availability,
  locale = DEFAULT_SEO.locale,
}: SEOProps) {
  const siteTitle = title 
    ? `${title} | Drogba Visual Shop` 
    : DEFAULT_SEO.title;
  
  const siteDescription = description || DEFAULT_SEO.description;
  const siteKeywords = keywords || DEFAULT_SEO.keywords;
  const siteImage = image || DEFAULT_SEO.image;
  const siteUrl = url || DEFAULT_SEO.url;

  // Ensure absolute URL for image
  const absoluteImage = siteImage.startsWith('http') 
    ? siteImage 
    : `${DEFAULT_SEO.url}${siteImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content="Drogba Visual Shop" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Arabic" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Drogba Visual Shop" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:creator" content="@drogbashop" />

      {/* Product Specific Meta (for product pages) */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
        </>
      )}

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'product' ? 'Product' : 'WebSite',
          name: siteTitle,
          description: siteDescription,
          url: siteUrl,
          image: absoluteImage,
          ...(type === 'product' && price && {
            offers: {
              '@type': 'Offer',
              price: price,
              priceCurrency: currency,
              availability: availability === 'in stock' 
                ? 'https://schema.org/InStock' 
                : 'https://schema.org/OutOfStock',
            },
          }),
        })}
      </script>
    </Helmet>
  );
}

// Pre-configured SEO components for common pages
export function HomeSEO() {
  return (
    <SEO
      title="الصفحة الرئيسية"
      description="اكتشف أحدث الملابس الرياضية في متجر دروجبا. تسوق الآن واحصل على شحن مجاني للطلبات فوق 500 جنيه."
      keywords="ملابس رياضية, متجر دروجبا, تسوق أونلاين, ملابس كرة قدم, عروض رياضية"
    />
  );
}

export function ProductsSEO() {
  return (
    <SEO
      title="المنتجات"
      description="تصفح مجموعتنا الواسعة من الملابس الرياضية عالية الجودة. أحدث التصاميم وأفضل الأسعار."
      keywords="منتجات رياضية, ملابس رياضية, تيشرتات, شورتات, أحذية رياضية"
      url={`${DEFAULT_SEO.url}/products`}
    />
  );
}

export function CartSEO() {
  return (
    <SEO
      title="سلة التسوق"
      description="راجع منتجاتك وأكمل عملية الشراء بأمان. شحن سريع وآمن لجميع أنحاء مصر."
      url={`${DEFAULT_SEO.url}/cart`}
    />
  );
}

export function CheckoutSEO() {
  return (
    <SEO
      title="إتمام الطلب"
      description="أكمل طلبك بأمان. نقبل الدفع عند الاستلام وفودافون كاش."
      url={`${DEFAULT_SEO.url}/checkout`}
    />
  );
}
