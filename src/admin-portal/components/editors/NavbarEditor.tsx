import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  ChevronRight,
  Phone,
  Menu,
  GripVertical,
  Type,
  Link as LinkIcon,
  MousePointerClick,
} from 'lucide-react';
import { useGlobalContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import { ImageUpload } from '../shared/ImageUpload';
import { SectionLoader } from '../shared/SectionLoader';

interface NavbarEditorProps {
  isDarkMode: boolean;
}

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { label: 'Services', href: '/services', isRoute: true },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export const NavbarEditor: React.FC<NavbarEditorProps> = () => {
  const { updateField } = useContent();
  const content = useGlobalContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['brand', 'navigation', 'contact', 'cta'])
  );

  // Simple update function - debouncing handled by ContentContext
  const handleUpdate = (path: string, value: unknown) => {
    updateField('global', path, value);
  };

  // [LAZY LOADING] Show loading state - MUST be after all hooks
  if (content.isLoading) {
    return <SectionLoader section="Navbar" />;
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  const navLinks = content.navbar?.links || defaultNavLinks;

  const handleNavLinkUpdate = (index: number, field: keyof NavLink, value: unknown) => {
    const newLinks = [...navLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleUpdate('navbar.links', newLinks);
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Brand / Logo Section */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('brand')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brand') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Brand / Logo</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('brand') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Brand Name */}
                  <div className="space-y-2">
                    <label className={labelClass}>Brand Name</label>
                    <input
                      type="text"
                      value={content.brand?.name || ''}
                      onChange={(e) => handleUpdate('brand.name', e.target.value)}
                      placeholder="Addax"
                      className={inputClass}
                    />
                  </div>
                  {/* Title */}
                  <div className="space-y-2">
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={content.brand?.title || ''}
                      onChange={(e) => handleUpdate('brand.title', e.target.value)}
                      placeholder="Automotive"
                      className={inputClass}
                    />
                  </div>
                  {/* Tagline */}
                  <div className="space-y-2">
                    <label className={labelClass}>Tagline</label>
                    <input
                      type="text"
                      value={content.brand?.tagline || ''}
                      onChange={(e) => handleUpdate('brand.tagline', e.target.value)}
                      placeholder="Drive with Confidence"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Logo Image Upload */}
                <ImageUpload
                  value={content.brand?.logo || content.brand?.logoUrl || ''}
                  onChange={(url) => {
                    handleUpdate('brand.logo', url);
                    handleUpdate('brand.logoUrl', url);
                  }}
                  label="Logo Image"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-40"
                  maxSizeMB={2}
                  maxWidthOrHeight={1920}
                  helperText="Recommended: Transparent PNG or SVG logo"
                  showAltInput={false}
                  compact={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Info (shown in navbar) */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contact')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contact') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Info</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('contact') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    value={content.brand?.phone || ''}
                    onChange={(e) => handleUpdate('brand.phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed in navbar and used for call/WhatsApp links
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <div className={sectionClass}>
        <div className={`${sectionHeaderClass} cursor-pointer`}>
          <div
            onClick={() => toggleSection('navigation')}
            onKeyDown={(e) => e.key === 'Enter' && toggleSection('navigation')}
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 sm:gap-3 flex-1"
          >
            <motion.div animate={{ rotate: expandedSections.has('navigation') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Navigation Links</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {navLinks.length}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {expandedSections.has('navigation') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 border-t border-border">
                {navLinks.map((link: NavLink, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-secondary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground hidden sm:block" />
                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {link.label || 'Untitled Link'}
                        </span>
                      </div>
                     
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {/* Link Label */}
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Label</label>
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => handleNavLinkUpdate(index, 'label', e.target.value)}
                          placeholder="Link label"
                          className={inputClass}
                        />
                      </div>
                      {/* Link URL */}
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">URL / Anchor</label>
                        <input
                          type="text"
                          value={link.href || ''}
                          onChange={(e) => handleNavLinkUpdate(index, 'href', e.target.value)}
                          placeholder="#section or /page"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* isRoute checkbox */}
                    {/* <div className="mt-3 flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isRoute || false}
                          onChange={(e) => handleNavLinkUpdate(index, 'isRoute', e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                        />
                        <span className="text-xs text-muted-foreground">
                          Page route (navigates to new page instead of scrolling)
                        </span>
                      </label>
                    </div> */}
                  </div>
                ))}

                {navLinks.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Menu className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No navigation links</p>
                    <button
                      onClick={() => handleUpdate('navbar.links', defaultNavLinks)}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add default links
                    </button>
                  </div>
                )}

                {/* <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 <strong>Tip:</strong> Use <code className="px-1 py-0.5 rounded bg-blue-500/20">#section-id</code> for
                    same-page scrolling or <code className="px-1 py-0.5 rounded bg-blue-500/20">/page-path</code> for
                    page navigation. Enable "Page route" for links that go to different pages.
                  </p>
                </div> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('cta')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('cta') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">CTA Button</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('cta') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {/* Button Text */}
                <div className="space-y-2">
                  <label className={labelClass}>Button Text</label>
                  <input
                    type="text"
                    value={content.navbar?.ctaText || ''}
                    onChange={(e) => handleUpdate('navbar.ctaText', e.target.value)}
                    placeholder="Book Service"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Main CTA button text
                  </p>
                </div>

                {/* Call Now Text (Mobile) */}
                <div className="space-y-2">
                  <label className={labelClass}>Call Now Text (Mobile)</label>
                  <input
                    type="text"
                    value={content.navbar?.ctaTextMobile || ''}
                    onChange={(e) => handleUpdate('navbar.ctaTextMobile', e.target.value)}
                    placeholder="Call Now"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Text shown for phone link on mobile/desktop navbar
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Behavior Settings */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('behavior')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('behavior') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Behavior</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('behavior') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                {/* Transparent checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.navbar?.transparentOnHome !== false}
                    onChange={(e) => handleUpdate('navbar.transparentOnHome', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Transparent on Homepage</span>
                    <p className="text-xs text-muted-foreground">
                      Navbar is transparent at top of homepage, becomes solid on scroll
                    </p>
                  </div>
                </label>

                {/* Show phone checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.navbar?.showPhoneDesktop !== false}
                    onChange={(e) => handleUpdate('navbar.showPhoneDesktop', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Show Phone on Desktop</span>
                    <p className="text-xs text-muted-foreground">
                      Display phone number in desktop navbar header
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavbarEditor;