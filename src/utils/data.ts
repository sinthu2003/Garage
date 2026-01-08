/**
 * ============================================
 * DATA.TS - Unified Data Export
 * ============================================
 * * This file now imports from the single source of truth (siteContent.json)
 * and exports data in the format expected by existing components.
 * * It also resolves image paths using import.meta.glob.
 */

import siteContent from '../admin-portal/data/siteContent.json';
import type { 
  Service, 
  Testimonial, 
  Workshop,
  ServiceItem,
  TestimonialItem 
} from '../admin-portal/types/content.types';

// ============================================
// IMAGE RESOLUTION HELPER
// ============================================

// Import all images from the assets folder eagerly
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });

/**
 * Resolves a path string (e.g., "../assets/Logo.jpg") to the actual build URL.
 */
const resolveImage = (path: string | undefined): string => {
  if (!path) return '';
  // Return as is if it's an external URL
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Attempt to find the image in the glob import
  // The keys in 'images' are relative to this file (src/utils/data.ts).
  // Since siteContent uses "../assets/...", and data.ts is in src/utils,
  // "../assets/..." maps correctly to src/assets.
  const imageModule = images[path] as { default: string } | undefined;
  
  if (imageModule && imageModule.default) {
    return imageModule.default;
  }

  console.warn(`Image not found for path: ${path}`);
  return path;
};

// ============================================
// SERVICES
// ============================================

/**
 * Services array - maps from siteContent format to component format
 */
export const services: Service[] = siteContent.services.items.map((item) => ({
  id: String(item.id),
  title: item.title,
  description: item.description,
  icon: item.icon || 'Settings',
  price: item.price,
  originalPrice: item.originalPrice,
  image: resolveImage(item.image), // Resolve Image
  features: item.features,
  category: item.category || 'maintenance',
  duration: item.duration,
  warranty: item.warranty,
  includes: item.includes,
  process: item.process,
  faqs: item.faqs,
  gallery: (item as any).gallery,
}));

export const getServiceById = (id: string | number): Service | undefined => {
  return services.find((s) => s.id === String(id));
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find((service) => {
    const serviceSlug = service.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and');
    return serviceSlug === slug;
  });
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'all') return services;
  return services.filter((s) => s.category === category);
};

// ============================================
// TESTIMONIALS
// ============================================

export const testimonials: Testimonial[] = siteContent.testimonials.items.map((item) => ({
  id: String(item.id),
  user: item.name,
  role: item.role,
  content: item.content,
  rating: item.rating,
  carDetails: item.carModel,
  image: resolveImage(item.image) // Resolve Image if present
}));

export const testimonialsFull: TestimonialItem[] = siteContent.testimonials.items.map(item => ({
  ...item,
  image: resolveImage(item.image)
}));

// ============================================
// WORKSHOPS
// ============================================

export const workshops: Workshop[] = (siteContent.workshops || []).map((item) => ({
  id: String(item.id),
  name: item.name,
  address: item.address,
  rating: item.rating,
  amenities: item.amenities,
}));

export const getWorkshopById = (id: string): Workshop | undefined => {
  return workshops.find((w) => w.id === id);
};

// ============================================
// BOOKING DATA
// ============================================

export const cities: string[] = siteContent.bookingWidget.cities;
export const brands = siteContent.bookingWidget.brands.map(b => ({
  ...b,
  logo: resolveImage(b.logo)
}));
export const carModels = siteContent.bookingWidget.carModels; // Car model images are typically external URLs in your JSON, so strict mapping might not be needed, but good to check.
export const fuelTypes = siteContent.bookingWidget.fuelTypes;

export const getBrandById = (id: string) => {
  return brands.find((b) => b.id === id);
};

export const getModelsForBrand = (brandId: string) => {
  return carModels[brandId as keyof typeof carModels] || [];
};

// ============================================
// GALLERY DATA
// ============================================

export const galleryCategories = siteContent.gallery.categories;

// Map gallery images
export const galleryImages = siteContent.gallery.images.map(img => ({
  ...img,
  src: resolveImage(img.src)
}));

export const getGalleryByCategory = (category: string) => {
  if (category === 'all') return galleryImages;
  return galleryImages.filter((img) => img.category === category);
};

// ============================================
// PARTNERS / BRANDS DATA
// ============================================

