// ============================================
// ADMIN PORTAL - MAIN EXPORTS
// ============================================


// Components
export { AdminPanel } from './components/AdminPanel';


// All Editors
export {
  HeroEditor,
  ServicesEditor,
  PricingEditor,
  TestimonialsEditor,
  FAQEditor,
  FeaturesEditor,
  HowItWorksEditor,
  PartnersEditor,
  GalleryEditor,
  BeforeAfterEditor,
  NavbarEditor,
  FooterEditor,
  GlobalSettingsEditor,
  BookingWidgetEditor,
  PagesEditor,
  editorConfig,
} from './components/editors';
export { Dashboard } from './components/Dashboard';
export { BookingsManagement } from './components/Bookingsmanagement';
export { ContactInquiries } from './components/ContactInquiries';

// Context
export { ContentProvider, useContent, ContentContext } from './context/ContentContext';
export type { ContentContextValue, ContentProviderProps } from './context/ContentContext';

// Hooks
export {
  useGlobalContent,
  useHeroContent,
  useBookingWidgetContent,
  useHowItWorksContent,
  useFeaturesContent,
  useServicesContent,
  usePricingContent,
  useBeforeAfterContent,
  useTestimonialsContent,
  useGalleryContent,
  usePartnersContent,
  useFAQContent,
  useFooterContent,
  usePagesContent,
  useContentField,
  useMultipleContent,
  useBrandContent,
  useSocialLinks,
  useSEOContent,
  useNavigationItems,
  useServicesList,
  useTestimonialsList,
  useFAQItems,
  useGalleryImages,
  usePricingItems,
  useBeforeAfterItems,
  useHowItWorksSteps,
  useFeatureItems,
} from './hooks/useContentHooks';

// Types
export type {
  SiteContent,
  MetaContent,
  GlobalContent,
  BrandContent,
  SocialContent,
  SEOContent,
  HeroContent,
  HeroHeadline,
  HeroCTA,
  HeroSavings,
  HeroStat,
  HeroScrollingBrand,
  BookingWidgetContent,
  BookingStep,
  BookingSteps,
  BookingTrustBadges,
  HowItWorksContent,
  HowItWorksHeadline,
  HowItWorksStep,
  FeaturesContent,
  FeaturesHeadline,
  MainFeature,
  FeatureItem,
  ServicesContent,
  ServicesHeadline,
  ServiceItem,
  PricingContent,
  PricingHeadline,
  PricingItem,
  PricingFeatureImage,
  PricingSavingsCard,
  BeforeAfterContent,
  BeforeAfterHeadline,
  BeforeAfterItem,
  TestimonialsContent,
  TestimonialsHeadline,
  TestimonialItem,
  GalleryContent,
  GalleryHeadline,
  GalleryCategory,
  GalleryImage,
  GalleryStat,
  PartnersContent,
  PartnersHeadline,
  PartnerTrustBadge,
  FAQContent,
  FAQHeadline,
  FAQContactCard,
  FAQItem,
  FooterContent,
  FooterLink,
  FooterLinks,
  PagesContent,
  ServicesPageContent,
  ServicesCTASection,
  NotFoundPageContent,
  NotFoundQuickLink,
} from './types/content.types';

// Default content data
export { default as defaultSiteContent } from './data/siteContent.json';