import { Hero } from '../components/home/Hero';
import { ServiceGrid } from '../components/home/ServiceGrid';
import { HowItWorks } from '../components/home/Howitworks';
import { Features } from '../components/home/Features';
import { PricingTable } from '../components/home/PricingTable';
import { Testimonials } from '../components/home/Testimonials';

export const HomePage = () => {
  return (
    <>
      {/* Hero Section with Booking Widget */}
      <Hero />

      {/* Our Services Grid */}
      <ServiceGrid />

      {/* How It Works - 4 Steps */}
      <HowItWorks />

      {/* Why Choose Us - Features */}
      <Features />

      {/* Transparent Pricing Comparison */}
      <PricingTable />

      {/* Customer Testimonials */}
      <Testimonials />
    </>
  );
};