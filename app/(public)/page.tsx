import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { TechnologyShowcase } from '@/components/home/technology-showcase';

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TechnologyShowcase />
      <WhyChooseUsSection />
      <StatsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}