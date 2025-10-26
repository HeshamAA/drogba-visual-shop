import { MOCK_HOMEPAGE, MOCK_PRODUCTS } from '@/lib/mock-data';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesSpotlight from '@/components/home/CategoriesSpotlight';
import InteractiveLookbook from '@/components/home/InteractiveLookbook';
import NewArrivals from '@/components/home/NewArrivals';
import ValueProposition from '@/components/home/ValueProposition';
import BrandStory from '@/components/home/BrandStory';
import CommunitySocialProof from '@/components/home/CommunitySocialProof';
import Newsletter from '@/components/home/Newsletter';

export default function Index() {
  const homepage = MOCK_HOMEPAGE.attributes;

  const heroImageUrl = homepage.hero_image_bg.data?.attributes.url || null;
  const heroVideoUrl = homepage.hero_video_bg.data?.attributes.url || null;
  const lookbookImageUrl = homepage.lookbook_image.data?.attributes.url || '';

  return (
    <div className="min-h-screen">
      <HeroSection
        headline={homepage.hero_headline}
        imageUrl={heroImageUrl}
        videoUrl={heroVideoUrl}
      />

      <FeaturedProducts products={homepage.featured_products.data} />

      <CategoriesSpotlight />

      <InteractiveLookbook
        imageUrl={lookbookImageUrl}
        hotspots={homepage.lookbook_hotspots}
      />

      <NewArrivals products={MOCK_PRODUCTS} />

      <ValueProposition />

      <BrandStory />

      <CommunitySocialProof />

      <Newsletter />
    </div>
  );
}
