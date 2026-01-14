/**
 * ============================================
 * CONTENT HOOKS - SECTION-WISE LAZY LOADING
 * ============================================
 * 
 * Each hook:
 * 1. Returns data from content.{section}
 * 2. Returns isLoading state for showing spinner
 * 
 * Data Flow:
 * - AdminPage calls loadSection('hero') when tab is clicked
 * - loadSection fetches from GET /api/content/hero
 * - Data is stored in content.hero
 * - useHeroContent() returns content.hero + isLoading
 * 
 * @file src/admin-portal/hooks/useContentHooks.ts
 */

import { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import type {
  GlobalContent,
  HeroContent,
  BookingWidgetContent,
  HowItWorksContent,
  FeaturesContent,
  ServicesContent,
  PricingContent,
  BeforeAfterContent,
  TestimonialsContent,
  GalleryContent,
  PartnersContent,
  FAQContent,
  FooterContent,
  PagesContent,
  SiteContent,
  NavbarContent,
} from '../types/content.types';

// ============================================
// SECTION HOOKS
// Each returns section data + isLoading
// ============================================

/**
 * Hook to access global content
 */
export const useGlobalContent = (): GlobalContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('global') ?? false;
  
  return useMemo(() => ({
    ...(content?.global || {} as GlobalContent),
    isLoading,
  }), [content?.global, isLoading]);
};

/**
 * Hook to access navbar content
 */
export const useNavbarContent = (): NavbarContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('navbar') ?? false;
  
  // Navbar can be at content?.navbar or content?.global.navbar
  const navbarData = content?.navbar || (content?.global as any)?.navbar || {};
  
  return useMemo(() => ({
    ...navbarData,
    isLoading,
  }), [navbarData, isLoading]);
};

/**
 * Hook to access hero section content
 */
export const useHeroContent = (): HeroContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('hero') ?? false;
  
  // [FIX] Safety check for undefined content
  const heroData = content?.hero || {} as HeroContent;
  
  return useMemo(() => ({
    ...heroData,
    isLoading,
  }), [heroData, isLoading]);
};

/**
 * Hook to access booking widget content
 */
export const useBookingWidgetContent = (): BookingWidgetContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('bookingWidget') ?? false;
  
  return useMemo(() => ({
    ...(content?.bookingWidget || {} as BookingWidgetContent),
    isLoading,
  }), [content?.bookingWidget, isLoading]);
};

/**
 * Hook to access how it works section content
 */
export const useHowItWorksContent = (): HowItWorksContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('howItWorks') ?? false;
  
  return useMemo(() => ({
    ...(content?.howItWorks || {} as HowItWorksContent),
    isLoading,
  }), [content?.howItWorks, isLoading]);
};

/**
 * Hook to access features section content
 */
export const useFeaturesContent = (): FeaturesContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('features') ?? false;
  
  return useMemo(() => ({
    ...(content?.features || {} as FeaturesContent),
    isLoading,
  }), [content?.features, isLoading]);
};

/**
 * Hook to access services section content
 */
export const useServicesContent = (): ServicesContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('services') ?? false;
  
  return useMemo(() => ({
    ...(content?.services || {} as ServicesContent),
    isLoading,
  }), [content?.services, isLoading]);
};

/**
 * Hook to access pricing section content
 */
export const usePricingContent = (): PricingContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('pricing') ?? false;
  
  return useMemo(() => ({
    ...(content?.pricing || {} as PricingContent),
    isLoading,
  }), [content?.pricing, isLoading]);
};

/**
 * Hook to access before/after section content
 */
export const useBeforeAfterContent = (): BeforeAfterContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('beforeAfter') ?? false;
  
  return useMemo(() => ({
    ...(content?.beforeAfter || {} as BeforeAfterContent),
    isLoading,
  }), [content?.beforeAfter, isLoading]);
};

/**
 * Hook to access testimonials section content
 */
export const useTestimonialsContent = (): TestimonialsContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('testimonials') ?? false;
  
  return useMemo(() => ({
    ...(content?.testimonials || {} as TestimonialsContent),
    isLoading,
  }), [content?.testimonials, isLoading]);
};

/**
 * Hook to access gallery section content
 */
export const useGalleryContent = (): GalleryContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('gallery') ?? false;
  
  return useMemo(() => ({
    ...(content?.gallery || {} as GalleryContent),
    isLoading,
  }), [content?.gallery, isLoading]);
};

/**
 * Hook to access partners section content
 */
export const usePartnersContent = (): PartnersContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('partners') ?? false;
  
  return useMemo(() => ({
    ...(content?.partners || {} as PartnersContent),
    isLoading,
  }), [content?.partners, isLoading]);
};

/**
 * Hook to access FAQ section content
 */
export const useFAQContent = (): FAQContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('faq') ?? false;
  
  return useMemo(() => ({
    ...(content?.faq || {} as FAQContent),
    isLoading,
  }), [content?.faq, isLoading]);
};

