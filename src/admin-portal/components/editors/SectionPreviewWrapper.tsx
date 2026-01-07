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
    placeholder: {
      title: 'Service Details',
      description: 'Individual service pages are dynamically generated based on your service items. Each service has its own dedicated page.',
      icon: Settings,
      tips: [
        'Add services in the editor on the left',
        'Each service creates a unique URL',
        'Click "Open in browser" to see all services'
      ]
    },
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
};

// ============================================================================
// MAIN SECTION PREVIEW WRAPPER COMPONENT
// ============================================================================

interface SectionPreviewWrapperProps {
  sectionId: string;
  device?: DeviceType;
  className?: string;
  refreshKey?: number;
}

export const SectionPreviewWrapper: React.FC<SectionPreviewWrapperProps> = ({
  sectionId,
  device = 'desktop',
  className = '',
  refreshKey = 0,
}) => {
  const config = sectionConfigs[sectionId];
  const deviceConfig = devicePresets[device];

  const previewContent = useMemo(() => {
    if (!config) {
      return <ErrorFallback sectionId={sectionId} />;
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
  }, [sectionId, config, refreshKey]);

  return (
    <div className={`preview-wrapper h-full ${className}`}>
      <motion.div
        key={`${sectionId}-${device}-${refreshKey}`}
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
                className={`p-1.5 rounded-md transition-all ${
                  device === d
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

// Preview routes mapping
const previewRoutes: Record<string, string> = {
  hero: '/#hero',
  services: '/#services',
  serviceDetail: '/services',
  pricing: '/#pricing',
  testimonials: '/#testimonials',
  faq: '/#faq',
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