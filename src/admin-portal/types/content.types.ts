// ============================================
// UNIFIED CONTENT TYPES FOR ADMIN & USER UI
// Version: 2.1.0
// ============================================

import type { ReactNode } from 'react';

// ============================================
// META
// ============================================
export interface MetaContent {
  version: string;
  lastModified: string;
  description?: string;
}

// ============================================
// GLOBAL
// ============================================
export interface BrandContent {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  workingHours?: string;
  logo?: string;
  logoUrl?: string;
}

export interface SocialContent {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface SEOContent {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  indexable?: boolean;
  followLinks?: boolean;
}

export interface NavbarLink {
  label: string;
  href: string;
  isRoute?: boolean;
  hasDropdown?: boolean;
}

export interface NavbarContent {
  links: NavbarLink[];
  ctaText: string;
  // Additional fields used by NavbarEditor
  brandName?: string;
  tagline?: string;
  logoUrl?: string;
  phone?: string;
  ctaTextMobile?: string;
  ctaLink?: string;
  transparentOnHome?: boolean;
  showPhoneDesktop?: boolean;
}

export interface GlobalContent {
  brand: BrandContent;
  social: SocialContent;
  seo: SEOContent;
  navbar: NavbarContent;
}

// ============================================
// HERO
// ============================================
export interface HeroHeadline {
  line1: string;
  line2: string;
  highlight: string;
}

export interface HeroCTA {
  primary: string;
  secondary: string;
  videoUrl: string;
}

export interface HeroSavings {
  percentage: string;
  text: string;
}

export interface HeroStat {
  icon: string;
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}

export interface HeroScrollingBrand {
  name: string;
  logo?: string;
}


// NEW: Background image for slider
export interface HeroBackgroundImage {
  url: string;
  alt: string;
}

// NEW: Slider settings
export interface HeroSliderSettings {
  duration: number;
  transition: 'fade' | 'slide' | 'zoom';
  autoPlay: boolean;
  showIndicators: boolean;
}

export interface HeroContent {
  badge: string;
  headline: HeroHeadline;
  subheadline: string;
  savings: HeroSavings;
  cta: HeroCTA;
  // Legacy single image (backward compatibility) - now optional since we use backgroundImages array
  backgroundImage?: string;
  // NEW: Multiple background images for slider
  backgroundImages?: HeroBackgroundImage[];
  // NEW: Slider settings
  sliderSettings?: HeroSliderSettings;
  stats: HeroStat[];
  scrollingBrands: HeroScrollingBrand[];
}



// ============================================
// BOOKING WIDGET
// ============================================
export interface BookingStep {
  title: string;
  placeholder?: string;
  subtitle?: string;
}

export interface BookingSteps {
  phone?: BookingStep;
  location: BookingStep;
  brand: BookingStep;
  model: BookingStep;
  fuel: BookingStep;
}

export interface BookingTrustBadges {
  rating: string;
  services: string;
}

export interface BookingTrustFooter {
  rating: string;
  servicesCount: string;
}

export interface BookingLabels {
  city: string;
  brand: string;
  model: string;
  fuel: string;
  // Add missing fields accessed by BookingWidgetEditor
  car?: string;
  carPlaceholder?: string;
  mobile?: string;
  mobilePlaceholder?: string;
  countryCode?: string;
}

export interface BookingScreens {
  main: string;
  city: string;
  brand: string;
  model: string;
  fuel: string;
}

export interface CarBrand {
  id: string;
  name: string;
  logo: string;
  urlName: string;
}

export interface CarModel {
  name: string;
  type: string;
  image: string;
}

export interface FuelType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BookingWidgetContent {
  title: string;
  subtitle: string;
  ctaText: string;
  steps: BookingSteps;
  trustBadges: BookingTrustBadges;
  trustFooter?: BookingTrustFooter;
  labels?: BookingLabels;
  screens?: BookingScreens;
  cities: string[];
  brands: CarBrand[];
  carModels: Record<string, CarModel[]>;
  fuelTypes: FuelType[];
}

// ============================================
// HOW IT WORKS
// ============================================
export interface HowItWorksHeadline {
  line1: string;
  highlight: string;
}

export interface HowItWorksStep {
  number: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  image?: string;
}

export interface HowItWorksContent {
  badge: string;
  headline: HowItWorksHeadline;
  description: string;
  cta: string;
  steps: HowItWorksStep[];
}

// ============================================
// FEATURES
// ============================================
export interface FeaturesHeadline {
  line1: string;
  highlight: string;
}

export interface MainFeature {
  gradient?: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  image?: string;
}

export interface FeaturesContent {
  badge: string;
  headline: FeaturesHeadline;
  description: string;
  mainFeature: MainFeature;
  items: FeatureItem[];
}

// ============================================
// SERVICES
// ============================================
export interface ServicesHeadline {
  text?: string | ReactNode;
  line1?: string;
  highlight?: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: number | string;
  title: string;
  description: string;
  icon?: string;
  price: number;
  originalPrice: number;
  image: string;
  gallery?: string[];
  features: string[];
  includes?: string[];
  process?: ServiceProcessStep[];
  faqs?: ServiceFAQ[];
  duration: string;
  warranty: string;
  category?: string;
}

// Alias for backward compatibility with data.ts
export interface Service extends ServiceItem { }

export interface ServicesContent {
  badge: string;
  headline: ServicesHeadline;
  description: string;
  viewAllCta: string;
  items: ServiceItem[];
}

// ============================================
// PRICING
// ============================================
export interface PricingHeadline {
  line1: string;
  line2: string;
  muted?: string;
}

export interface PricingItem {
  service: string;
  market: number;
  ours: number;
  image?: string;
}

export interface PricingFeatureImage {
  subtitle: string;
  title: string;
  highlight: string;
  image: string;
}

export interface PricingSavingsCard {
  label: string;
  multiplier: number;
}

export interface PricingContent {
  badge: string;
  headline: PricingHeadline;
  description: string;
  cta: string;
  highlights: string[];
  featureImage: PricingFeatureImage;
  items: PricingItem[];
  savingsCard: PricingSavingsCard;
}

// ============================================
// BEFORE & AFTER
// ============================================
export interface BeforeAfterHeadline {
  text: string;
  highlight: string;
}

export interface BeforeAfterItem {
  id: number | string;
  title: string;
  car: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  time: string;
  savings: string;
}
export interface BusinessHour {
  day: string;
  hours: string;
}

export interface ContactServiceOption {
  value: string;
  label: string;
}

export interface ContactPageSettings {
  formTitle?: string;
  formSubtitle?: string;
  submitButton?: string;
  successMessage?: string;
  callNowHref?: string;
  whatsappHref?: string;
  emailHref?: string;
  serviceOptions?: ContactServiceOption[];
}

export interface BeforeAfterContent {
  badge: string;
  headline: BeforeAfterHeadline;
  description: string;
  cta: string;
  selectLabel: string;
  beforeLabel: string;
  afterLabel: string;
  items: BeforeAfterItem[];
}

// ============================================
// TESTIMONIALS
// ============================================
export interface TestimonialsHeadline {
  line1: string;
  highlight: string;
}

export interface TestimonialItem {
  id: number | string;
  name: string;
  role: string;
  location: string;
  carModel: string;
  service: string;
  rating: number;
  content: string;
  image?: string;
}

// Alias for backward compatibility with data.ts
export interface Testimonial {
  id: string;
  user: string;
  role: string;
  content: string;
  rating: number;
  carDetails: string;
}

export interface TestimonialsContent {
  badge: string;
  headline: TestimonialsHeadline;
  items: TestimonialItem[];
}

// ============================================
// GALLERY
// ============================================
export interface GalleryHeadline {
  line1: string;
  highlight: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  category: string;
  title?: string;
  description?: string;
}

export interface GalleryStat {
  icon: string;
  value: string;
  label: string;
}

export interface GalleryContent {
  badge: string;
  headline: GalleryHeadline;
  description: string;
  categories: GalleryCategory[];
  images: GalleryImage[];
  stats: GalleryStat[];
}

// ============================================
// PARTNERS
// ============================================
export interface PartnersHeadline {
  text: string;
  highlight: string;
}

export interface PartnerBrand {
  name: string;
  logo: string;
}

export interface PartnerTrustBadge {
  icon: string;
  title: string;
  subtitle: string;
}

export interface PartnersContent {
  badge: string;
  headline: PartnersHeadline;
  description: string;
  brandCount: string;
  brandCountLabel: string;
  brands?: PartnerBrand[];
  trustBadges: PartnerTrustBadge[];
}

// ============================================
// FAQ
// ============================================
export interface FAQHeadline {
  line1: string;
  highlight: string;
}

export interface FAQContactCard {
  type: string;
  label: string;
  value: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  badge: string;
  headline: FAQHeadline;
  description: string;
  contactBadge: string;
  contactHeadline: FAQHeadline;
  contactDescription: string;
  mapEmbedUrl: string;
  contactCards: FAQContactCard[];
  items: FAQItem[];
  businessHours?: BusinessHour[];
  contactPage?: ContactPageSettings;
}

// ============================================
// FOOTER
// ============================================
export interface FooterLink {
  name?: string;
  label?: string;
  href: string;
}

export interface FooterLinkSection {
  title: string;
  items: FooterLink[];
}

export interface FooterLinks {
  services?: FooterLink[];
  company?: FooterLink[];
  support?: FooterLink[];
  sections?: FooterLinkSection[];
  cities?: string[];
  citiesTitle?: string;
}

export interface FooterCopyright {
  text: string;
  links: FooterLink[];
}

export interface FooterMadeWith {
  text: string;
  suffix: string;
}

export interface FooterContent {
  [x: string]: any;
  brandName?: string;
  tagline?: string;
  logoUrl?: string;
  description?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  social?: SocialContent;
  links: FooterLinks;
  copyright: FooterCopyright | string;
  madeWith?: FooterMadeWith;
  privacyUrl?: string;
  termsUrl?: string;
}

// ============================================
// PAGES
// ============================================
export interface ServicesCTASection {
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  primaryButton?: string;
  secondaryButton?: string;
  phone?: string;
}

export interface ServicesCategory {
  id: string;
  label: string;
  icon: string;
}

export interface ServicesPageCTA {
  title: string;
  description: string;
  primaryCta?: string;
  secondaryCta?: string;
  primaryButton?: string;
  secondaryButton?: string;
  phone?: string;
}

export interface ServicesPageContent {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  categories?: ServicesCategory[];
  cta?: ServicesPageCTA;
  ctaSection?: ServicesCTASection;
}

export interface NotFoundQuickLink {
  name: string;
  href: string;
}

export interface NotFoundPageContent {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  primaryCta?: string;
  primaryButton?: string;
  secondaryCta?: string;
  secondaryButton?: string;
  quickLinks?: NotFoundQuickLink[];
}

export interface PrivacyPolicySection {
  title: string;
  content: string;
}

export interface PrivacyPolicyPageContent {
  title?: string;
  description?: string;
  content?: string; // Keeping for backward compatibility if needed, but sections is preferred
  lastUpdated?: string;
  sections?: PrivacyPolicySection[];
}

export interface TermsPageContent {
  title?: string;
  description?: string;
  lastUpdated?: string;
  sections?: PrivacyPolicySection[]; // Reusing the section type as structure is identical
}

export interface PagesContent {
  services?: ServicesPageContent;
  notFound?: NotFoundPageContent;
  privacyPolicy?: PrivacyPolicyPageContent;
  termsOfService?: TermsPageContent;
}

// ============================================
// CONTACT (Optional)
// ============================================
export interface ContactHeadline {
  text: string;
  highlight: string;
}

export interface ContactContent {
  badge?: string;
  headline?: ContactHeadline;
  description?: string;
}

// ============================================
// WORKSHOPS (from data.ts)
// ============================================
export interface Workshop {
  id: string;
  name: string;
  address: string;
  rating: number;
  amenities: string[];
}

// ============================================
// SITE CONTENT (ROOT)
// ============================================
export interface SiteContent {
  meta: MetaContent;
  global: GlobalContent;
  hero: HeroContent;
  bookingWidget: BookingWidgetContent;
  howItWorks: HowItWorksContent;
  features: FeaturesContent;
  services: ServicesContent;
  pricing: PricingContent;
  beforeAfter: BeforeAfterContent;
  testimonials: TestimonialsContent;
  gallery: GalleryContent;
  partners: PartnersContent;
  faq: FAQContent;
  footer: FooterContent;
  pages: PagesContent;
  navbar?: NavbarContent;
  contact?: ContactContent;
  workshops?: Workshop[];
}

// ============================================
// UTILITY TYPES
// ============================================

// Type for section keys
export type SectionKey = keyof SiteContent;

// Type for getting content of a specific section
export type SectionContent<K extends SectionKey> = SiteContent[K];

// Partial update types for admin panel
export type PartialSiteContent = {
  [K in keyof SiteContent]?: Partial<SiteContent[K]>;
};

// ============================================
// IMAGE MAPPING TYPES
// ============================================
export interface ImageAssetMapping {
  key: string;
  path: string;
  fallback?: string;
}

// ============================================
// CONTENT CONTEXT TYPES
// ============================================
export interface ContentContextValue {
  content: SiteContent;
  updateField: (section: string, path: string, value: unknown) => void;
  updateSection: (section: string, value: unknown) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (jsonString: string) => boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  // NEW: Apply and Discard changes methods
  applyChanges: () => Promise<void>;
  discardChanges: () => void;
}

// ============================================
// HELPER TYPE GUARDS
// ============================================
export const isServiceItem = (item: unknown): item is ServiceItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'price' in item
  );
};

export const isTestimonialItem = (item: unknown): item is TestimonialItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'rating' in item
  );
};

export const isGalleryImage = (item: unknown): item is GalleryImage => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'src' in item &&
    'category' in item
  );
};

// ============================================
// EXPORT ALL TYPES
// ============================================
export type {
  // Re-export for convenience
};