import { MOCK_HOMEPAGE } from '@/lib/mock-data';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import InteractiveLookbook from '@/components/home/InteractiveLookbook';
import ValueProposition from '@/components/home/ValueProposition';

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

      <InteractiveLookbook
        imageUrl={lookbookImageUrl}
        hotspots={homepage.lookbook_hotspots}
      />

      <ValueProposition />
    </div>
  );
}
