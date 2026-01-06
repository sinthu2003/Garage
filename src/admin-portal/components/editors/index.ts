// Export all section-specific editors
export { HeroEditor } from './HeroEditor';
export { ServicesEditor } from './ServicesEditor';
export { ServiceDetailEditor } from './ServiceDetailEditor'; // New export
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

// Editor metadata for dynamic rendering
export const editorConfig = [
  {
    id: 'hero',
    label: 'Hero Section',
    icon: 'Sparkles',
    color: 'from-orange-500 to-red-500',
    component: 'HeroEditor',
  },
  {
    id: 'services',
    label: 'Services Landing',
    icon: 'LayoutGrid', // Changed Icon
    color: 'from-blue-500 to-cyan-500',
    component: 'ServicesEditor',
  },
  {
    id: 'serviceDetail', // New Config Entry
    label: 'Service Details',
    icon: 'Wrench',
    color: 'from-orange-500 to-red-500',
    component: 'ServiceDetailEditor',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: 'DollarSign',
    color: 'from-teal-500 to-emerald-500',
    component: 'PricingEditor',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'Star',
    color: 'from-yellow-500 to-amber-500',
    component: 'TestimonialsEditor',
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: 'HelpCircle',
    color: 'from-green-500 to-emerald-500',
    component: 'FAQEditor',
  },
  {
    id: 'features',
    label: 'Features',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    component: 'FeaturesEditor',
  },
  {
    id: 'howItWorks',
    label: 'How It Works',
    icon: 'Layers',
    color: 'from-emerald-500 to-teal-500',
    component: 'HowItWorksEditor',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: 'Users',
    color: 'from-indigo-500 to-purple-500',
    component: 'PartnersEditor',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'Image',
    color: 'from-pink-500 to-rose-500',
    component: 'GalleryEditor',
  },
  {
    id: 'beforeAfter',
    label: 'Before & After',
    icon: 'SplitSquareHorizontal',
    color: 'from-violet-500 to-purple-500',
    component: 'BeforeAfterEditor',
  },
  {
    id: 'navbar',
    label: 'Navbar',
    icon: 'Navigation',
    color: 'from-slate-600 to-slate-800',
    component: 'NavbarEditor',
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: 'LayoutGrid',
    color: 'from-gray-600 to-gray-800',
    component: 'FooterEditor',
  },
  {
    id: 'global',
    label: 'Global Settings',
    icon: 'Globe',
    color: 'from-indigo-500 to-blue-500',
    component: 'GlobalSettingsEditor',
  },
  {
    id: 'bookingWidget',
    label: 'Booking Widget',
    icon: 'CalendarCheck',
    color: 'from-purple-500 to-violet-500',
    component: 'BookingWidgetEditor',
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: 'FileText',
    color: 'from-cyan-500 to-blue-500',
    component: 'PagesEditor',
  },
] as const;

// Type for editor IDs
export type EditorId = typeof editorConfig[number]['id'];