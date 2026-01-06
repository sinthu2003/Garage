import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Type,
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { useGlobalContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';

interface GlobalSettingsEditorProps {
  isDarkMode: boolean;
}

export const GlobalSettingsEditor: React.FC<GlobalSettingsEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useGlobalContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['brand', 'contact', 'social', 'seo'])
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Global Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Brand identity, contact info, social links, and SEO
          </p>
        </div>
      </div>

      {/* Brand Identity */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('brand')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('brand') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Brand Identity</span>
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

                {/* Brand Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Brand Preview
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-xl sm:text-2xl">
                        {(content.brand?.name || 'A').charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                        {content.brand?.name || 'Addax'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
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

      {/* Contact Information */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('contact')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('contact') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Contact Information</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={content.brand?.phone || ''}
                      onChange={(e) => handleUpdate('brand.phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={content.brand?.email || ''}
                      onChange={(e) => handleUpdate('brand.email', e.target.value)}
                      placeholder="support@addaxautomotive.in"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={content.brand?.address || ''}
                    onChange={(e) => handleUpdate('brand.address', e.target.value)}
                    placeholder="Coimbatore, Tamil Nadu"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={content.brand?.workingHours || ''}
                    onChange={(e) => handleUpdate('brand.workingHours', e.target.value)}
                    placeholder="Mon-Sun: 8AM - 8PM"
                    className={inputClass}
                  />
                </div>

                {/* Contact Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Contact Card Preview
                  </p>
                  <div className="p-3 sm:p-4 rounded-xl bg-card space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-green-500/10 flex-shrink-0">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                          {content.brand?.phone || '+91 98765 43210'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-blue-500/10 flex-shrink-0">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                          {content.brand?.email || 'support@addax.in'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-red-500/10 flex-shrink-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                          {content.brand?.address || 'Coimbatore, Tamil Nadu'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-purple-500/10 flex-shrink-0">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Hours</p>
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">
                          {content.brand?.workingHours || 'Mon-Sun: 8AM - 8PM'}
                        </p>
                      </div>
                    </div>
                  </div>
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
            <span className="font-medium text-foreground text-sm sm:text-base">Social Media Links</span>
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
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Facebook className="w-4 h-4 inline mr-1 text-blue-600" />
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={content.social?.facebook || ''}
                      onChange={(e) => handleUpdate('social.facebook', e.target.value)}
                      placeholder="https://facebook.com/addaxautomotive"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Twitter className="w-4 h-4 inline mr-1 text-sky-500" />
                      Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={content.social?.twitter || ''}
                      onChange={(e) => handleUpdate('social.twitter', e.target.value)}
                      placeholder="https://twitter.com/addaxautomotive"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Instagram className="w-4 h-4 inline mr-1 text-pink-500" />
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={content.social?.instagram || ''}
                      onChange={(e) => handleUpdate('social.instagram', e.target.value)}
                      placeholder="https://instagram.com/addaxautomotive"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Youtube className="w-4 h-4 inline mr-1 text-red-600" />
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={content.social?.youtube || ''}
                      onChange={(e) => handleUpdate('social.youtube', e.target.value)}
                      placeholder="https://youtube.com/@ADDAXAUTOMOTIVE"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Social Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Social Icons Preview
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <a
                      href={content.social?.facebook || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                        content.social?.facebook
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    
                    <a
                      href={content.social?.twitter || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                        content.social?.twitter
                          ? 'bg-sky-500 text-white hover:bg-sky-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    
                    <a
                      href={content.social?.instagram || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                        content.social?.instagram
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    
                    <a
                      href={content.social?.youtube || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                        content.social?.youtube
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEO Settings */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('seo')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('seo') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">SEO Settings</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('seo') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="space-y-2">
                  <label className={labelClass}>Page Title</label>
                  <input
                    type="text"
                    value={content.seo?.title || ''}
                    onChange={(e) => handleUpdate('seo.title', e.target.value)}
                    placeholder="Addax Automotive - Premium Car Service"
                    className={inputClass}
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Recommended: 50-60 characters
                    </p>
                    <p className={`text-xs ${
                      (content.seo?.title?.length || 0) > 60
                        ? 'text-destructive'
                        : (content.seo?.title?.length || 0) >= 50
                          ? 'text-green-500'
                          : 'text-muted-foreground'
                    }`}>
                      {content.seo?.title?.length || 0}/60
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Meta Description</label>
                  <textarea
                    value={content.seo?.description || ''}
                    onChange={(e) => handleUpdate('seo.description', e.target.value)}
                    placeholder="India's leading car service network offering quality repairs at transparent prices..."
                    rows={3}
                    className={inputClass}
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Recommended: 150-160 characters
                    </p>
                    <p className={`text-xs ${
                      (content.seo?.description?.length || 0) > 160
                        ? 'text-destructive'
                        : (content.seo?.description?.length || 0) >= 150
                          ? 'text-green-500'
                          : 'text-muted-foreground'
                    }`}>
                      {content.seo?.description?.length || 0}/160
                    </p>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Google Search Preview
                  </p>
                  <div className="p-3 sm:p-4 rounded-xl bg-card">
                    <p className="text-blue-600 text-base sm:text-lg hover:underline cursor-pointer truncate">
                      {content.seo?.title || 'Addax Automotive - Premium Car Service'}
                    </p>
                    <p className="text-green-700 text-xs sm:text-sm truncate">
                      www.addaxautomotive.in
                    </p>
                    <p className="text-xs sm:text-sm mt-1 line-clamp-2 text-muted-foreground">
                      {content.seo?.description || "India's leading car service network offering quality repairs at transparent prices with doorstep convenience."}
                    </p>
                  </div>
                </div>

                {/* SEO Score */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    SEO Score
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {/* Title Check */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">
                        Title Length
                      </span>
                      {(content.seo?.title?.length || 0) >= 50 && (content.seo?.title?.length || 0) <= 60 ? (
                        <span className="text-green-500 text-xs sm:text-sm">✓ Good</span>
                      ) : (content.seo?.title?.length || 0) > 0 ? (
                        <span className="text-yellow-500 text-xs sm:text-sm">⚠ Adjust</span>
                      ) : (
                        <span className="text-destructive text-xs sm:text-sm">✗ Missing</span>
                      )}
                    </div>

                    {/* Description Check */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">
                        Meta Description
                      </span>
                      {(content.seo?.description?.length || 0) >= 150 && (content.seo?.description?.length || 0) <= 160 ? (
                        <span className="text-green-500 text-xs sm:text-sm">✓ Good</span>
                      ) : (content.seo?.description?.length || 0) > 0 ? (
                        <span className="text-yellow-500 text-xs sm:text-sm">⚠ Adjust</span>
                      ) : (
                        <span className="text-destructive text-xs sm:text-sm">✗ Missing</span>
                      )}
                    </div>

                    {/* Brand Name Check */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">
                        Brand Name in Title
                      </span>
                      {content.seo?.title?.toLowerCase().includes((content.brand?.name || '').toLowerCase()) ? (
                        <span className="text-green-500 text-xs sm:text-sm">✓ Included</span>
                      ) : (
                        <span className="text-yellow-500 text-xs sm:text-sm">⚠ Consider adding</span>
                      )}
                    </div>
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

export default GlobalSettingsEditor;