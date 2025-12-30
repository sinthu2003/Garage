import { Hero } from '../components/home/Hero';
import { ServiceGrid } from '../components/home/ServiceGrid';
import { HowItWorks } from '../components/home/Howitworks';
import { Features } from '../components/home/Features';
import { PricingTable } from '../components/home/PricingTable';
import { Testimonials } from '../components/home/Testimonials';
import { PartnersSection } from '../components/home/PartnersSection';
import { FAQSection } from '../components/home/FAQSection';
import { GallerySection } from '../components/home/Gallerysection';
import { BeforeAfterSection } from '../components/home/Beforeaftersection';
import { Navbar } from '../components/layout/Navbar';

export const HomePage = () => {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* 1. Hero - First impression with booking widget */}
      <Hero />

      {/* 2. Partners - Build trust immediately with brand logos */}
      <PartnersSection />

      {/* 3. Services - Show what you offer */}
      <ServiceGrid />

      {/* 4. How It Works - Explain the process */}
      <HowItWorks />

      {/* 5. Features - Why choose us */}
      <Features />

      {/* 6. Before & After - Visual proof of quality work */}
      <BeforeAfterSection />

      {/* 7. Pricing - Transparent costs */}
      <PricingTable />

      {/* 8. Testimonials - Social proof */}
      <Testimonials />

      {/* 9. Gallery - Showcase workshop & work */}
      <GallerySection />

      {/* 10. FAQ - Answer remaining questions */}
      <FAQSection />
    </>
  );
};