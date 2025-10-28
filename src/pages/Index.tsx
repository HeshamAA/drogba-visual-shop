import { MOCK_HOMEPAGE, MOCK_PRODUCTS } from '@/lib/mock-data';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesSpotlight from '@/components/home/CategoriesSpotlight';
import SpecialOffers from '@/components/home/SpecialOffers';
import NewArrivals from '@/components/home/NewArrivals';
import ValueProposition from '@/components/home/ValueProposition';
import BrandStory from '@/components/home/BrandStory';
import CommunitySocialProof from '@/components/home/CommunitySocialProof';
import Newsletter from '@/components/home/Newsletter';

export default function Index() {
  const homepage = MOCK_HOMEPAGE.attributes;

  const heroImageUrl = homepage.hero_image_bg.data?.attributes.url || null;
  const heroVideoUrl = homepage.hero_video_bg.data?.attributes.url || null;

  return (
    <div className="min-h-screen">
      <HeroSection
        headline={homepage.hero_headline}
        imageUrl={heroImageUrl}
        videoUrl={heroVideoUrl}
      />

      <FeaturedProducts products={homepage.featured_products.data} />

      <CategoriesSpotlight />

      <SpecialOffers />

      <NewArrivals products={MOCK_PRODUCTS} />

      <ValueProposition />

      <BrandStory />

      <CommunitySocialProof />

      <Newsletter />
    </div>
  );
}