export const partnerBrands = (siteContent.partners.brands || []).map(b => ({
  ...b,
  logo: resolveImage(b.logo)
}));

export const trustBadges = siteContent.partners.trustBadges;

// ============================================
// FAQ DATA
// ============================================

export const faqs = siteContent.faq.items;
export const faqContactCards = siteContent.faq.contactCards;

// ============================================
// PRICING DATA
// ============================================

// Map pricing items images
export const pricingItems = siteContent.pricing.items.map(item => ({
  ...item,
  image: resolveImage(item.image)
}));

export const calculateSavings = (market: number, ours: number): number => {
  return Math.round(((market - ours) / market) * 100);
};

export const getTotalSavings = (): { market: number; ours: number; savings: number } => {
  const totals = pricingItems.reduce(
    (acc, item) => ({
      market: acc.market + item.market,
      ours: acc.ours + item.ours,
    }),
    { market: 0, ours: 0 }
  );
  
  return {
    ...totals,
    savings: totals.market - totals.ours,
  };
};

// ============================================
// BEFORE/AFTER DATA
// ============================================

export const transformations = siteContent.beforeAfter.items.map(item => ({
  ...item,
  beforeImage: resolveImage(item.beforeImage),
  afterImage: resolveImage(item.afterImage)
}));

// ============================================
// HOW IT WORKS DATA
// ============================================

export const howItWorksSteps = siteContent.howItWorks.steps.map(step => ({
  ...step,
  image: resolveImage(step.image)
}));

// ============================================
// FEATURES DATA
// ============================================

export const features = siteContent.features.items.map(item => ({
  ...item,
  image: resolveImage(item.image)
}));

export const mainFeature = {
  ...siteContent.features.mainFeature,
  image: resolveImage(siteContent.features.mainFeature.image)
};

// ============================================
// HERO DATA
// ============================================

export const heroStats = siteContent.hero.stats;
export const scrollingBrands = siteContent.hero.scrollingBrands;

// ============================================
// FOOTER DATA
// ============================================

export const footerLinks = siteContent.footer.links;
export const footerCities = siteContent.footer.links.cities;

// ============================================
// GLOBAL / BRAND DATA
// ============================================

export const brandInfo = {
  ...siteContent.global.brand,
  logo: resolveImage(siteContent.global.brand.logo)
};

export const socialLinks = siteContent.global.social;
export const seoData = siteContent.global.seo;

// ============================================
// PROCESSED CONTENT EXPORTS (Raw + Resolved Images)
// ============================================

// We need to create a processed version of the content sections 
// so direct consumers get the resolved images.

export const heroContent = {
  ...siteContent.hero,
  backgroundImage: resolveImage(siteContent.hero.backgroundImage)
};

export const bookingContent = {
  ...siteContent.bookingWidget,
  steps: Object.entries(siteContent.bookingWidget.steps).reduce((acc, [key, val]) => {
    // @ts-ignore
    acc[key] = { ...val }; // No images in steps definition, but good to be safe
    return acc;
  }, {} as any)
};

export const howItWorksContent = {
  ...siteContent.howItWorks,
  steps: howItWorksSteps
};

export const featuresContent = {
  ...siteContent.features,
  mainFeature: mainFeature,
  items: features
};

export const servicesContent = {
  ...siteContent.services,
  items: services
};

export const pricingContent = {
  ...siteContent.pricing,
  featureImage: {
    ...siteContent.pricing.featureImage,
    image: resolveImage(siteContent.pricing.featureImage.image)
  },
  items: pricingItems
};

export const beforeAfterContent = {
  ...siteContent.beforeAfter,
  items: transformations
};

export const testimonialsContent = {
  ...siteContent.testimonials,
  items: testimonialsFull
};

export const galleryContent = {
  ...siteContent.gallery,
  images: galleryImages
};

export const partnersContent = {
  ...siteContent.partners,
  brands: partnerBrands
};

export const faqContent = siteContent.faq;
export const footerContent = siteContent.footer;
export const pagesContent = siteContent.pages;

// Export raw content as fallback (though images won't work)
export const rawContent = siteContent;

// ============================================
// TYPE RE-EXPORTS
// ============================================

export type { Service, Testimonial, Workshop, ServiceItem, TestimonialItem };