import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  ChevronRight,
  Phone,
  Menu,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Link as LinkIcon,
  MousePointerClick,
} from 'lucide-react';
import { useGlobalContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface NavbarEditorProps {
  isDarkMode: boolean;
}

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

export const NavbarEditor: React.FC<NavbarEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useGlobalContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['brand', 'navigation', 'contact', 'cta'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleUpdate = (path: string, value: unknown) => {
    updateField('global', path, value);
  };

  // Theme-aware styling helpers using CSS variables
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Default navigation items matching Navbar.tsx
  const defaultNavLinks: NavLink[] = content.navbar?.links || [
    { label: 'Services', href: '/services', isRoute: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  // Get current navbar values with defaults
  const brandName = content.navbar?.brandName || 'Addax';
  const tagline = content.navbar?.tagline || 'Automotive';
  const phone = content.navbar?.phone || '+91 98765 43210';
  const ctaText = content.navbar?.ctaText || 'Book Service';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Inline Navbar Preview */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground">Navbar Preview</p>
        </div>
        <div className="bg-white p-3">
          {/* Desktop Navbar Preview */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm border border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {brandName.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {brandName}
                </span>
                <span className="text-[9px] font-semibold text-red-500 tracking-wider uppercase">
                  {tagline}
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden sm:flex items-center gap-3">
              {defaultNavLinks.slice(0, 4).map((link, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-full ${
                    i === 0 ? 'text-red-500 bg-gray-100' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </span>
              ))}
              {defaultNavLinks.length > 4 && (
                <span className="text-xs text-gray-400">+{defaultNavLinks.length - 4}</span>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                {phone}
              </span>
              <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-full">
                {ctaText}
              </button>
            </div>
          </div>

          {/* Mobile Navbar Preview */}
          <div className="mt-3 sm:hidden">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{brandName.charAt(0)}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{brandName}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Menu className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="space-y-2">
                    <label className={labelClass}>Brand Name</label>
                    <input
                      type="text"
                      value={content.navbar?.brandName || 'Addax'}
                      onChange={(e) => handleUpdate('navbar.brandName', e.target.value)}
                      placeholder="Addax"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Tagline</label>
                    <input
                      type="text"
                      value={content.navbar?.tagline || 'Automotive'}
                      onChange={(e) => handleUpdate('navbar.tagline', e.target.value)}
                      placeholder="Automotive"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Logo Image URL</label>
                  <input
                    type="text"
                    value={content.navbar?.logoUrl || ''}
                    onChange={(e) => handleUpdate('navbar.logoUrl', e.target.value)}
                    placeholder="/assets/Logo.jpg or https://..."
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default logo. Recommended size: 44x44px
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Info */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contact')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contact') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact (Header)</span>
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
                <div className="space-y-2">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    value={content.navbar?.phone || '+91 98765 43210'}
                    onChange={(e) => handleUpdate('navbar.phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed in header and mobile menu. Used for click-to-call.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <div className={sectionClass}>
        <div 
          onClick={() => toggleSection('navigation')} 
          onKeyDown={(e) => e.key === 'Enter' && toggleSection('navigation')}
          role="button"
          tabIndex={0}
          className={`${sectionHeaderClass} cursor-pointer`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('navigation') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Navigation Links</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              {defaultNavLinks.length}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newLinks = [...defaultNavLinks, { label: 'New Link', href: '#section' }];
              handleUpdate('navbar.links', newLinks);
            }}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
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
                {defaultNavLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground" />
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground flex-1">
                        Link #{index + 1}
                      </span>
                      <button
                        onClick={() => {
                          const newLinks = defaultNavLinks.filter((_, i) => i !== index);
                          handleUpdate('navbar.links', newLinks);
                        }}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...defaultNavLinks];
                            newLinks[index] = { ...newLinks[index], label: e.target.value };
                            handleUpdate('navbar.links', newLinks);
                          }}
                          placeholder="Link Label"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">URL / Anchor</label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const newLinks = [...defaultNavLinks];
                            newLinks[index] = { ...newLinks[index], href: e.target.value };
                            handleUpdate('navbar.links', newLinks);
                          }}
                          placeholder="#section or /page"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isRoute || false}
                          onChange={(e) => {
                            const newLinks = [...defaultNavLinks];
                            newLinks[index] = { ...newLinks[index], isRoute: e.target.checked };
                            handleUpdate('navbar.links', newLinks);
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                        />
                        <span className="text-xs text-muted-foreground">
                          Page route (navigates to new page instead of scrolling)
                        </span>
                      </label>
                    </div>
                  </div>
                ))}

                {defaultNavLinks.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Menu className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No navigation links</p>
                    <button
                      onClick={() => {
                        handleUpdate('navbar.links', [
                          { label: 'Services', href: '/services', isRoute: true },
                          { label: 'How It Works', href: '#how-it-works' },
                        ]);
                      }}
                      className="mt-2 text-primary text-sm font-medium"
                    >
                      + Add default links
                    </button>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 <strong>Tip:</strong> Use <code className="px-1 py-0.5 rounded bg-blue-500/20">#section-id</code> for 
                    same-page scrolling or <code className="px-1 py-0.5 rounded bg-blue-500/20">/page-path</code> for 
                    page navigation. Enable "Page route" for links that go to different pages.
                  </p>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Button Text (Desktop)</label>
                    <input
                      type="text"
                      value={content.navbar?.ctaText || 'Book Service'}
                      onChange={(e) => handleUpdate('navbar.ctaText', e.target.value)}
                      placeholder="Book Service"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Button Text (Mobile)</label>
                    <input
                      type="text"
                      value={content.navbar?.ctaTextMobile || 'Book Service Now'}
                      onChange={(e) => handleUpdate('navbar.ctaTextMobile', e.target.value)}
                      placeholder="Book Service Now"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Button Link</label>
                  <input
                    type="text"
                    value={content.navbar?.ctaLink || '/services'}
                    onChange={(e) => handleUpdate('navbar.ctaLink', e.target.value)}
                    placeholder="/services"
                    className={inputClass}
                  />
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