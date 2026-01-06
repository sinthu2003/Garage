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
} from '../types/content.types';

/**
 * Hook to access global content (brand, social, seo)
 */
export const useGlobalContent = (): GlobalContent => {
  const { content } = useContent();
  return useMemo(() => content.global || ({} as GlobalContent), [content.global]);
};

/**
 * Hook to access hero section content
 */
export const useHeroContent = (): HeroContent => {
  const { content } = useContent();
  return useMemo(() => content.hero || ({} as HeroContent), [content.hero]);
};

/**
 * Hook to access booking widget content
 */
export const useBookingWidgetContent = (): BookingWidgetContent => {
  const { content } = useContent();
  return useMemo(() => content.bookingWidget || ({} as BookingWidgetContent), [content.bookingWidget]);
};

/**
 * Hook to access how it works section content
 */
export const useHowItWorksContent = (): HowItWorksContent => {
  const { content } = useContent();
  return useMemo(() => content.howItWorks || ({} as HowItWorksContent), [content.howItWorks]);
};

/**
 * Hook to access features section content
 */
export const useFeaturesContent = (): FeaturesContent => {
  const { content } = useContent();
  return useMemo(() => content.features || ({} as FeaturesContent), [content.features]);
};

/**
 * Hook to access services section content
 */
export const useServicesContent = (): ServicesContent => {
  const { content } = useContent();
  return useMemo(() => content.services || ({} as ServicesContent), [content.services]);
};

/**
 * Hook to access pricing section content
 */
export const usePricingContent = (): PricingContent => {
  const { content } = useContent();
  return useMemo(() => content.pricing || ({} as PricingContent), [content.pricing]);
};

/**
 * Hook to access before/after section content
 */
export const useBeforeAfterContent = (): BeforeAfterContent => {
  const { content } = useContent();
  return useMemo(() => content.beforeAfter || ({} as BeforeAfterContent), [content.beforeAfter]);
};

/**
 * Hook to access testimonials section content
 */
export const useTestimonialsContent = (): TestimonialsContent => {
  const { content } = useContent();
  return useMemo(() => content.testimonials || ({} as TestimonialsContent), [content.testimonials]);
};

/**
 * Hook to access gallery section content
 */
export const useGalleryContent = (): GalleryContent => {
  const { content } = useContent();
  return useMemo(() => content.gallery || ({} as GalleryContent), [content.gallery]);
};

/**
 * Hook to access partners section content
 */
export const usePartnersContent = (): PartnersContent => {
  const { content } = useContent();
  return useMemo(() => content.partners || ({} as PartnersContent), [content.partners]);
};

/**
 * Hook to access FAQ section content
 */
export const useFAQContent = (): FAQContent => {
  const { content } = useContent();
  return useMemo(() => content.faq || ({} as FAQContent), [content.faq]);
};

/**
 * Hook to access footer content
 */
export const useFooterContent = (): FooterContent => {
  const { content } = useContent();
  return useMemo(() => content.footer || ({} as FooterContent), [content.footer]);
};

/**
 * Hook to access pages content (services page, 404 page, etc.)
 */
export const usePagesContent = (): PagesContent => {
  const { content } = useContent();
  return useMemo(() => content.pages || ({} as PagesContent), [content.pages]);
};

/**
 * Hook to get a specific field value by section and path
 */
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

/**
 * Hook to get multiple content sections at once
 */
export const useMultipleContent = <K extends keyof SiteContent>(
  sections: K[]
): Pick<SiteContent, K> => {
  const { content } = useContent();

  return useMemo(() => {
    // Create a new object with the selected sections
    const result = {} as Pick<SiteContent, K>;
    for (const section of sections) {
      result[section] = content[section];
    }
    return result;
  }, [content, sections]);
};

/**
 * Hook for brand-specific content
 */
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
    }),
    [globalContent.brand]
  );
};

/**
 * Hook for social links
 */
export const useSocialLinks = () => {
  const globalContent = useGlobalContent();
  return useMemo(
    () => ({
      facebook: globalContent.social?.facebook || '',
      twitter: globalContent.social?.twitter || '',
      instagram: globalContent.social?.instagram || '',
      youtube: globalContent.social?.youtube || '',
    }),
    [globalContent.social]
  );
};

/**
 * Hook for SEO content
 */
export const useSEOContent = () => {
  const globalContent = useGlobalContent();
  return useMemo(
    () => ({
      title: globalContent.seo?.title || '',
      description: globalContent.seo?.description || '',
    }),
    [globalContent.seo]
  );
};

/**
 * Hook for navigation items
 */
export const useNavigationItems = () => {
  const footerContent = useFooterContent();
  return useMemo(
    () => ({
      services: footerContent.links?.services || [],
      company: footerContent.links?.company || [],
      support: footerContent.links?.support || [],
      cities: footerContent.links?.cities || [],
    }),
    [footerContent.links]
  );
};

/**
 * Hook for services list
 */
export const useServicesList = () => {
  const servicesContent = useServicesContent();
  return useMemo(() => servicesContent.items || [], [servicesContent.items]);
};

/**
 * Hook for testimonials list
 */
export const useTestimonialsList = () => {
  const testimonialsContent = useTestimonialsContent();
  return useMemo(() => testimonialsContent.items || [], [testimonialsContent.items]);
};

/**
 * Hook for FAQ items
 */
export const useFAQItems = () => {
  const faqContent = useFAQContent();
  return useMemo(() => faqContent.items || [], [faqContent.items]);
};

/**
 * Hook for gallery images
 */
export const useGalleryImages = () => {
  const galleryContent = useGalleryContent();
  return useMemo(
    () => ({
      categories: galleryContent.categories || [],
      images: galleryContent.images || [],
    }),
    [galleryContent.categories, galleryContent.images]
  );
};

/**
 * Hook for pricing items
 */
export const usePricingItems = () => {
  const pricingContent = usePricingContent();
  return useMemo(() => pricingContent.items || [], [pricingContent.items]);
};

/**
 * Hook for before/after items
 */
export const useBeforeAfterItems = () => {
  const beforeAfterContent = useBeforeAfterContent();
  return useMemo(() => beforeAfterContent.items || [], [beforeAfterContent.items]);
};

/**
 * Hook for how it works steps
 */
export const useHowItWorksSteps = () => {
  const howItWorksContent = useHowItWorksContent();
  return useMemo(() => howItWorksContent.steps || [], [howItWorksContent.steps]);
};

/**
 * Hook for feature items
 */
export const useFeatureItems = () => {
  const featuresContent = useFeaturesContent();
  return useMemo(() => featuresContent.items || [], [featuresContent.items]);
};