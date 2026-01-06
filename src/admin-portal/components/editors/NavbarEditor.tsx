import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Image,
  Link,
  ChevronRight,
  Phone,
  Menu,
  ExternalLink,
} from 'lucide-react';
import { useGlobalContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface NavbarEditorProps {
  isDarkMode: boolean;
}

export const NavbarEditor: React.FC<NavbarEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useGlobalContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['brand', 'navigation', 'contact'])
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
  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary border focus:outline-none focus:ring-2 focus:ring-primary/20`;

  const labelClass = `text-sm font-medium text-muted-foreground`;

  const sectionClass = `rounded-xl border overflow-hidden border-border bg-card`;

  const sectionHeaderClass = `w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-secondary/50`;

  // Default navigation items (these would typically be stored in content)
  const defaultNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
          <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Navbar Editor
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Logo, navigation links, and contact info
          </p>
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
                      value={content.brand?.name || ''}
                      onChange={(e) => handleUpdate('brand.name', e.target.value)}
                      placeholder="Addax"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Tagline</label>
                    <input
                      type="text"
                      value={content.brand?.tagline || ''}
                      onChange={(e) => handleUpdate('brand.tagline', e.target.value)}
                      placeholder="Automotive"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Logo Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Logo Preview
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {(content.brand?.name || 'A').charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-lg sm:text-xl text-foreground truncate">
                        {content.brand?.name || 'Addax'}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {content.brand?.tagline || 'Automotive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Info (Header) */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contact')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contact') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Info (Header)</span>
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
                    value={content.brand?.phone || ''}
                    onChange={(e) => handleUpdate('brand.phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={content.brand?.email || ''}
                    onChange={(e) => handleUpdate('brand.email', e.target.value)}
                    placeholder="support@addaxautomotive.in"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Working Hours</label>
                  <input
                    type="text"
                    value={content.brand?.workingHours || ''}
                    onChange={(e) => handleUpdate('brand.workingHours', e.target.value)}
                    placeholder="Mon-Sun: 8AM - 8PM"
                    className={inputClass}
                  />
                </div>

                {/* Header Bar Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Header Bar Preview
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-muted-foreground truncate">
                        📞 {content.brand?.phone || '+91 98765 43210'}
                      </span>
                      <span className="text-muted-foreground truncate">
                        ✉️ {content.brand?.email || 'support@addax.in'}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      🕐 {content.brand?.workingHours || 'Mon-Sun: 8AM - 8PM'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('navigation')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('navigation') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Navigation Links</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('navigation') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ Navigation links are typically managed in your router configuration.
                    The items shown below are for reference. To change navigation structure,
                    update your <code className="px-1 py-0.5 rounded bg-amber-500/20">AppRouter.tsx</code> file.
                  </p>
                </div>

                {/* Navigation Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Navigation Preview
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl bg-card shadow-sm overflow-x-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base">
                          {(content.brand?.name || 'A').charAt(0)}
                        </span>
                      </div>
                      <span className="font-bold text-foreground text-sm sm:text-base">
                        {content.brand?.name || 'Addax'}
                      </span>
                    </div>

                    {/* Nav Links - Hidden on mobile, shown as text */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-6">
                      {defaultNavItems.map((item, i) => (
                        <span
                          key={i}
                          className={`text-xs sm:text-sm whitespace-nowrap ${
                            i === 0
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Links Reference */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Current Navigation Links:
                  </p>
                  {defaultNavItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-card"
                    >
                      <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-foreground text-sm truncate">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-none">
                        {item.href}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social Links */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('social')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('social') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Social Links</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('social') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Facebook</label>
                    <input
                      type="url"
                      value={content.social?.facebook || ''}
                      onChange={(e) => handleUpdate('social.facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Twitter / X</label>
                    <input
                      type="url"
                      value={content.social?.twitter || ''}
                      onChange={(e) => handleUpdate('social.twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Instagram</label>
                    <input
                      type="url"
                      value={content.social?.instagram || ''}
                      onChange={(e) => handleUpdate('social.instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>YouTube</label>
                    <input
                      type="url"
                      value={content.social?.youtube || ''}
                      onChange={(e) => handleUpdate('social.youtube', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Social Icons Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Social Icons Preview
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {content.social?.facebook && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-card">
                        <span className="text-blue-600 font-bold text-sm sm:text-base">f</span>
                      </div>
                    )}
                    {content.social?.twitter && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-card">
                        <span className="text-sky-500 font-bold text-sm sm:text-base">𝕏</span>
                      </div>
                    )}
                    {content.social?.instagram && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-card">
                        <span className="text-pink-500 font-bold">📷</span>
                      </div>
                    )}
                    {content.social?.youtube && (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-card">
                        <span className="text-red-600 font-bold">▶</span>
                      </div>
                    )}
                    {!content.social?.facebook && !content.social?.twitter && !content.social?.instagram && !content.social?.youtube && (
                      <p className="text-xs sm:text-sm text-muted-foreground">No social links added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavbarEditor;