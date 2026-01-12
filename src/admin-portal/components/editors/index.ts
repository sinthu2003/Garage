// ============================================================================
// EDITOR EXPORTS
// Location: src/admin-portal/components/editors/index.ts
// ============================================================================

// Export all section-specific editors
export { HeroEditor } from './HeroEditor';
export { ServicesEditor } from './ServicesEditor';
export { ServiceDetailEditor } from './ServiceDetailEditor';
export { PricingEditor } from './PricingEditor';
export { TestimonialsEditor } from './TestimonialsEditor';
export { FAQEditor } from './FAQEditor';
export { FeaturesEditor } from './FeaturesEditor';
export { HowItWorksEditor } from './HowItWorksEditor';
export { PartnersEditor } from './PartnersEditor';
export { GalleryEditor } from './GalleryEditor';
export { BeforeAfterEditor } from './BeforeAfterEditor';
export { NavbarEditor } from './NavbarEditor';
export { FooterEditor } from './FooterEditor';
export { GlobalSettingsEditor } from './GlobalSettingsEditor';
export { BookingWidgetEditor } from './BookingWidgetEditor';
export { PagesEditor } from './PagesEditor';
export { PrivacyPolicyEditor } from './PrivacyPolicyEditor';
export { BlogEditor } from './BlogEditor';

// Export preview components
export {
  SectionPreviewWrapper,
  PreviewPanelHeader,
  PreviewUrlBar,
  devicePresets,
  getPreviewUrl,
  type DeviceType
} from './SectionPreviewWrapper';

// ============================================================================
// EDITOR CONFIGURATION
// Metadata for dynamic rendering and navigation
// ============================================================================

export const editorConfig = [
  {
    id: 'hero',
    label: 'Hero Section',
    icon: 'Sparkles',
    color: 'from-orange-500 to-red-500',
    component: 'HeroEditor',
    description: 'Main banner, headlines, CTAs, and statistics',
    previewRoute: '/#hero',
    category: 'content',
  },
  {
    id: 'services',
    label: 'Services Landing',
    icon: 'LayoutGrid',
    color: 'from-blue-500 to-cyan-500',
    component: 'ServicesEditor',
    description: 'Services section header and layout settings',
    previewRoute: '/#services',
    category: 'content',
  },
  {
    id: 'serviceDetail',
    label: 'Service Details',
    icon: 'Wrench',
    color: 'from-orange-500 to-red-500',
    component: 'ServiceDetailEditor',
    description: 'Individual service offerings and details',
    previewRoute: '/services',
    category: 'content',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: 'DollarSign',
    color: 'from-teal-500 to-emerald-500',
    component: 'PricingEditor',
    description: 'Price comparison table and savings highlights',
    previewRoute: '/#pricing',
    category: 'content',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'Star',
    color: 'from-yellow-500 to-amber-500',
    component: 'TestimonialsEditor',
    description: 'Customer reviews and ratings carousel',
    previewRoute: '/#testimonials',
    category: 'content',
  },
  {
    id: 'faq',
    label: 'FAQ & Contact',
    icon: 'HelpCircle',
    color: 'from-green-500 to-emerald-500',
    component: 'FAQEditor',
    description: 'FAQ section and Contact page settings',
    previewRoute: '/#faq',
    category: 'content',
  },
  {
    id: 'features',
    label: 'Features',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    component: 'FeaturesEditor',
    description: 'Why choose us section with feature cards',
    previewRoute: '/#features',
    category: 'sections',
  },
  {
    id: 'howItWorks',
    label: 'How It Works',
    icon: 'Layers',
    color: 'from-emerald-500 to-teal-500',
    component: 'HowItWorksEditor',
    description: 'Step-by-step process explanation',
    previewRoute: '/#how-it-works',
    category: 'sections',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: 'Users',
    color: 'from-indigo-500 to-purple-500',
    component: 'PartnersEditor',
    description: 'Partner brands and trust badges',
    previewRoute: '/#partners',
    category: 'sections',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'Image',
    color: 'from-pink-500 to-rose-500',
    component: 'GalleryEditor',
    description: 'Image gallery and showcase',
    previewRoute: '/#gallery',
    category: 'sections',
  },
  {
    id: 'beforeAfter',
    label: 'Before & After',
    icon: 'SplitSquareHorizontal',
    color: 'from-violet-500 to-purple-500',
    component: 'BeforeAfterEditor',
    description: 'Before and after comparison slider',
    previewRoute: '/#before-after',
    category: 'sections',
  },
  {
    id: 'navbar',
    label: 'Navbar',
    icon: 'Navigation',
    color: 'from-slate-600 to-slate-800',
    component: 'NavbarEditor',
    description: 'Navigation menu and logo settings',
    previewRoute: '/',
    category: 'layout',
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: 'LayoutGrid',
    color: 'from-gray-600 to-gray-800',
    component: 'FooterEditor',
    description: 'Footer links, contact info, and social media',
    previewRoute: '/#footer',
    category: 'layout',
  },
  {
    id: 'global',
    label: 'Global Settings',
    icon: 'Globe',
    color: 'from-indigo-500 to-blue-500',
    component: 'GlobalSettingsEditor',
    description: 'Site-wide settings, colors, and metadata',
    previewRoute: '/',
    category: 'settings',
  },
  {
    id: 'bookingWidget',
    label: 'Booking Widget',
    icon: 'CalendarCheck',
    color: 'from-purple-500 to-violet-500',
    component: 'BookingWidgetEditor',
    description: 'Booking form configuration',
    previewRoute: '/#booking',
    category: 'settings',
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: 'FileText',
    color: 'from-cyan-500 to-blue-500',
    component: 'PagesEditor',
    description: 'Manage site pages and their content',
    previewRoute: '/',
    category: 'settings',
  },
  {
    id: 'legal',
    label: 'Legal Documents',
    icon: 'Shield',
    color: 'from-slate-500 to-slate-700',
    component: 'PrivacyPolicyEditor',
    description: 'Manage privacy policy and terms',
    previewRoute: '/privacy-policy',
    category: 'settings',
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: 'BookOpen',
    color: 'from-orange-400 to-pink-500',
    component: 'BlogEditor',
    description: 'Manage blog posts',
    previewRoute: '/blog',
    category: 'content',
  },
] as const;

// ============================================================================
// TYPES
// ============================================================================

// Type for editor IDs (includes dynamic page previews)
export type EditorId = typeof editorConfig[number]['id'] | 'servicesPage' | 'notFoundPage' | 'faqSection' | 'contactPage' | 'privacyPolicyPage' | 'termsPage' | 'warrantyPolicyPage' | 'blogPage';

// Type for editor config items
export type EditorConfigItem = typeof editorConfig[number];

// Type for categories
export type EditorCategory = 'content' | 'sections' | 'layout' | 'settings';

// Type for page preview mapping
// Type for page preview mapping
export type PagePreviewId = 'servicesPage' | 'notFoundPage' | 'contactPage' | 'privacyPolicyPage' | 'termsPage' | 'warrantyPolicyPage' | 'blogPage';

// Type for FAQ editor page
export type FAQEditorPage = 'faqSection' | 'contactPage';

// Type for Legal editor page
export type LegalEditorPage = 'privacyPolicy' | 'termsOfService' | 'warrantyPolicy';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get editor configuration by ID
 */
export const getEditorConfig = (id: EditorId): EditorConfigItem | undefined => {
  return editorConfig.find(config => config.id === id);
};

/**
 * Get preview route by editor ID
 */
export const getEditorPreviewRoute = (id: EditorId): string => {
  // Handle dynamic page previews
  if (id === 'servicesPage') return '/services';
  if (id === 'notFoundPage') return '/404';
  if (id === 'faqSection') return '/#faq';
  if (id === 'contactPage') return '/contact';
  if (id === 'privacyPolicyPage') return '/privacy-policy';
  if (id === 'termsPage') return '/terms-of-service';
  if (id === 'warrantyPolicyPage') return '/warranty-policy';

  const config = getEditorConfig(id);
  return config?.previewRoute || '/';
};

/**
 * Get editors grouped by category
 */
export const editorCategories: Record<EditorCategory, readonly string[]> = {
  content: ['hero', 'services', 'serviceDetail', 'pricing', 'testimonials', 'faq', 'blog'],
  sections: ['features', 'howItWorks', 'partners', 'gallery', 'beforeAfter'],
  layout: ['navbar', 'footer'],
  settings: ['global', 'bookingWidget', 'pages', 'legal'],
} as const;

/**
 * Get editors by category
 */
export const getEditorsByCategory = (category: EditorCategory): EditorConfigItem[] => {
  const ids = editorCategories[category];
  return editorConfig.filter(config => ids.includes(config.id));
};

/**
 * Get all category labels
 */
export const categoryLabels: Record<EditorCategory, string> = {
  content: 'Content Sections',
  sections: 'Additional Sections',
  layout: 'Layout Components',
  settings: 'Settings & Configuration',
};

/**
 * Check if an editor has a direct preview component
 */
export const hasDirectPreview = (id: EditorId): boolean => {
  const noPreviewIds: string[] = ['serviceDetail', 'global'];
  // 'pages', 'faq', and 'legal' have dynamic preview based on selected tab
  return !noPreviewIds.includes(id);
};

/**
 * Get the preview section ID for the Pages editor based on selected tab
 * This is used by AdminPage to dynamically switch preview when PagesEditor tab changes
 */
export const getPagesPreviewId = (selectedPage: 'services' | 'notFound'): PagePreviewId => {
  return selectedPage === 'services' ? 'servicesPage' : 'notFoundPage';
};

/**
 * Get the preview section ID for the FAQ editor based on selected tab
 * This is used by AdminPage to dynamically switch preview when FAQEditor tab changes
 */
export const getFAQPreviewId = (selectedPage: FAQEditorPage): string => {
  return selectedPage === 'faqSection' ? 'faqSection' : 'contactPage';
};

/**
 * Get the preview section ID for the Legal editor based on selected tab
 */
export const getLegalPreviewId = (selectedPage: LegalEditorPage): PagePreviewId => {
  return selectedPage === 'privacyPolicy'
    ? 'privacyPolicyPage'
    : selectedPage === 'termsOfService'
      ? 'termsPage'
      : 'warrantyPolicyPage';
};

/**
 * Check if an editor ID is a dynamic page preview
 */
export const isDynamicPagePreview = (id: EditorId): boolean => {
  return id === 'servicesPage' || id === 'notFoundPage' || id === 'faqSection' || id === 'contactPage' || id === 'privacyPolicyPage' || id === 'termsPage' || id === 'warrantyPolicyPage' || id === 'blogPage';
};

/**
 * Check if an editor supports tab-based preview switching
 */
export const hasTabBasedPreview = (id: EditorId): boolean => {
  return id === 'pages' || id === 'faq' || id === 'legal';
};