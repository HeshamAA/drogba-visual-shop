import HeroSection from "@/features/home/components/HeroSection";
import FeaturedProducts from "@/features/home/components/FeaturedProducts";
import CategoriesSpotlight from "@/features/home/components/CategoriesSpotlight";
import SpecialOffers from "@/features/home/components/SpecialOffers";
import NewArrivals from "@/features/home/components/NewArrivals";
import ValueProposition from "@/features/home/components/ValueProposition";
import BrandStory from "@/features/home/components/BrandStory";
import CommunitySocialProof from "@/features/home/components/CommunitySocialProof";
import Newsletter from "@/features/home/components/Newsletter";
import { useFeaturedProducts, useProducts } from "@/features/products/hooks/useProducts";
import { useMemo } from "react";

export default function Index() {
  const { featuredProducts } = useFeaturedProducts();
  const { products } = useProducts({ pageSize: 12 });


  const newArrivals = useMemo(() => products.slice(0, 4), [products]);

  return (
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
  );
}
