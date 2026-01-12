import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronRight,
  Globe,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useGlobalContent } from '../../hooks/useContentHooks';
import { useContent } from '../../context/ContentContext';
import ImageUpload from '../shared/ImageUpload';

interface GlobalSettingsEditorProps {
  isDarkMode: boolean;
}

export const GlobalSettingsEditor: React.FC<GlobalSettingsEditorProps> = ({ }) => {
  const { updateField } = useContent();
  const content = useGlobalContent();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['seo', 'ogTags'])
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

  // Calculate SEO score
  const getTitleScore = () => {
    const length = content.seo?.title?.length || 0;
    if (length >= 50 && length <= 60) return { status: 'good', label: '✓ Good', color: 'text-green-500' };
    if (length > 0) return { status: 'warning', label: '⚠ Adjust', color: 'text-yellow-500' };
    return { status: 'error', label: '✗ Missing', color: 'text-destructive' };
  };

  const getDescriptionScore = () => {
    const length = content.seo?.description?.length || 0;
    if (length >= 150 && length <= 160) return { status: 'good', label: '✓ Good', color: 'text-green-500' };
    if (length > 0) return { status: 'warning', label: '⚠ Adjust', color: 'text-yellow-500' };
    return { status: 'error', label: '✗ Missing', color: 'text-destructive' };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
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

                <div className="space-y-2">
                  <label className={labelClass}>Keywords</label>
                  <input
                    type="text"
                    value={content.seo?.keywords || ''}
                    onChange={(e) => handleUpdate('seo.keywords', e.target.value)}
                    placeholder="car service, auto repair, mechanic, car maintenance"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate keywords with commas
                  </p>
                </div>

                {/* Google Search Preview */}
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">Title Length</span>
                      <span className={`text-xs sm:text-sm ${getTitleScore().color}`}>
                        {getTitleScore().label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">Meta Description</span>
                      <span className={`text-xs sm:text-sm ${getDescriptionScore().color}`}>
                        {getDescriptionScore().label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-foreground">Keywords</span>
                      <span className={`text-xs sm:text-sm ${
                        content.seo?.keywords ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        {content.seo?.keywords ? '✓ Added' : '⚠ Consider adding'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Open Graph / Social Sharing */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('ogTags')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('ogTags') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Social Sharing (Open Graph)</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('ogTags') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-border">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 These settings control how your site appears when shared on Facebook, Twitter, LinkedIn, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>
                    <FileText className="w-4 h-4 inline mr-1" />
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={content.seo?.ogTitle || ''}
                    onChange={(e) => handleUpdate('seo.ogTitle', e.target.value)}
                    placeholder="Leave empty to use Page Title"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>OG Description</label>
                  <textarea
                    value={content.seo?.ogDescription || ''}
                    onChange={(e) => handleUpdate('seo.ogDescription', e.target.value)}
                    placeholder="Leave empty to use Meta Description"
                    rows={2}
                    className={inputClass}
                  />
                </div>

                {/* OG Image Upload */}
                <ImageUpload
                  value={content.seo?.ogImage || ''}
                  onChange={(url) => handleUpdate('seo.ogImage', url)}
                  label="OG Image"
                  placeholder="Upload image or enter URL"
                  previewHeight="h-48"
                  maxSizeMB={2}
                  maxWidthOrHeight={1920}
                  helperText="Recommended size: 1200x630 pixels for optimal social sharing"
                  showAltInput={false}
                  compact={false}
                />

                <div className="space-y-2">
                  <label className={labelClass}>Canonical URL</label>
                  <input
                    type="text"
                    value={content.seo?.canonicalUrl || ''}
                    onChange={(e) => handleUpdate('seo.canonicalUrl', e.target.value)}
                    placeholder="https://www.addaxautomotive.in"
                    className={inputClass}
                  />
                </div>

                {/* Social Share Preview */}
                <div className="p-3 sm:p-4 rounded-xl bg-secondary">
                  <p className="text-xs uppercase tracking-wider mb-3 text-muted-foreground">
                    Social Share Preview
                  </p>
                  <div className="rounded-xl border border-border overflow-hidden bg-card">
                    {/* Image placeholder */}
                    <div className="h-32 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      {content.seo?.ogImage ? (
                        <img 
                          src={content.seo.ogImage.startsWith('http') || content.seo.ogImage.startsWith('data:') ? content.seo.ogImage : `${content.seo.ogImage}`} 
                          alt="OG Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground uppercase">
                        addaxautomotive.in
                      </p>
                      <p className="font-semibold text-foreground text-sm mt-1 line-clamp-1">
                        {content.seo?.ogTitle || content.seo?.title || 'Addax Automotive - Premium Car Service'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {content.seo?.ogDescription || content.seo?.description || "India's leading car service network..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Robots & Indexing */}
      <div className={sectionClass}>
        <button onClick={() => toggleSection('robots')} className={sectionHeaderClass}>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div animate={{ rotate: expandedSections.has('robots') ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="font-medium text-foreground text-sm sm:text-base">Robots & Indexing</span>
          </div>
        </button>

        <AnimatePresence>
          {expandedSections.has('robots') && (
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
                    checked={content.seo?.indexable !== false}
                    onChange={(e) => handleUpdate('seo.indexable', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Allow Search Engines to Index</span>
                    <p className="text-xs text-muted-foreground">
                      Enable this for your site to appear in Google search results
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.seo?.followLinks !== false}
                    onChange={(e) => handleUpdate('seo.followLinks', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Allow Search Engines to Follow Links</span>
                    <p className="text-xs text-muted-foreground">
                      Let search engines discover other pages through links
                    </p>
                  </div>
                </label>

                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Generated Robots Meta Tag:</p>
                  <code className="text-xs text-foreground bg-muted px-2 py-1 rounded">
                    {`<meta name="robots" content="${content.seo?.indexable !== false ? 'index' : 'noindex'}, ${content.seo?.followLinks !== false ? 'follow' : 'nofollow'}" />`}
                  </code>
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