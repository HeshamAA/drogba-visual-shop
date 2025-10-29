import { MOCK_HOMEPAGE, MOCK_PRODUCTS } from "@/lib/mock-data";
import HeroSection from "@/features/home/components/HeroSection";
import FeaturedProducts from "@/features/home/components/FeaturedProducts";
import CategoriesSpotlight from "@/features/home/components/CategoriesSpotlight";
import SpecialOffers from "@/features/home/components/SpecialOffers";
import NewArrivals from "@/features/home/components/NewArrivals";
import ValueProposition from "@/features/home/components/ValueProposition";
import BrandStory from "@/features/home/components/BrandStory";
import CommunitySocialProof from "@/features/home/components/CommunitySocialProof";
import Newsletter from "@/features/home/components/Newsletter";

export default function Index() {
  const homepage = MOCK_HOMEPAGE.attributes;

  const heroImageUrl = homepage.hero_image_bg.data?.attributes.url || null;
  const heroVideoUrl = homepage.hero_video_bg.data?.attributes.url || null;

  return (
    <div className="min-h-screen bg-app">
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
