import HeroSection from "@/features/home/components/HeroSection";
import FeaturedProducts from "@/features/home/components/FeaturedProducts";
import CategoriesSpotlight from "@/features/home/components/CategoriesSpotlight";
import SpecialOffers from "@/features/home/components/SpecialOffers";
import NewArrivals from "@/features/home/components/NewArrivals";
import ValueProposition from "@/features/home/components/ValueProposition";
import BrandStory from "@/features/home/components/BrandStory";
import CommunitySocialProof from "@/features/home/components/CommunitySocialProof";
import Newsletter from "@/features/home/components/Newsletter";
import { useHomePage } from "@/features/home/hooks/useHomePage";
import { HomeSEO } from "@/shared/components/SEO";

export default function Index() {
  const { featuredProducts, newArrivals } = useHomePage();

  return (
    <>
      <HomeSEO />
      <div className="min-h-screen bg-app">
      <HeroSection
      

      />

      <FeaturedProducts products={featuredProducts} />

      <CategoriesSpotlight />

      <SpecialOffers />

      <NewArrivals products={newArrivals} />

      <ValueProposition />

      <BrandStory />

      <CommunitySocialProof />

      <Newsletter />
      </div>
    </>
  );
}
