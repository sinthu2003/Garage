// ============================================
// META
// ============================================
export interface MetaContent {
  version: string;
  lastModified: string;
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
  workingHours: string;
}

export interface SocialContent {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface SEOContent {
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  indexable: boolean;
  followLinks: boolean;
  title: string;
  description: string;
}

export interface GlobalContent {
  navbar: any;
  brand: BrandContent;
  social: SocialContent;
  seo: SEOContent;
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
  value: string;
  prefix?: string;
  suffix?: string;
}

export interface HeroScrollingBrand {
  name: string;
  logo?: string;
}

export interface HeroContent {
  badge: string;
  headline: HeroHeadline;
  subheadline: string;
  savings: HeroSavings;
  cta: HeroCTA;
  backgroundImage: string;
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
  location: BookingStep;
  brand: BookingStep;
  model: BookingStep;
  fuel: BookingStep;
}

export interface BookingTrustBadges {
  rating: string;
  services: string;
}

export interface BookingWidgetContent {
  brands: never[];
  carModels: {};
  fuelTypes: { id: string; name: string; icon: string; color: string; }[];
  cities: string[];
  labels: any;
  screens: any;
  ctaText: string;
  trustFooter: any;
  title: string;
  subtitle: string;
  steps: BookingSteps;
  trustBadges: BookingTrustBadges;
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
  gradient: string;
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
  line1?: string;
  highlight?: string;
}

export interface ServiceItem {
  id: number | string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  features: string[];
  duration: string;
  warranty: string;
}

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

export interface BeforeAfterContent {
  beforeLabel: string;
  afterLabel: string;
  badge: string;
  headline: BeforeAfterHeadline;
  description: string;
  cta: string;
  selectLabel: string;
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
  contactCards: FAQContactCard[];
  items: FAQItem[];
}

// ============================================
// FOOTER
// ============================================
export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinks {
  services: FooterLink[];
  company: FooterLink[];
  support: FooterLink[];
  cities: string[];
}

export interface FooterContent {
  phone: string;
  email: string;
  workingHours: string;
  social: any;
  privacyUrl: string;
  termsUrl: string;
  logoUrl: string;
  tagline: string;
  brandName: string;
  description: string;
  links: FooterLinks;
  copyright: string;
}

// ============================================
// PAGES
// ============================================
export interface ServicesCTASection {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface ServicesPageContent {
  categories: { id: string; label: string; icon: string; }[];
  searchPlaceholder: string;
  cta: any;
  title: string;
  description: string;
  ctaSection: ServicesCTASection;
}

export interface NotFoundQuickLink {
  name: string;
  href: string;
}

export interface NotFoundPageContent {
  primaryButton: string;
  secondaryButton: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  primaryCta: string;
  secondaryCta: string;
  quickLinks: NotFoundQuickLink[];
}

export interface PagesContent {
  services: ServicesPageContent;
  notFound: NotFoundPageContent;
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
  price: number;
  originalPrice: number;
  image: string;
  gallery?: string[];          // Added
  features: string[];
  includes?: string[];         // Added
  process?: ServiceProcessStep[]; // Added
  faqs?: ServiceFAQ[];         // Added
  duration: string;
  warranty: string;
}
// ============================================
// EXPORT ALL TYPES
// ============================================
export type {
  // Can add type aliases here if needed
};