/**
 * Hook to access footer content
 */
export const useFooterContent = (): FooterContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('footer') ?? false;
  
  return useMemo(() => ({
    ...(content?.footer || {} as FooterContent),
    isLoading,
  }), [content?.footer, isLoading]);
};

/**
 * Hook to access pages content
 */
export const usePagesContent = (): PagesContent & { isLoading: boolean } => {
  const { content, isSectionLoading } = useContent();
  const isLoading = isSectionLoading?.('pages') ?? false;
  
  return useMemo(() => ({
    ...(content?.pages || {} as PagesContent),
    isLoading,
  }), [content?.pages, isLoading]);
};

// ============================================
// UTILITY HOOKS
// ============================================

export const useContentField = <T = unknown>(section: string, path: string): T | undefined => {
  const { content } = useContent();

  return useMemo(() => {
    const sectionContent = content[section as keyof typeof content];
    if (!sectionContent || typeof sectionContent !== 'object') {
      return undefined;
    }

    const keys = path.split('.');
    let current: unknown = sectionContent;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return current as T;
  }, [content, section, path]);
};

export const useMultipleContent = <K extends keyof SiteContent>(
  sections: K[]
): Pick<SiteContent, K> => {
  const { content } = useContent();

  return useMemo(() => {
    const result = {} as Pick<SiteContent, K>;
    for (const section of sections) {
      result[section] = content[section];
    }
    return result;
  }, [content, sections]);
};

// ============================================
// DERIVED HOOKS
// ============================================

export const useBrandContent = () => {
  const globalContent = useGlobalContent();
  return useMemo(
    () => ({
      name: globalContent.brand?.name || 'Addax',
      tagline: globalContent.brand?.tagline || 'Automotive',
      phone: globalContent.brand?.phone || '',
      email: globalContent.brand?.email || '',
      address: globalContent.brand?.address || '',
      workingHours: globalContent.brand?.workingHours || '',
      isLoading: globalContent.isLoading,
    }),
    [globalContent]
  );
};

export const useSocialLinks = () => {
  const globalContent = useGlobalContent();
  return useMemo(
    () => ({
      facebook: globalContent.social?.facebook || '',
      twitter: globalContent.social?.twitter || '',
      instagram: globalContent.social?.instagram || '',
      youtube: globalContent.social?.youtube || '',
      isLoading: globalContent.isLoading,
    }),
    [globalContent]
  );
};

export const useSEOContent = () => {
  const globalContent = useGlobalContent();
  return useMemo(
    () => ({
      title: globalContent.seo?.title || '',
      description: globalContent.seo?.description || '',
      isLoading: globalContent.isLoading,
    }),
    [globalContent]
  );
};

export const useNavigationItems = () => {
  const footerContent = useFooterContent();
  return useMemo(
    () => ({
      services: footerContent.links?.services || [],
      company: footerContent.links?.company || [],
      support: footerContent.links?.support || [],
      cities: footerContent.links?.cities || [],
      isLoading: footerContent.isLoading,
    }),
    [footerContent]
  );
};

export const useServicesList = () => {
  const servicesContent = useServicesContent();
  return useMemo(() => ({
    items: servicesContent.items || [],
    isLoading: servicesContent.isLoading,
  }), [servicesContent]);
};

export const useTestimonialsList = () => {
  const testimonialsContent = useTestimonialsContent();
  return useMemo(() => ({
    items: testimonialsContent.items || [],
    isLoading: testimonialsContent.isLoading,
  }), [testimonialsContent]);
};

export const useFAQItems = () => {
  const faqContent = useFAQContent();
  return useMemo(() => ({
    items: faqContent.items || [],
    isLoading: faqContent.isLoading,
  }), [faqContent]);
};

export const useGalleryImages = () => {
  const galleryContent = useGalleryContent();
  return useMemo(
    () => ({
      categories: galleryContent.categories || [],
      images: galleryContent.images || [],
      isLoading: galleryContent.isLoading,
    }),
    [galleryContent]
  );
};

export const usePricingItems = () => {
  const pricingContent = usePricingContent();
  return useMemo(() => ({
    items: pricingContent.items || [],
    isLoading: pricingContent.isLoading,
  }), [pricingContent]);
};

export const useBeforeAfterItems = () => {
  const beforeAfterContent = useBeforeAfterContent();
  return useMemo(() => ({
    items: beforeAfterContent.items || [],
    isLoading: beforeAfterContent.isLoading,
  }), [beforeAfterContent]);
};

export const useHowItWorksSteps = () => {
  const howItWorksContent = useHowItWorksContent();
  return useMemo(() => ({
    steps: howItWorksContent.steps || [],
    isLoading: howItWorksContent.isLoading,
  }), [howItWorksContent]);
};

export const useFeatureItems = () => {
  const featuresContent = useFeaturesContent();
  return useMemo(() => ({
    items: featuresContent.items || [],
    isLoading: featuresContent.isLoading,
  }), [featuresContent]);
};