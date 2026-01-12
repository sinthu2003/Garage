import React, { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle,
  Maximize2,
  Eye,
  Globe,
  Settings,
  FileText
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

// ============================================================================
// LAZY LOAD SECTION COMPONENTS
// Path: from src/admin-portal/components/editors/ to src/components/home/
// ============================================================================

const Hero = lazy(() =>
  import('../../../components/home/Hero').then(m => ({ default: m.Hero }))
);

const ServiceGrid = lazy(() =>
  import('../../../components/home/ServiceGrid').then(m => ({ default: m.ServiceGrid }))
);

const PricingTable = lazy(() =>
  import('../../../components/home/PricingTable').then(m => ({ default: m.PricingTable }))
);

const Testimonials = lazy(() =>
  import('../../../components/home/Testimonials').then(m => ({ default: m.Testimonials }))
);

const FAQSection = lazy(() =>
  import('../../../components/home/FAQSection').then(m => ({ default: m.FAQSection }))
);

const Features = lazy(() =>
  import('../../../components/home/Features').then(m => ({ default: m.Features }))
);

const HowItWorks = lazy(() =>
  import('../../../components/home/Howitworks').then(m => ({ default: m.HowItWorks }))
);

const PartnersSection = lazy(() =>
  import('../../../components/home/PartnersSection').then(m => ({ default: m.PartnersSection }))
);

const GallerySection = lazy(() =>
  import('../../../components/home/Gallerysection').then(m => ({ default: m.GallerySection }))
);

const BeforeAfterSection = lazy(() =>
  import('../../../components/home/Beforeaftersection').then(m => ({ default: m.BeforeAfterSection }))
);

const BookingWidget = lazy(() =>
  import('../../../components/home/BookingWidget').then(m => ({ default: m.BookingWidget }))
);

// Layout components
const Navbar = lazy(() =>
  import('../../../components/layout/Navbar').then(m => ({ default: m.Navbar }))
);

const Footer = lazy(() =>
  import('../../../components/layout/Footer').then(m => ({ default: m.Footer }))
);

// Pages
const ServicesPage = lazy(() =>
  import('../../../pages/Servicespage').then(m => ({ default: m.ServicesPage }))
);

const NotFoundPage = lazy(() =>
  import('../../../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);

const ContactUsPage = lazy(() =>
  import('../../../pages/ContactUsPage').then(m => ({ default: m.ContactUsPage }))
);

const PrivacyPolicyPage = lazy(() =>
  import('../../../pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage }))
);

const TermsPage = lazy(() =>
  import('../../../pages/TermsPage').then(m => ({ default: m.TermsPage }))
);



// ============================================================================
// DEVICE PRESETS
// ============================================================================

export const devicePresets = {
  desktop: {
    width: '100%',
    height: '100%',
    scale: 1,
    icon: Monitor,
    label: 'Desktop',
    containerClass: 'w-full'
  },
  tablet: {
    width: '768px',
    height: '1024px',
    scale: 0.75,
    icon: Tablet,
    label: 'Tablet',
    containerClass: 'max-w-[768px] mx-auto'
  },
  mobile: {
    width: '375px',
    height: '812px',
    scale: 0.65,
    icon: Smartphone,
    label: 'Mobile',
    containerClass: 'max-w-[375px] mx-auto'
  },
};

export type DeviceType = keyof typeof devicePresets;

// ============================================================================
// LOADING & ERROR COMPONENTS
// ============================================================================

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading preview...' }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 bg-gray-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="w-8 h-8 text-primary" />
    </motion.div>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

const ErrorFallback: React.FC<{ sectionId: string; error?: string }> = ({ sectionId, error }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-6 bg-gray-50">
    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <div className="text-center">
      <h3 className="font-semibold text-gray-900 mb-1">Preview Unavailable</h3>
      <p className="text-sm text-gray-500">
        The preview for <strong className="text-gray-700">{sectionId}</strong> couldn't be loaded.
      </p>
      {error && (
        <p className="text-xs text-red-500 mt-2 max-w-md">{error}</p>
      )}
    </div>
  </div>
);

// ============================================================================
// PLACEHOLDER PREVIEW COMPONENT
// For sections that don't have direct visual preview
// ============================================================================

interface PlaceholderPreviewProps {
  title: string;
  description: string;
  icon?: React.FC<{ className?: string }>;
  tips?: string[];
}

const PlaceholderPreview: React.FC<PlaceholderPreviewProps> = ({
  title,
  description,
  icon: Icon = Eye,
  tips = []
}) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
    <motion.div
      className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <Icon className="w-12 h-12 text-primary" />
    </motion.div>

    <div className="text-center max-w-md">
      <motion.h3
        className="font-bold text-2xl text-gray-900 mb-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-gray-500 leading-relaxed"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </motion.p>
    </div>

    {tips.length > 0 && (
      <motion.div
        className="mt-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm max-w-sm"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tips</p>
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    )}

    <motion.div
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <ExternalLink className="w-4 h-4" />
      Open in browser for full preview
    </motion.div>
  </div>
);

// ============================================================================
// SERVICE DETAIL PREVIEW COMPONENT
// Shows actual service being edited or sample template for new services
// ============================================================================

interface ServiceDetailPreviewProps {
  editingServiceIndex: number | null;
}

const ServiceDetailPreviewWrapper: React.FC<ServiceDetailPreviewProps> = ({ editingServiceIndex }) => {
  // This component wraps ServiceDetailPage and injects the correct service data
  // based on editingServiceIndex

  if (editingServiceIndex === null) {
    // Show placeholder when viewing the list (no service selected)
    return (
      <PlaceholderPreview
        title="Service Details Preview"
        description="Select a service to edit from the list on the left to see its live preview here. Add a new service to see the sample template."
        icon={Settings}
        tips={[
          'Click "Edit" on any service to see its preview',
          'Add a new service to see the default template',
          'Changes reflect in real-time as you edit'
        ]}
      />
    );
  }

  // When editing a service, render the actual ServiceDetailPage
  // We'll pass the service index via a custom context or URL state
  return (
    <Suspense fallback={<LoadingSpinner message="Loading service preview..." />}>
      <ServiceDetailPreviewContent editingIndex={editingServiceIndex} />
    </Suspense>
  );
};

// Inner component that renders the service detail preview
const ServiceDetailPreviewContent: React.FC<{ editingIndex: number }> = ({ editingIndex }) => {
  // Get content from the imported useContent hook
  const { content } = useContent();
  const services = content?.services?.items || [];
  const service = services[editingIndex];

  if (!service) {
    return (
      <PlaceholderPreview
        title="Service Not Found"
        description="The service you're trying to preview doesn't exist. Please select a valid service from the list."
        icon={AlertCircle}
        tips={['Go back and select an existing service', 'Or add a new service to preview']}
      />
    );
  }

  // Render a mock service detail page preview
  return (
    <div className="min-h-screen bg-background">
      {/* Service Preview Header */}
      <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 text-center">
        <p className="text-xs text-primary font-medium">
          Live Preview • Editing: {service.title || 'Untitled Service'}
        </p>
      </div>

      {/* Service Detail Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {/* Back Button Mock */}
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Services</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-4 aspect-[4/3] bg-gray-200">
              {service.image || (service.gallery && service.gallery[0]) ? (
                <img
                  src={service.image || service.gallery?.[0] || ''}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No image added</p>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.duration || '2-4 hours'}
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {service.warranty || '6 months'}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {service.gallery && service.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {service.gallery.slice(0, 4).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ${idx === 0 ? 'ring-2 ring-primary' : 'opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {service.title || 'Service Title'}
            </h1>

            {/* Rating Mock */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.8 (2,340 reviews)</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {service.description || 'Service description will appear here. Add a description in the editor to see it in the preview.'}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-foreground">
                ₹{(service.price || 999).toLocaleString()}
              </span>
              {service.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{service.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {Math.round((1 - service.price / service.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all">
                Book Now
              </button>
              <button className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </button>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <h3 className="font-semibold text-foreground mb-3">Service Features</h3>
                <ul className="space-y-2">
                  {service.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature || 'Feature item'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* What's Included Section */}
        {service.includes && service.includes.length > 0 && (
          <section className="py-12 mt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.includes.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">{item || 'Include item'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Process Steps Section */}
        {service.process && service.process.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.process.map((step: { title: string; description: string }, idx: number) => (
                <div key={idx} className="relative flex gap-4 p-5 bg-card rounded-2xl border border-border">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title || `Step ${idx + 1}`}</h3>
                    <p className="text-sm text-muted-foreground">{step.description || 'Step description'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {service.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between p-5">
                    <span className="font-semibold text-foreground">{faq.question || 'FAQ Question?'}</span>
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {idx === 0 && (
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      <p className="text-muted-foreground">{faq.answer || 'FAQ Answer will appear here.'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SECTION PREVIEW CONFIGURATION
// ============================================================================

interface SectionPreviewConfig {
  component: React.LazyExoticComponent<React.FC<any>> | null;
  placeholder?: {
    title: string;
    description: string;
    icon?: React.FC<{ className?: string }>;
    tips?: string[];
  };
  wrapperClass?: string;
  backgroundColor?: string;
  containFixed?: boolean; // For components with position:fixed that need to be contained
  useDynamicPreview?: boolean; // For sections that need dynamic preview based on editing state
}

const sectionConfigs: Record<string, SectionPreviewConfig> = {
  hero: {
    component: Hero,
    wrapperClass: 'min-h-[600px]',
    backgroundColor: 'bg-gray-900',
  },
  services: {
    component: ServiceGrid,
    wrapperClass: '',
    backgroundColor: 'bg-gray-100',
  },
  serviceDetail: {
    component: null,
    useDynamicPreview: true, // This will use ServiceDetailPreviewWrapper
    wrapperClass: 'min-h-[800px]',
    backgroundColor: 'bg-white',
  },
  pricing: {
    component: PricingTable,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  testimonials: {
    component: Testimonials,
    wrapperClass: '',
    backgroundColor: 'bg-gray-900',
  },
  faq: {
    component: FAQSection,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  // NEW: FAQ Section preview (for FAQ Section tab in FAQEditor)
  faqSection: {
    component: FAQSection,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  // NEW: Contact Page preview (for Contact Page tab in FAQEditor)
  contactPage: {
    component: ContactUsPage,
    wrapperClass: 'min-h-[800px]',
    backgroundColor: 'bg-white',
  },
  features: {
    component: Features,
    wrapperClass: '',
    backgroundColor: 'bg-gray-50',
  },
  howItWorks: {
    component: HowItWorks,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  partners: {
    component: PartnersSection,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  gallery: {
    component: GallerySection,
    wrapperClass: '',
    backgroundColor: 'bg-gray-900',
  },
  beforeAfter: {
    component: BeforeAfterSection,
    wrapperClass: '',
    backgroundColor: 'bg-white',
  },
  navbar: {
    component: Navbar,
    wrapperClass: 'relative min-h-[600px] overflow-hidden',
    backgroundColor: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600',
    containFixed: true, // Special flag for fixed-position components
  },
  footer: {
    component: Footer,
    wrapperClass: '',
    backgroundColor: 'bg-gray-900',
  },
  global: {
    component: null,
    placeholder: {
      title: 'Global Settings',
      description: 'These settings affect your entire website including colors, fonts, SEO metadata, and site-wide configurations.',
      icon: Globe,
      tips: [
        'Changes apply to all pages',
        'SEO settings affect search rankings',
        'Color changes update the theme globally'
      ]
    },
  },
  bookingWidget: {
    component: BookingWidget,
    wrapperClass: 'flex items-center justify-center p-8 min-h-[600px]',
    backgroundColor: 'bg-gray-900',
  },
  pages: {
    component: null,
    placeholder: {
      title: 'Pages Management',
      description: 'Select "Services Page" or "404 Page" tabs in the editor to see live previews of each page.',
      icon: FileText,
      tips: [
        'Switch between page tabs to see different previews',
        'Each page has its own content settings',
        'Preview pages individually in browser'
      ]
    },
  },
  servicesPage: {
    component: ServicesPage,
    wrapperClass: 'min-h-[800px]',
    backgroundColor: 'bg-white',
  },
  notFoundPage: {
    component: NotFoundPage,
    wrapperClass: 'min-h-[600px]',
    backgroundColor: 'bg-gray-900',
  },
  privacyPolicyPage: {
    component: PrivacyPolicyPage,
    wrapperClass: 'min-h-[800px]',
    backgroundColor: 'bg-white',
  },
  termsPage: {
    component: TermsPage,
    wrapperClass: 'min-h-[800px]',
    backgroundColor: 'bg-white',
  },
};

// ============================================================================
// MAIN SECTION PREVIEW WRAPPER COMPONENT
// ============================================================================

interface SectionPreviewWrapperProps {
  sectionId: string;
  device?: DeviceType;
  className?: string;
  refreshKey?: number;
  editingServiceIndex?: number | null; // For serviceDetail preview
}

export const SectionPreviewWrapper: React.FC<SectionPreviewWrapperProps> = ({
  sectionId,
  device = 'desktop',
  className = '',
  refreshKey = 0,
  editingServiceIndex = null,
}) => {
  const config = sectionConfigs[sectionId];
  const deviceConfig = devicePresets[device];

  const previewContent = useMemo(() => {
    if (!config) {
      return <ErrorFallback sectionId={sectionId} />;
    }

    // Handle dynamic preview for serviceDetail
    if (sectionId === 'serviceDetail' && config.useDynamicPreview) {
      return (
        <div className={`${config.wrapperClass} ${config.backgroundColor || 'bg-white'}`}>
          <ServiceDetailPreviewWrapper editingServiceIndex={editingServiceIndex} />
        </div>
      );
    }

    if (!config.component && config.placeholder) {
      return (
        <PlaceholderPreview
          title={config.placeholder.title}
          description={config.placeholder.description}
          icon={config.placeholder.icon}
          tips={config.placeholder.tips}
        />
      );
    }

    if (config.component) {
      const SectionComponent = config.component;

      // For components with position:fixed (like Navbar), wrap in a container that isolates the fixed positioning
      if (config.containFixed) {
        return (
          <Suspense fallback={<LoadingSpinner message={`Loading ${sectionId} preview...`} />}>
            <div
              className={`${config.wrapperClass} ${config.backgroundColor || 'bg-white'}`}
              style={{
                position: 'relative',
                transform: 'translateZ(0)', // Creates new stacking context
                isolation: 'isolate',
              }}
            >
              {/* Transform container to contain fixed positioning */}
              <div style={{ transform: 'scale(1)' }}>
                <SectionComponent />
              </div>
            </div>
          </Suspense>
        );
      }

      return (
        <Suspense fallback={<LoadingSpinner message={`Loading ${sectionId} preview...`} />}>
          <div className={`${config.wrapperClass} ${config.backgroundColor || 'bg-white'}`}>
            <SectionComponent />
          </div>
        </Suspense>
      );
    }

    return <ErrorFallback sectionId={sectionId} />;
  }, [sectionId, config, refreshKey, editingServiceIndex]);

  return (
    <div className={`preview-wrapper h-full ${className}`}>
      <motion.div
        key={`${sectionId}-${device}-${refreshKey}-${editingServiceIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`preview-content overflow-auto h-full ${deviceConfig.containerClass}`}
        style={{
          transform: device !== 'desktop' ? `scale(${deviceConfig.scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {previewContent}
      </motion.div>
    </div>
  );
};

// ============================================================================
// PREVIEW PANEL HEADER COMPONENT
// ============================================================================

interface PreviewPanelHeaderProps {
  sectionId: string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  onRefresh: () => void;
  onOpenExternal: () => void;
  onCopyUrl: () => void;
  onFullscreen?: () => void;
  copiedUrl?: boolean;
  isDarkMode?: boolean;
}

export const PreviewPanelHeader: React.FC<PreviewPanelHeaderProps> = ({
  device,
  onDeviceChange,
  onRefresh,
  onOpenExternal,
  onCopyUrl,
  onFullscreen,
  copiedUrl = false,
  isDarkMode = true,
}) => {
  const themeClass = (dark: string, light: string) => isDarkMode ? dark : light;

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClass('bg-card border-border', 'bg-card border-border')}`}>
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-primary" />
        <span className={`text-sm font-medium ${themeClass('text-foreground', 'text-foreground')}`}>
          Live Preview
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${themeClass('bg-green-500/10 text-green-500', 'bg-green-500/10 text-green-600')}`}>
          Real-time
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Device Toggles */}
        <div className="hidden md:flex items-center gap-1 mr-2 p-1 rounded-lg bg-secondary/50">
          {(Object.keys(devicePresets) as DeviceType[]).map((d) => {
            const DeviceIcon = devicePresets[d].icon;
            return (
              <button
                key={d}
                onClick={() => onDeviceChange(d)}
                className={`p-1.5 rounded-md transition-all ${device === d
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')
                  }`}
                title={devicePresets[d].label}
              >
                <DeviceIcon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-border mx-1 hidden md:block" />

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className={`p-1.5 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
          title="Refresh Preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Copy URL */}
        <button
          onClick={onCopyUrl}
          className={`p-1.5 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
          title="Copy Preview URL"
        >
          {copiedUrl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Open in New Tab */}
        <button
          onClick={onOpenExternal}
          className={`p-1.5 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
          title="Open in New Tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className={`hidden md:flex p-1.5 rounded-lg transition-colors ${themeClass('hover:bg-secondary text-muted-foreground', 'hover:bg-secondary text-muted-foreground')}`}
            title="Fullscreen Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PREVIEW URL BAR COMPONENT
// ============================================================================

interface PreviewUrlBarProps {
  sectionId: string;
  isDarkMode?: boolean;
}

// Preview routes mapping - UPDATED with FAQ section routes
const previewRoutes: Record<string, string> = {
  hero: '/#hero',
  services: '/#services',
  serviceDetail: '/services/:service-name',
  pricing: '/#pricing',
  testimonials: '/#testimonials',
  faq: '/#faq',
  faqSection: '/#faq',
  contactPage: '/contact',
  features: '/#features',
  howItWorks: '/#how-it-works',
  partners: '/#partners',
  gallery: '/#gallery',
  beforeAfter: '/#before-after',
  navbar: '/',
  footer: '/#footer',
  global: '/',
  bookingWidget: '/#booking',
  pages: '/',
  servicesPage: '/services',
  notFoundPage: '/404',
};

export const getPreviewUrl = (sectionId: string): string => {
  return previewRoutes[sectionId] || '/';
};

export const PreviewUrlBar: React.FC<PreviewUrlBarProps> = ({ sectionId, isDarkMode = true }) => {
  const themeClass = (dark: string, light: string) => isDarkMode ? dark : light;
  const previewUrl = getPreviewUrl(sectionId);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com';

  return (
    <div className={`flex items-center gap-2 px-4 py-2 border-b ${themeClass('bg-secondary/50 border-border', 'bg-gray-100 border-gray-200')}`}>
      {/* Browser Dots */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" />
      </div>

      {/* URL Bar */}
      <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg ${themeClass('bg-background', 'bg-white')} border ${themeClass('border-border', 'border-gray-200')}`}>
        <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <span className={`text-xs truncate ${themeClass('text-muted-foreground', 'text-gray-500')}`}>
          {origin}{previewUrl}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default SectionPreviewWrapper;