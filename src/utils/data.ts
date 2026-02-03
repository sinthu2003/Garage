/**
 * ============================================
 * DATA.TS - Unified Data Utility (API COMPATIBLE)
 * ============================================
 * [FIX] Removed siteContent.json import to prevent Vite EOF crash.
 * [FIX] Replaced hardcoded constants with empty exports.
 * [FIX] Prefixed unused arguments with '_' to silence linter warnings.
 * * NOTE: Components should now fetch data via useContent() hook 
 * instead of importing from this file. These exports exist 
 * only to prevent typescript errors during the migration.
 */

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
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp,avif}', { eager: true });

/**
 * Resolves a path string (e.g., "../assets/Logo.jpg") to the actual build URL.
 */
export const resolveImage = (path: string | undefined): string => {
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

  // console.warn(`Image not found for path: ${path}`);
  return path;
};

// ============================================
// SERVICES
// ============================================

/**
 * Services array - empty fallback
 */
export const services: Service[] = [];

// Prefix unused args with _ to silence "declared but never read" errors
export const getServiceById = (_id: string | number): Service | undefined => {
  return undefined;
};

export const getServiceBySlug = (_slug: string): Service | undefined => {
  return undefined;
};

export const getServicesByCategory = (_category: string): Service[] => {
  return [];
};

// ============================================
// TESTIMONIALS
// ============================================

export const testimonials: Testimonial[] = [];

export const testimonialsFull: TestimonialItem[] = [];

// ============================================
// WORKSHOPS
// ============================================

export const workshops: Workshop[] = [];

export const getWorkshopById = (_id: string): Workshop | undefined => {
  return undefined;
};

// ============================================
// BOOKING DATA
// ============================================

export const cities: string[] = [];
export const brands: any[] = [];
export const carModels: any = {}; 
export const fuelTypes: any[] = [];

export const getBrandById = (_id: string) => {
  return undefined;
};

export const getModelsForBrand = (_brandId: string) => {
  return [];
};

// ============================================
// GALLERY DATA
// ============================================

export const galleryCategories: any[] = [];

// Map gallery images
export const galleryImages: any[] = [];

export const getGalleryByCategory = (_category: string) => {
  return [];
};

// ============================================
// PARTNERS / BRANDS DATA
// ============================================

export const partnerBrands: any[] = [];

export const trustBadges: any[] = [];

// ============================================
// FAQ DATA
// ============================================

export const faqs: any[] = [];
export const faqContactCards: any[] = [];

// ============================================
// PRICING DATA
// ============================================

// Map pricing items images
export const pricingItems: any[] = [];

export const calculateSavings = (market: number, ours: number): number => {
  if (!market) return 0;
  return Math.round(((market - ours) / market) * 100);
};

export const getTotalSavings = (): { market: number; ours: number; savings: number } => {
  // Return zero values
  return {
    market: 0,
    ours: 0,
    savings: 0,
  };
};

// ============================================
// BEFORE/AFTER DATA
// ============================================

export const transformations: any[] = [];

// ============================================
// HOW IT WORKS DATA
// ============================================

export const howItWorksSteps: any[] = [];

// ============================================
// FEATURES DATA
// ============================================

export const features: any[] = [];

export const mainFeature: any = {};

// ============================================
// HERO DATA
// ============================================

export const heroStats: any[] = [];
export const scrollingBrands: any[] = [];

// ============================================
// FOOTER DATA
// ============================================

export const footerLinks: any = {};
export const footerCities: string[] = [];

// ============================================
// GLOBAL / BRAND DATA
// ============================================

export const brandInfo: any = {};

export const socialLinks: any = {};
export const seoData: any = {};

// ============================================
// PROCESSED CONTENT EXPORTS (Raw + Resolved Images)
// ============================================

// We need to create a processed version of the content sections 
// so direct consumers get the resolved images.

export const heroContent: any = {};

export const bookingContent: any = {};

export const howItWorksContent: any = {};

export const featuresContent: any = {};

export const servicesContent: any = {};

export const pricingContent: any = {};

export const beforeAfterContent: any = {};

export const testimonialsContent: any = {};

export const galleryContent: any = {};

export const partnersContent: any = {};

export const faqContent: any = {};
export const footerContent: any = {};
export const pagesContent: any = {};

// Export raw content as fallback
export const rawContent: any = {};

// ============================================
// TYPE RE-EXPORTS
// ============================================

export type { Service, Testimonial, Workshop, ServiceItem, TestimonialItem };